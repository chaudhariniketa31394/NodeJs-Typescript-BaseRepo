"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const logger_1 = require("./logger");
const app = express();
/**
 * Setup listener port
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger_1.default.info(`Running Node.js version ${process.version}`);
    logger_1.default.info(`App environment: ${process.env.NODE_ENV}`);
    logger_1.default.info(`App is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map