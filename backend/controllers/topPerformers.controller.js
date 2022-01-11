/**
 * @description all controllers associated with topPerformers module.
 */

const { AppError } = require("../services/system/centralErrorHandling");
const topPerformers = require("../services/topPerformers/index");

/**
 * Returns top five Gainers in the time period specified
 */
async function topGainers(req, res, next) {
  try {
    const { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      throw new AppError(400, "Missing required fromDate or toDate fields.");
    }

    if (new Date(fromDate) > new Date(toDate)) {
      throw new AppError(
        400,
        "fromDate field should be less than or equal to toDate field."
      );
    }

    const result = await topPerformers.topFiveGainers(fromDate, toDate);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Returns top five Losers in the time period specified
 */
async function topLosers(req, res, next) {
  try {
    const { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      throw new AppError(400, "Missing required fromDate or toDate fields.");
    }

    if (new Date(fromDate) > new Date(toDate)) {
      throw new AppError(
        400,
        "fromDate field should be less than or equal to toDate field."
      );
    }

    const result = await topPerformers.topFiveLosers(fromDate, toDate);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Returns both top five Gainers and top five Losers in the time period specified
 */
async function topFiveGainersAndLosers(req, res, next) {
  try {
    const { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      throw new AppError(400, "Missing required fromDate or toDate fields.");
    }

    if (new Date(fromDate) > new Date(toDate)) {
      throw new AppError(
        400,
        "fromDate field should be less than or equal to toDate field."
      );
    }

    const result = await topPerformers.topFiveGainersAndLosers(
      fromDate,
      toDate
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Redirects to login page
 */
function login(req, res) {
  return res.send("/");
}

module.exports = {
  topGainers,
  topLosers,
  topFiveGainersAndLosers,
  login,
};
