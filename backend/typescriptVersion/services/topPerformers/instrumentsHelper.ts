/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/**
 * @description Helper methods for getting instrument and history data
 */

import { stringify } from "querystring";

/**
 * This function does all needed stringifying on parameters before sending to server.

 * @param {WebSocket} connection WebSocket Object
 * @param {number} m message type
 * @param {number} i sequence number
 * @param {string} n function name
 * @param {object} o payload
 * @returns {string}
 */

function prepareParams(m: number, i: number, n: string, o: object): string {
  const payload: string = JSON.stringify(o);
  return JSON.stringify({ m, i, n, payload });
}

/**
 * Prepare for retrieving a list of instruments available on the exchange, after sending to server.

 * @param {number} OMSID  ID of the Order Management System on which the instruments are available.
 * @returns {string} list of instruments after sending to Websocket
 */

function getInstruments(OMSID: number) {
  const frame = '{"OMSID" : 1}';
  return '{ "m": 0 , "i": 2, "n": "GetInstruments", "{"OMSID" : 1}" }';
}

/**
 * Filters the instruments and retruns which are paired with THB

 * @param {string} instrumentsData all instruments as array of objects
 * @returns {object[]} THBPairedInstruments
 */
function getTHBpairedInstruments(instrumentsData: any) {
  if (typeof instrumentsData === "string") {
    // convert JSON string to Array of Objects
    instrumentsData = JSON.parse(instrumentsData);
  }
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  console.log('result', JSON.parse(instrumentsData.o));
  
  const result: any[] = JSON.parse(instrumentsData.o);
  const THBpaired: {InstrumentId: string; Symbol: string; Product1Symbol: string; Product2Symbol: string }[] = result.filter((value) =>
    value.Symbol.includes("THB")
  );
  // filerts instruments for finding THB paired
  return THBpaired;
}

/**
 * Requests a ticker history (high, low, open, close, etc) of a specific instrument from a given date to the present.

 * @param {number} InstrumentId The ID of a specific instrument.
 * @param {number} Interval The time between ticks, in seconds.
 * @param {string} FromDate Oldest date from which the ticker history will start.
 * @param {string} ToDate Most recent date, at which the ticker history will end.
 * @param {number} OMSId The ID of the Order Management System where the ticker history comes from.
 */
function getTickerHistory(
  InstrumentId: number,
  FromDate: string,
  ToDate: string,
  Interval: number
) {
  const frame = {
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
 * @returns {object}
 */
function ConvertDate(timestamp: number): { fulldate: string, time: number } {
  const date = new Date(timestamp);
  const fulldate: string =
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 <= 9
      ? "0" + String(date.getMonth() + 1)
      : String(date.getMonth() + 1)) +
    "-" +
    (date.getDate() <= 9
      ? "0" + String(date.getDate())
      : String(date.getDate()));
  const time: number = date.getHours() + date.getMinutes() + date.getSeconds();
  return { fulldate, time };
}

/**
 *
 * @param {object} historyObject history data of instruments
 * @returns {object[]} returns gain or lose for instruments according to price history
 */
function instrumentsGain(historyObject: { [InstrumentId: string]: {Symbol: string; finishData: number[]; startData: number[]} }): {Symbol: string, Gain: number}[] {
  const result: {Symbol: string, Gain: number}[] = [];
  for (const key in historyObject) {
    const value = historyObject[key];
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
function addDays(dateString: string, days = 1): string {
  const date = new Date(dateString);
  const newDate = new Date(dateString);
  newDate.setDate(date.getDate() + days);
  return ConvertDate(newDate.valueOf()).fulldate;
}

/**
 *
 * @param {string} dateString date as a string
 * @param {number} days days to subtract from date
 * @returns {string} subtracts desired days from date and returns date string
 */
function subtractDays(dateString: string, days = 1): string {
  const date = new Date(dateString);
  const newDate = new Date(dateString);
  newDate.setDate(date.getDate() - days);
  return ConvertDate(newDate.valueOf()).fulldate;
}

function twoDaysBefore(dateString: string): string[] {
  const date: string = new Date(dateString).toString();
  const [one, two] = [dateString, subtractDays(date, 3)];
  return [one, two];
}

function twoDaysAfter(dateString: string): string[] {
  const date: string = new Date(dateString).toString();
  const [one, two] = [dateString, addDays(date, 3)];
  return [one, two];
}

/**
 * creating an object (DataStructure) which contains property 'InstrumentId' and values 'Symbol,startData,finishData'
 * for each instrument

 * @param {object[]} instruments
 * @return {object} format: {instrumentId: {Symbol, startData, finishData}}
 */
function createHistoryDataStructureForInstruments(instruments: { InstrumentId: string; Symbol: string; Product1Symbol: string; Product2Symbol: string}[]) {
  const result: {
    [InstrumentId: string]: {
      Symbol: string;
      startData: number[];
      finishData: number[];
    }
  } = {
    "0": {
      Symbol: "0",
      startData: [0],
      finishData: [0],
    }
  }

  for (const instrument of instruments) {
    // creating data object for every instrument
    const InstrumentId = String(instrument.InstrumentId); // gets Instrument Id
    result[InstrumentId] = {
      Symbol: instrument.Symbol,
      startData: [],
      finishData: [],
    }; // assign data for each instrument
  }
  return result;
}

export default {
  instrumentsGain,
  twoDaysBefore,
  twoDaysAfter,
  getInstruments,
  getTHBpairedInstruments,
  getTickerHistory,
  createHistoryDataStructureForInstruments,
};
