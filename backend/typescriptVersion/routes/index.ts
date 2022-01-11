/**
 * Partitioning all routes to different modules(services).
 * Although for this task we have just one module named 'topPerformers'
 */

import { Router } from "express";
import topPerformersRouter from "./topPerformers.routes";

const apiRouter = Router();

apiRouter.use("/api/topPerformers", topPerformersRouter);

export default apiRouter;
