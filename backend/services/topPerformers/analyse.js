/**
 * @description Analysing historical data and find top losers and gainers
 */

require("dotenv").config({ path: "./config/config.env" });
const instrumentsHelper = require("./instrumentsHelper");
const WebSocket = require("ws");

const { WEBSOCKETHOST } = process.env; // gets websocket host address

/**
 * Returns all Instruments in which one side is THB
 * @returns {Promise<Object[]>} all Instruments in which one side is THB
 */
function getTHBpairedInstruments() {
  return new Promise((resolve, reject) => {
    const conn1 = new WebSocket(WEBSOCKETHOST); // create WebSocket Object
    conn1.onopen = function () {
      // when connection is established
      conn1.send(instrumentsHelper.getInstruments(1)); // OMSID is considered 1
    };

    conn1.onmessage = function (message) {
      let response = JSON.parse(message.data);

      if (response.n === "GetInstruments") {
        const THBpairedInstruments =
          instrumentsHelper.getTHBpairedInstruments(response);
        const result = [];
        THBpairedInstruments.forEach((element) => {
          result.push({
            InstrumentId: element.InstrumentId,
            Symbol: element.Symbol,
            Product1Symbol: element.Product1Symbol,
            Product2Symbol: element.Product2Symbol,
          });
        });
        resolve(result);
      }
      conn1.close();
    };
  });
}

/**
 *
 * @param {Object[]} instruments THBpairedInstruments
 * @param {string} fromDate format: 'yyyy-mm-dd'
 * @param {string} toDate format: 'yyyy-mm-dd'
 * @returns {Promise<Object>} Returns all price historical data about Instruments in which one side is THB
 */
function getTickerHistory(instruments, fromDate, toDate) {
  return new Promise((resolve, reject) => {
    const conn = new WebSocket(WEBSOCKETHOST); // create WebSocket Object for getting history data after fromDate
    const connend = new WebSocket(WEBSOCKETHOST); // create WebSocket Object for getting history data before toDate
    let result = {}; // final price history is stored in result
    var iteration = 0; // to find out when to stop getting data from server
    var end = 0;

    if (
      // if time frame is one or two days
      fromDate === toDate ||
      Math.ceil(
        (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
      ) <= 2
    ) {
      // if one day is our time frame
      var [from, to] = [fromDate, toDate];
      var [from1, to1] = [fromDate, toDate];
    } else {
      // if time frame is more than two days, time frame will be comprimised of two days after fromDate and two days before toDate
      // the target is narrowing search range for finding history data
      var [from, to] = instrumentsHelper.twoDaysAfter(fromDate); // return two days after fromDate
      var [to1, from1] = instrumentsHelper.twoDaysBefore(toDate); // return two days before toDate
    }

    result =
      instrumentsHelper.createHistoryDataStructureForInstruments(instruments);

    /**
     *  when connection is established find StartTimeFrame Prices
     */
    conn.onopen = function () {
      for (const instrument of instruments) {
        let InstrumentId = instrument["InstrumentId"];
        conn.send(
          instrumentsHelper.getTickerHistory(InstrumentId, from, to, 3600)
        );
      }
    };

    /**
     *  when connection is established find EndTimeFrame Prices
     */
    connend.onopen = function () {
      for (const instrument of instruments) {
        // filling data object for every instrument from finish date range
        let InstrumentId = instrument["InstrumentId"];
        if (!result[InstrumentId].finishData.length) {
          // if no data retrived for finish date range of the instrument
          connend.send(
            instrumentsHelper.getTickerHistory(InstrumentId, from1, to1, 3600)
          );
        }
      }
    };

    conn.onmessage = function (message) {
      let response = JSON.parse(message.data);
      iteration++;
      if (
        response.n === "GetTickerHistory" &&
        JSON.parse(response["o"]).length
      ) {
        let InstrumentId = JSON.parse(response["o"])[0][8]; // InstrumentId is in 8th element of the array
        if (!result[InstrumentId].startData.length) {
          // check if we have retrived start date ranage data
          result[InstrumentId].startData.push(JSON.parse(response["o"])[0][4]); // close price is in 4th element of the array
        }
      }
    };

    connend.onmessage = function (message) {
      let response = JSON.parse(message.data);
      if (
        response.n === "GetTickerHistory" &&
        JSON.parse(response["o"]).length
      ) {
        iteration++;
        let last = JSON.parse(response["o"]).length - 1;
        let InstrumentId = JSON.parse(response["o"])[last][8]; // InstrumentId is in 8th element of the array

        if (!result[InstrumentId].finishData.length) {
          // if we have retrived start date ranage data lets get end date history data
          result[InstrumentId].finishData.push(
            JSON.parse(response["o"])[last][4]
          ); // close price is in 4th element of the array
        }
      }
    };

    /**
     * Determine when to stop reading from server and resolve the promise.
     * when there is no message from websocket for at least 3 seconds , resolve the promise and close the conncections.
     */
    myInterval = setInterval(() => {
      if (iteration > end) {
        // continue reading from server
        end = iteration;
      } else if (iteration === end) {
        // stop reading from server
        const final = instrumentsHelper.instrumentsGain(result);
        resolve(final);
        conn.close();
        connend.close();
        clearInterval(myInterval);
      }
    }, 3000);
  });
}

module.exports = { getTickerHistory, getTHBpairedInstruments };
