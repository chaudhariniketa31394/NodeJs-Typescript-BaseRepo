"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const jwt = require("jsonwebtoken");
// Wraps async functions, catching all errors and sending them forward to express error handler
function asyncWrap(controller) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!((0, utils_1.getUnAuthorizedRoutes)().includes(req.originalUrl))) {
                const token = req.body.token || req.query.token || req.headers["x-access-token"];
                if (!token) {
                    return res.status(403).send("A token is required for authentication");
                }
                try {
                    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
                    req.user = decoded;
                }
                catch (err) {
                    return res.status(401).send(err.message);
                }
            }
            yield controller(req, res, next);
        }
        catch (e) {
            next(e);
        }
    });
}
exports.default = asyncWrap;
//# sourceMappingURL=asyncWrapper.js.map