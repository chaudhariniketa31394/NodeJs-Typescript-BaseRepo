import { getOTPConfig } from "./utils";

const otpGenerator = require('otp-generator');

const { OTP_LENGTH, OTP_CONFIG } = getOTPConfig();

export function generateOTP(){
  const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
  return OTP;
};