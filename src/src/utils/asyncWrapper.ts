import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import StaticStringKeys from "../constants";
import { BadRequestError } from "../errors/app.errors";
import UserRepository from "../repositories/user.repository";
import { getUnAuthorizedRoutes, getValidateRoutes, response } from "./utils";
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
          return res.status(403).send(response(null,null,"A token is required for authentication"));
        }
        try {
          const userRepository = new UserRepository()
          // const decoded = jwt.verify(token, process.env.TOKEN_KEY);
          let user:any = await userRepository.find({token: token},1,1);
          if(!(Array.isArray(user) && user.length > 0)) {
            throw new BadRequestError(StaticStringKeys.TOKEN_NOT_VALID);
          }
          req.user = user[0];
          if(!(getValidateRoutes().includes(req.originalUrl))){
            if(!req.user.isActive) return res.status(401).send(response(null,null,"User is not active please active user through otp validation process"));
          }
            await jwt.verify(token, process.env.TOKEN_KEY);
          } catch (err) {
          return res.status(401).send(response(null,null,"Unauthorized"));
        }
      }
      await controller(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
