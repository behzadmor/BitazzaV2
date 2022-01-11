// * general middlewares that run on all requests

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

const { Router } = express;
const middlewareRouter = Router();
middlewareRouter
  .use(cors())
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // { explorer: true }

module.exports = middlewareRouter;
