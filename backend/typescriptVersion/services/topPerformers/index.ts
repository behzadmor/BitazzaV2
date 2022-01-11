import * as dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import analyse from "./analyse";

/**
 * Returns all price history data about THBpairedInstruments in the time period specified

 * @param {string} fromDate format: 'yyyy-mm-dd'
 * @param {string} toDate format: 'yyyy-mm-dd'
 * @returns {Promise<Array<object>>}
 */
async function getLosersAndGainers(fromDate: string, toDate: string): Promise<object[]> {
  const THBpairedInstruments = await analyse.getTHBpairedInstruments();
  const THBpairedInstrumentsHistoryPrices: object[] = await analyse.getTickerHistory(
    THBpairedInstruments,
    fromDate,
    toDate
  );
  return THBpairedInstrumentsHistoryPrices;
}

/**
 * Returns top five Losers in the time period specified

 * @param {string} fromDate format: 'yyyy-mm-dd'
 * @param {string} toDate format: 'yyyy-mm-dd'
 * @returns {Promise<Array<object>>}
 */
async function topFiveLosers(fromDate: string, toDate: string): Promise<object[]> {
  const historyArr: object[] = await getLosersAndGainers(fromDate, toDate);
  historyArr.sort((a: any, b: any) => a.Gain - b.Gain);
  return historyArr.slice(0, 5);
}

/**
 * Returns top five Gainers in the time period specified

 * @param {string} fromDate format: 'yyyy-mm-dd'
 * @param {string} toDate format: 'yyyy-mm-dd'
 * @returns {Promise<Array<object>>}
 */
async function topFiveGainers(fromDate: string, toDate: string): Promise<object[]> {
  const historyArr: object[] = await getLosersAndGainers(fromDate, toDate);
  historyArr.sort((a: any, b: any) => b.Gain - a.Gain);
  return historyArr.slice(0, 5);
}

/**
 * Returns top five Gainers and Losers in the time period specified

 * @param {string} fromDate format: 'yyyy-mm-dd'
 * @param {string} toDate format: 'yyyy-mm-dd'
 * @returns {Promise<object>}
 */
async function topFiveGainersAndLosers(fromDate: string, toDate: string): Promise<object> {
  const historyArr = await getLosersAndGainers(fromDate, toDate);
  const gainers = historyArr.sort((a: any, b: any) => b.Gain - a.Gain).slice(0, 5);
  const losers = historyArr.sort((a: any, b: any) => a.Gain - b.Gain).slice(0, 5);
  return { gainers, losers };
}


export { topFiveLosers, topFiveGainers, topFiveGainersAndLosers };
