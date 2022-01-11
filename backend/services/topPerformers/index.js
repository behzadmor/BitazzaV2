require("dotenv").config({ path: "./config/config.env" });
const analyse = require("./analyse");

/**
 * Returns all price history data about THBpairedInstruments in the time period specified
 * @param {string} fromDate format: 'yyyy-mm-dd'
 * @param {string} toDate format: 'yyyy-mm-dd'
 * @returns {Promise<Array<object>>}
 */
async function getLosersAndGainers(fromDate, toDate) {
  const THBpairedInstruments = await analyse.getTHBpairedInstruments();
  const THBpairedInstrumentsHistoryPrices = await analyse.getTickerHistory(
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
async function topFiveLosers(fromDate, toDate) {
  let historyArr = await getLosersAndGainers(fromDate, toDate);
  historyArr.sort((a, b) => a.Gain - b.Gain);
  return historyArr.slice(0, 5);
}

/**
 * Returns top five Gainers in the time period specified
 * @param {string} fromDate format: 'yyyy-mm-dd'
 * @param {string} toDate format: 'yyyy-mm-dd'
 * @returns {Promise<Array<object>>}
 */
async function topFiveGainers(fromDate, toDate) {
  let historyArr = await getLosersAndGainers(fromDate, toDate);
  historyArr.sort((a, b) => b.Gain - a.Gain);
  return historyArr.slice(0, 5);
}

/**
 * Returns top five Gainers and Losers in the time period specified
 * @param {string} fromDate format: 'yyyy-mm-dd'
 * @param {string} toDate format: 'yyyy-mm-dd'
 * @returns {Promise<Array<object>>}
 */
async function topFiveGainersAndLosers(fromDate, toDate) {
  let historyArr = await getLosersAndGainers(fromDate, toDate);
  const gainers = historyArr.sort((a, b) => b.Gain - a.Gain).slice(0, 5);
  const losers = historyArr.sort((a, b) => a.Gain - b.Gain).slice(0, 5);
  return { gainers, losers };
}

module.exports = { topFiveLosers, topFiveGainers, topFiveGainersAndLosers };
