/**
 * @description Responsible for  starting the API Server.
 */
require("dotenv").config({ path: "./config/config.env" });

const Server = require("./expressAppCreator"); //* Create an API Server
const middlewares = require("./middlewares"); //* middleware initialization
const apiRouter = require("./routes"); //* api servies routes
const {
  centralErrorHandler,
} = require("./services/system/centralErrorHandling"); //* Central Error Handling Function

const { PORT } = process.env;

const HttpServer = new Server(
  Number(PORT),
  middlewares,
  apiRouter,
  centralErrorHandler
);

module.exports = HttpServer.start(); // to be able to be used in tests
