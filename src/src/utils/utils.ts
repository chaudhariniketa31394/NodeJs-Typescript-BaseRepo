import { ObjectID } from 'mongodb';
import * as fs from 'fs';
import * as utils from 'util';
import { InvalidIdError } from '../errors/app.errors';

// Promisify some utility functions
export const exists = utils.promisify(fs.exists);
export const mkdir = utils.promisify(fs.mkdir);

export function getValidObjectId(id: string | ObjectID) {
  if (!ObjectID.isValid(id)) {
    throw new InvalidIdError();
  }

  if (typeof id === 'string') {
    id = new ObjectID(id);
  }

  return id;
}

export function getUnAuthorizedRoutes(): string[] {
  return [
    '/users',
    '/login',
    '/task',
    '/tasks'
  ]
}

export function getOTPConfig(): any{
  return {
    OTP_LENGTH: 4,
    OTP_CONFIG: {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        numbers: true,
        specialCharacters: false
    },
  }
}

export function getMailConfig(): any{
  return {
    MAIL_SETTINGS: {
      service: 'gmail',
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    },
  }
}

export function response(error?:any,data?:any, message?:any){
  const payload = {
      errors:error,
      data:data,
      message:message
  }
  return payload;
}