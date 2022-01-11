/**
 * @description all routes associated with topPerformers module.
 */

import { Router } from "express";
import topPerformersController from "../controllers/topPerformers.controller";

const apiRouter = Router();

apiRouter.get("/ping", (req, res) => res.send("pong")); // just for testing purposes

/**
 * Returns top five Gainers in the time period specified
 */
apiRouter.post("/topGainers", topPerformersController.topGainers);

/**
 * Returns top five Losers in the time period specified
 */
apiRouter.post("/topLosers", topPerformersController.topLosers);

/**
 * Returns both top five Gainers and top five Losers in the time period specified
 */
apiRouter.post(
  "/topFiveGainersAndLosers",
  topPerformersController.topFiveGainersAndLosers
);

/**
 * Redirects to front-end Login Page
 */
apiRouter.get("/login", topPerformersController.login);

export default apiRouter;
