/**
 * Partitioning all routes to different modules(services). Although for this task we have just one module named 'topPerformers'
 */

const { Router } = require("express");
const topPerformersRouter = require("./topPerformers.routes");

const apiRouter = Router();

apiRouter.use("/api/topPerformers", topPerformersRouter);

module.exports = apiRouter;
