"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = exports.getMailConfig = exports.getOTPConfig = exports.getValidateRoutes = exports.getUnAuthorizedRoutes = exports.getValidObjectId = exports.mkdir = exports.exists = void 0;
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
        '/user',
        '/login',
    ];
}
exports.getUnAuthorizedRoutes = getUnAuthorizedRoutes;
function getValidateRoutes() {
    return [
        '/sendotp',
        '/validateotp',
    ];
}
exports.getValidateRoutes = getValidateRoutes;
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
function response(error, data, message) {
    const payload = {
        errors: error,
        data: data,
        message: message
    };
    return payload;
}
exports.response = response;
//# sourceMappingURL=utils.js.map