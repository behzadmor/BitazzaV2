"use strict";
/**
 * @description Responsible for starting the API Server.
 */

import envars from "./helpers/envHelper";
import Server from "./expressAppCreator"; //* Create an API Server
import middlewares from "./middlewares"; //* middleware initialization
import apiRouter from "./routes"; //* api servies routes
import { centralErrorHandler } from "./services/system/centralErrorHandling"; //* Central Error Handling Function

const HTTPSERVER = new Server(
  envars.PORT,
  middlewares,
  apiRouter,
  centralErrorHandler
);
HTTPSERVER.start();
