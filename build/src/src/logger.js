"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, label, timestamp, printf } = winston_1.format;
// Make sure this exists
const LOG_FILE_PATH = 'logs/error.log';
const file = new winston_1.transports.File({ filename: LOG_FILE_PATH, level: 'error' });
const console = new winston_1.transports.Console();
const logFormat = printf(({ level, message, label: logLabel, timestamp: logTimestamp }) => {
    return `${logTimestamp} [${logLabel}] ${level}: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(label({ label: process.env.NODE_ENV }), timestamp(), logFormat),
    transports: [file],
});
if (process.env.NODE_ENV !== 'production') {
    logger.remove(file);
    logger.add(console);
}
exports.default = logger;
//# sourceMappingURL=logger.js.map