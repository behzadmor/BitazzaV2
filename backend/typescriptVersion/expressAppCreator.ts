/**
 * @description Configure everything that has to do with Express application.
 */
import express, { Express, Request, Response, NextFunction, Router } from "express";
import serveStatic from "serve-static";

/** @class Configuring and running an Express Server. */
class Server {
  /**
   * @description Configuring server
   * @param {number} port
   */

  port: number;
  express: Express;

  constructor(port: number, middlewaresRouter: Router, apiRouter: Router, globalErrorHandler: any) {
    this.port = port;
    this.express = express();
    this.express.use(middlewaresRouter);
    this.express.use(apiRouter);
    this.express.use(serveStatic("dist")); // * place react dist files after building react project

    // Fake Login for test FIXME: remove this
    this.express.use("/test", (req: Request, res: Response) => {
      res.send({
        token: "test123",
        name: "behzad",
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.express.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      globalErrorHandler(err, res);
    });
  }

  /**
   * @description starts a web server on the specified port
   */
  start() {
    this.express.listen(this.port, () =>
      // eslint-disable-next-line no-console
      console.log(`⚡️ The Express Server is running on port number ${this.port}`)
    );
  }
}

export default Server;
