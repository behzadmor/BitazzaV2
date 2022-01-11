/**
 * @description all routes associated with topPerformers module.
 */

const { Router } = require("express");

const apiRouter = Router();
const topPerformersController = require("../controllers/topPerformers.controller");

apiRouter.get("/ping", (req, res) => res.status(200).send("pong")); // just for testing purposes

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

module.exports = apiRouter;
