import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { getUnAuthorizedRoutes } from "./utils";

const jwt = require("jsonwebtoken");

// Wraps async functions, catching all errors and sending them forward to express error handler
export default function asyncWrap(controller: CallableFunction) {
  return async (
    req: ExpressRequest | any,
    res: ExpressResponse,
    next: NextFunction
  ) => {
    try {
      if (!(getUnAuthorizedRoutes().includes(req.originalUrl))) {
        const token =
          req.body.token || req.query.token || req.headers["x-access-token"];

        if (!token) {
          return res.status(403).send("A token is required for authentication");
        }
        try {
          const decoded = jwt.verify(token, process.env.TOKEN_KEY);
          req.user = decoded;
        } catch (err) {
          return res.status(401).send(err.message);
        }
      }
      await controller(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
