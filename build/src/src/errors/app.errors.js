"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryMissingField = exports.InvalidIdError = exports.InvalidTokenError = exports.InvalidCredentialError = exports.InternalError = exports.MissingFieldError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.ApplicationError = void 0;
const constants_1 = require("../constants");
class ApplicationError extends Error {
    constructor(code, message, ...args) {
        super(...args);
        this.code = null;
        this.code = code;
        this.message = message;
    }
}
exports.ApplicationError = ApplicationError;
class BadRequestError extends ApplicationError {
    constructor(message, ...args) {
        super(400, message, ...args);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends ApplicationError {
    constructor(message) {
        super(401, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ApplicationError {
    constructor(message, ...args) {
        super(403, message, args);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends ApplicationError {
    constructor(message) {
        super(404, message, arguments);
    }
}
exports.NotFoundError = NotFoundError;
class MissingFieldError extends BadRequestError {
    constructor(fieldName, ...args) {
        super(`${fieldName} is required`, args);
    }
}
exports.MissingFieldError = MissingFieldError;
class InternalError extends ApplicationError {
    constructor(message) {
        super(500, message, arguments);
    }
}
exports.InternalError = InternalError;
class InvalidCredentialError extends BadRequestError {
    constructor(...args) {
        super(constants_1.default.INVALID_CREDENTIAL, args);
    }
}
exports.InvalidCredentialError = InvalidCredentialError;
class InvalidTokenError extends BadRequestError {
    constructor(type, ...args) {
        if (type === 'ACCESS') {
            super(constants_1.default.INVALID_ACCESS_TOKEN, args);
        }
        else {
            super(constants_1.default.INVALID_REFRESH_TOKEN, args);
        }
    }
}
exports.InvalidTokenError = InvalidTokenError;
class InvalidIdError extends BadRequestError {
    constructor(...args) {
        super(constants_1.default.REPOSITORY_ERROR_INVALID_ID, args);
    }
}
exports.InvalidIdError = InvalidIdError;
class RepositoryMissingField extends BadRequestError {
    constructor(...args) {
        super('Field missing', args);
    }
}
exports.RepositoryMissingField = RepositoryMissingField;
//# sourceMappingURL=app.errors.js.map