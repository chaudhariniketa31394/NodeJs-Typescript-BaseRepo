"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const utils_1 = require("./utils");
const otpGenerator = require('otp-generator');
const { OTP_LENGTH, OTP_CONFIG } = (0, utils_1.getOTPConfig)();
function generateOTP() {
    const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
    return OTP;
}
exports.generateOTP = generateOTP;
;
//# sourceMappingURL=otpUtil.js.map