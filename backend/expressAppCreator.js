/* eslint-disable no-console */
/**
 * @description Configure everything that has to do with Express application.
 */
const express = require("express");
const serveStatic = require("serve-static");

/** @class Configuring and running an Express Server. */
class Server {
  /**
   * @description Configuring server
   * @param {number} port
   */
  constructor(port, middlewaresRouter, apiRouter, centralErrorHandler) {
    this.port = port;
    this.express = express();
    this.express.use(middlewaresRouter);
    this.express.use(apiRouter);
    this.express.use(serveStatic("dist")); // * place react dist files after building react project
    this.express.use((err, req, res, next) => {
      centralErrorHandler(err, res);
    });
  }

  /**
   * @description starts a web server on the specified port
   */
  start() {
    const app = this.express.listen(this.port, () =>
      console.log(`The Express Server is running on port number ${this.port}`)
    );
    return app; // for using in tests
  }
}

module.exports = Server;
