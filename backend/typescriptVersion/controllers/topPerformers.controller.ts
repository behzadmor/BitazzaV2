/**
 * @description all controllers associated with topPerformers module.
 */
import { Request, Response, NextFunction } from "express";
import { AppError } from "../services/system/centralErrorHandling";
import {
  topFiveLosers,
  topFiveGainers,
  topFiveGainersAndLosers as _topFiveGainersAndLosers,
} from "../services/topPerformers/index";

/**
 * Returns top five Gainers in the time period specified
 */
async function topGainers(req: Request, res: Response, next: NextFunction) {
  try {
    const { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      throw new AppError(404, "Missing required fromDate or toDate fields.");
    }

    if (new Date(fromDate) > new Date(toDate)) {
      throw new AppError(
        404,
        "fromDate field should be less than or equal to toDate field."
      );
    }

    const result = await topFiveGainers(fromDate, toDate);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Returns top five Losers in the time period specified
 */
async function topLosers(req: Request, res: Response, next: NextFunction) {
  try {
    const { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      throw new AppError(404, "Missing required fromDate or toDate fields.");
    }

    if (new Date(fromDate) > new Date(toDate)) {
      throw new AppError(
        404,
        "fromDate field should be less than or equal to toDate field."
      );
    }

    const result = await topFiveLosers(fromDate, toDate);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Returns both top five Gainers and top five Losers in the time period specified
 */
async function topFiveGainersAndLosers(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      throw new AppError(404, "Missing required fromDate or toDate fields.");
    }

    if (new Date(fromDate) > new Date(toDate)) {
      throw new AppError(
        404,
        "fromDate field should be less than or equal to toDate field."
      );
    }

    const result = await _topFiveGainersAndLosers(
      fromDate,
      toDate
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Redirects to Login page
 */
function login(req: Request, res: Response) {
  return res.send("/");
}

export default {
  topGainers,
  topLosers,
  topFiveGainersAndLosers,
  login,
};
