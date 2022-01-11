/**
 * @description Helper methods for getting instrument and history data
 */

/**
 * This function does all needed stringifying on parameters before sending to server.
 * @param {WebSocket} connection WebSocket Object
 * @param {number} m message type
 * @param {number} i sequence number
 * @param {string} n function name
 * @param {JSON} o payload
 * @returns {JSON}
 */

function prepareParams(m, i, n, o) {
  o = JSON.stringify(o);
  return JSON.stringify({ m, i, n, o });
}

/**
 * Retrieves a list of instruments available on the exchange, after sending to server.
 * @param {Number} OMSID  ID of the Order Management System on which the instruments are available.
 * @returns {JSON} list of instruments after sending to Websocket
 */

function getInstruments(OMSID) {
  let frame = {
    OMSID,
  };
  return prepareParams(0, 2, "GetInstruments", frame);
}

/**
 * Retrieves the details of a specific instrument from the Order Management System of the trading venue.
 * @param {Number} OMSId  ID of the Order Management System on which the instruments are available.
 * @param {Number} InstrumentId
 * @returns {JSON} list of instruments after sending to Websocket
 */

function getInstrument(OMSId, InstrumentId) {
  let frame = {
    OMSId,
    InstrumentId,
  };
  return prepareParams(0, 0, "GetInstrument", frame);
}

/**
 * Filters the instruments and retruns which are paired with THB
 * @param {JSON} instrumentsData all instruments
 * @returns {Array<Object>} THBPairedInstruments
 */
function getTHBpairedInstruments(instrumentsData) {
  let result;
  if (typeof instrumentsData === "string") {
    // convert JSON string to Array of Objects
    instrumentsData = JSON.parse(instrumentsData);
  }
  result = JSON.parse(instrumentsData["o"]);

  const THBpaired = result.filter((value) => value.Symbol.includes("THB")); // filerts instruments for finding THB paired
  return THBpaired;
}

/**
 * Requests a ticker history (high, low, open, close, volume, bid, ask, ID) of a specific instrument from a given date to the present.
 * @param {number} InstrumentId The ID of a specific instrument.
 * @param {number} Interval The time between ticks, in seconds.
 * @param {string} FromDate Oldest date from which the ticker history will start.
 * @param {string} ToDate Most recent date, at which the ticker history will end.
 * @param {number} OMSId The ID of the Order Management System where the ticker history comes from.
 */
function getTickerHistory(InstrumentId, FromDate, ToDate, Interval) {
  let frame = {
    InstrumentId,
    Interval,
    FromDate,
    ToDate,
    OMSId: 1,
  };
  return prepareParams(0, 4, "GetTickerHistory", frame);
}

/**
 * converts timestamp to object of strings
 * @param {number} timestamp
 * @returns {Object}
 */
function ConvertDate(timestamp) {
  var date = new Date(timestamp);
  const fulldate =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 <= 9
      ? "0" + String(date.getMonth() + 1)
      : String(date.getMonth() + 1)) +
    "-" +
    (date.getDate() <= 9
      ? "0" + String(date.getDate())
      : String(date.getDate()));
  const time = date.getHours() + date.getMinutes() + date.getSeconds();
  return { fulldate, time };
}

/**
 *
 * @param {Object} historyObject history data of instruments
 * @returns {Object[]} returns gain or lose for instruments according to price history
 */
function instrumentsGain(historyObject) {
  let result = [];
  for (const key in historyObject) {
    let value = historyObject[key];
    if (value.finishData.length && value.startData.length)
      result.push({
        Symbol: value.Symbol,
        Gain: value.finishData[0] - value.startData[0],
      });
  }
  return result;
}

/**
 *
 * @param {string} dateString date as a string
 * @param {number} days days to add to date
 * @returns {string} add desired days to date and returns date string
 */
function addDays(dateString, days = 1) {
  let date = new Date(dateString);
  let newDate = new Date(dateString);
  newDate.setDate(date.getDate() + days);
  return ConvertDate(newDate).fulldate;
}

/**
 *
 * @param {string} dateString date as a string
 * @param {number} days days to subtract from date
 * @returns {string} subtracts desired days from date and returns date string
 */
function subtractDays(dateString, days = 1) {
  let date = new Date(dateString);
  let newDate = new Date(dateString);
  newDate.setDate(date.getDate() - days);
  return ConvertDate(newDate).fulldate;
}

function twoDaysBefore(dateString) {
  const date = new Date(dateString);
  return ([one, two] = [dateString, subtractDays(date, 3)]);
}

function twoDaysAfter(dateString) {
  const date = new Date(dateString);
  return ([one, two] = [dateString, addDays(date, 3)]);
}

/**
 * creating an object (DataStructure) which contains property 'InstrumentId' and values 'Symbol,startData,finishData' for each instrument
 * @param {Object[]} instruments
 * @return {Object} format: {instrumentId: {Symbol, startData, finishData}}
 */
function createHistoryDataStructureForInstruments(instruments) {
  let result = {};
  for (const instrument of instruments) {
    // creating data object for every instrument
    let InstrumentId = String(instrument["InstrumentId"]); // gets Instrument Id
    result[InstrumentId] = {
      Symbol: instrument["Symbol"],
      startData: [],
      finishData: [],
    }; // assign data for each instrument
  }
  return result;
}

module.exports = {
  instrumentsGain,
  twoDaysBefore,
  twoDaysAfter,
  getInstruments,
  getTHBpairedInstruments,
  getTickerHistory,
  createHistoryDataStructureForInstruments,
};
