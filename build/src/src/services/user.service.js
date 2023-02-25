"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const inversify_1 = require("inversify");
const bcrypt = require("bcrypt");
const pagination_1 = require("../utils/pagination");
const app_errors_1 = require("../errors/app.errors");
const constants_1 = require("../constants");
const types_1 = require("../types");
const mail_1 = require("../utils/mail");
const logger_1 = require("../logger");
const jwt = require('jsonwebtoken');
/**
 * The actual class that contains all the business logic related to users.
 * Controller sanitize/validate(basic) and sends data to this class methods.
 */
let UserService = class UserService {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedEmail = this.normalizeEmail(data.email);
            const normalizedUsername = this.normalizeUsername(data.username);
            const users = yield this.userRepository.find({
                $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
            }, 2);
            users.forEach((user) => {
                if (user.email === normalizedEmail) {
                    throw new app_errors_1.BadRequestError(constants_1.default.EMAIL_NOT_AVAILABLE);
                }
                if (user.username === normalizedUsername) {
                    throw new app_errors_1.BadRequestError(constants_1.default.USERNAME_NOT_AVAILABLE);
                }
            });
            const password = yield this.hashPassword(data.password);
            const userData = {
                username: normalizedUsername,
                email: normalizedEmail,
                isActive: false,
                password,
            };
            return yield this.userRepository.create(userData).catch((error) => logger_1.default.info(error.message));
        });
    }
    getAllUsers(getUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            let documents;
            const filter = getUserDto.filter || {};
            documents = yield this.userRepository.find(filter, getUserDto.limit, getUserDto.pageNumber);
            return (0, pagination_1.default)(documents, getUserDto.limit, getUserDto.pageNumber, getUserDto.path);
        });
    }
    updatePassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPassword = yield this.hashPassword(data.password);
            yield this.userRepository.updateById(data.id, { password: newPassword });
        });
    }
    updateEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.get(data.id);
            if (data.newEmail !== user.email) {
                const normalizedEmail = this.normalizeEmail(data.newEmail);
                const isEmailAvailable = yield this.isEmailAvailable(normalizedEmail);
                if (!isEmailAvailable) {
                    throw new app_errors_1.BadRequestError(constants_1.default.EMAIL_NOT_AVAILABLE);
                }
                yield this.userRepository.updateById(user._id, { email: normalizedEmail });
            }
        });
    }
    isValidPassword(userGivenPassword, storedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                bcrypt.compare(userGivenPassword, storedPassword, function (err, isMatch) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(isMatch);
                });
            });
        });
    }
    normalizeEmail(email) {
        return email.toLowerCase();
    }
    normalizeUsername(username) {
        return username.toLowerCase().replace(/ /g, '_').replace(/[^A-Za-z0-9_]/g, '');
    }
    isValidUsername(username) {
        const usernameNormalized = this.normalizeUsername(username);
        const length = usernameNormalized.length;
        return length >= 4 && length <= 30;
    }
    isUsernameAvailable(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidUsername(username)) {
                return false;
            }
            const isExists = yield this.userRepository.isUsernameExists(username);
            return isExists;
        });
    }
    isEmailAvailable(givenEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = this.normalizeEmail(givenEmail);
            const isExists = yield this.userRepository.isEmailExists(email);
            return isExists;
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizePassword = password.trim();
            const salt = yield bcrypt.genSalt(5);
            const hash = yield bcrypt.hash(normalizePassword, salt);
            return hash;
        });
    }
    normalizeUser(user) {
        const normalizedUser = user;
        normalizedUser.password = undefined;
        normalizedUser.role = undefined;
        normalizedUser.deletedAt = undefined;
        return normalizedUser;
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedEmail = this.normalizeEmail(data.email);
            const password = data.password;
            let user = yield this.userRepository.find({ email: normalizedEmail }, 1, 1);
            console.log("useruser", user);
            if (!(Array.isArray(user) && user.length > 0)) {
                throw new app_errors_1.BadRequestError(constants_1.default.EMAIL_NOT_AVAILABLE);
            }
            user = user[0];
            const hashedPassword = yield this.hashPassword(data.password);
            if (user && (yield bcrypt.compare(password, hashedPassword))) {
                // Create token
                const token = jwt.sign({ _id: user._id, email: normalizedEmail, password: password }, process.env.TOKEN_KEY, {
                    expiresIn: "1h",
                });
                yield this.userRepository.update({ _id: user._id }, { token: token });
                return { email: normalizedEmail, token: token };
            }
            return { email: normalizedEmail, token: '' };
        });
    }
    sendOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedEmail = this.normalizeEmail(data.email);
            let user = yield this.userRepository.find({ email: normalizedEmail }, 1, 1);
            if (!(Array.isArray(user) && user.length > 0)) {
                throw new app_errors_1.BadRequestError(constants_1.default.EMAIL_NOT_AVAILABLE);
            }
            user = user[0];
            const otp = (Math.floor(100000 + Math.random() * 900000));
            yield this.userRepository.update({ _id: user._id }, { otp: otp });
            return yield (0, mail_1.sendMail)({ OTP: otp, to: user.email, subject: constants_1.default.OTP_EMAIL_SUBJECT }).catch((error) => logger_1.default.info(error.message));
        });
    }
    validateOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedEmail = this.normalizeEmail(data.email);
            let user = yield this.userRepository.find({ email: normalizedEmail }, 1, 1);
            if (!(Array.isArray(user) && user.length > 0)) {
                throw new app_errors_1.BadRequestError(constants_1.default.EMAIL_NOT_AVAILABLE);
            }
            user = user[0];
            if (user.otp === data.otp) {
                yield this.userRepository.update({ _id: user._id }, { isActive: true });
                return { msg: "OTP has been verified successfully" };
            }
            else {
                return { msg: "OTP has been incorrect" };
            }
        });
    }
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.find({ token: token }, 1, 1);
            if (!(Array.isArray(user) && user.length > 0)) {
                throw new app_errors_1.BadRequestError(constants_1.default.EMAIL_NOT_AVAILABLE);
            }
            user = user[0];
            yield this.userRepository.update({ _id: user._id }, { token: null, isActive: false });
            return { msg: "logged out successfully" };
        });
    }
};
__decorate([
    (0, inversify_1.inject)(types_1.TYPES.UserRepository),
    __metadata("design:type", Object)
], UserService.prototype, "userRepository", void 0);
UserService = __decorate([
    (0, inversify_1.injectable)()
], UserService);
exports.default = UserService;
//# sourceMappingURL=user.service.js.map