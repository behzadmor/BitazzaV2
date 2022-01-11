// * general middlewares that run on all requests

import { Router , urlencoded, json } from "express";
import cors from "cors";

const middlewareRouter = Router();
middlewareRouter
  .use(cors())
  .use(urlencoded({ extended: true }))
  .use(json());

export default middlewareRouter;
