"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailConfig = exports.getOTPConfig = exports.getUnAuthorizedRoutes = exports.getValidObjectId = exports.mkdir = exports.exists = void 0;
const mongodb_1 = require("mongodb");
const fs = require("fs");
const utils = require("util");
const app_errors_1 = require("../errors/app.errors");
// Promisify some utility functions
exports.exists = utils.promisify(fs.exists);
exports.mkdir = utils.promisify(fs.mkdir);
function getValidObjectId(id) {
    if (!mongodb_1.ObjectID.isValid(id)) {
        throw new app_errors_1.InvalidIdError();
    }
    if (typeof id === 'string') {
        id = new mongodb_1.ObjectID(id);
    }
    return id;
}
exports.getValidObjectId = getValidObjectId;
function getUnAuthorizedRoutes() {
    return [
        '/users',
        '/login'
    ];
}
exports.getUnAuthorizedRoutes = getUnAuthorizedRoutes;
function getOTPConfig() {
    return {
        OTP_LENGTH: 4,
        OTP_CONFIG: {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            numbers: true,
            specialCharacters: false
        },
    };
}
exports.getOTPConfig = getOTPConfig;
function getMailConfig() {
    return {
        MAIL_SETTINGS: {
            service: 'gmail',
            auth: {
                user: process.env.MAIL_EMAIL,
                pass: process.env.MAIL_PASSWORD,
            },
        },
    };
}
exports.getMailConfig = getMailConfig;
//# sourceMappingURL=utils.js.map