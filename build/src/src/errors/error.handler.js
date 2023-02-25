"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_errors_1 = require("./app.errors");
const mongodb_1 = require("mongodb");
const logger_1 = require("../logger");
function default_1(app) {
    /**
     * Handle errors
     */
    // If you are lost
    app.use(() => {
        throw new app_errors_1.NotFoundError('You are lost');
    });
    // Request error handler
    app.use((err, _req, res, next) => {
        if (err instanceof app_errors_1.ApplicationError) {
            if (err.message) {
                logger_1.default.info(err.message);
                return res.status(err.code).send(err.message);
            }
            else {
                return res.sendStatus(err.code);
            }
        }
        next(err);
    });
    // Log all errors
    app.use(function (err, req, res, next) {
        const userString = 'unknown user';
        if (err instanceof mongodb_1.MongoError) {
            if (err.code === 11000) {
                logger_1.default.error(`${req.method} ${req.path}: MongoDB duplicate entry from ${userString}`);
            }
            else {
                logger_1.default.error(`${req.method} ${req.path}: Unhandled MongoDB error ${userString}. ${err.errmsg}`);
            }
            if (!res.headersSent) {
                return res.sendStatus(500);
            }
        }
        else if (err instanceof Error) {
            logger_1.default.error(`${req.method} ${req.path}: Unhandled request error ${userString}. ${err.message}`);
        }
        else if (typeof err === 'string') {
            logger_1.default.error(`${req.method} ${req.path}: Unhandled request error ${userString}. ${err}`);
        }
        next(err);
    });
    // Optional fallthrough error handler
    app.use(function onError(err, _req, res, _next) {
        res.statusCode = 500;
        res.end(err.message + '\n');
    });
}
exports.default = default_1;
//# sourceMappingURL=error.handler.js.map