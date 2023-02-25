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
const source_map_support_1 = require("source-map-support");
(0, source_map_support_1.install)();
const dotenv = require("dotenv");
dotenv.config();
require("reflect-metadata");
const express = require("express");
const compress = require("compression");
const server_1 = require("./server");
const cors = require("cors");
const routes_1 = require("./routes");
const error_handler_1 = require("./errors/error.handler");
const logger_1 = require("./logger");
const database_1 = require("./database");
/**
 * This is a bootstrap function
 */
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        // Attach HTTP request info logger middleware in test mode
        if (process.env.NODE_ENV === 'test') {
            server_1.default.use((req, _res, next) => {
                logger_1.default.debug(`[${req.method}] ${req.hostname}${req.url}`);
                next();
            });
        }
        server_1.default.disable('x-powered-by'); // Hide information
        server_1.default.use(compress()); // Compress
        // Enable middleware/whatever only in Production
        if (process.env.NODE_ENV === 'production') {
            // For example: Enable sentry in production
            // app.use(Sentry.Handlers.requestHandler());
        }
        /**
         * Configure cors
         */
        server_1.default.use(cors());
        /**
         * Configure mongoose
         **/
        if (!database_1.default.isDbConnected()) {
            yield database_1.default.connect();
        }
        /**
         * Configure body parser
         */
        server_1.default.use(express.json());
        server_1.default.use(express.urlencoded({ extended: true }));
        /**
         * Configure routes
         */
        (0, routes_1.default)(server_1.default);
        /**
         * Configure error handler
         */
        (0, error_handler_1.default)(server_1.default);
    });
}
// Need for integration testing
exports.default = server_1.default;
// Invoking the bootstrap function
bootstrap()
    .then(() => {
    logger_1.default.info('Server is up');
})
    .catch((error) => {
    logger_1.default.error('Unknown error. ' + error.message);
    throw new Error('Unknown error. ' + error.message);
});
//# sourceMappingURL=app.js.map