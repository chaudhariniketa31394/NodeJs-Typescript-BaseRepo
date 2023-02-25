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
exports.UserRoles = void 0;
const inversify_1 = require("inversify");
const isEmail_1 = require("validator/lib/isEmail");
const isLength_1 = require("validator/lib/isLength");
const app_errors_1 = require("../errors/app.errors");
const constants_1 = require("../constants");
const utils_1 = require("../utils/utils");
const types_1 = require("../types");
var UserRoles;
(function (UserRoles) {
    UserRoles[UserRoles["ADMIN"] = 1] = "ADMIN";
    UserRoles[UserRoles["MODERATOR"] = 2] = "MODERATOR";
    UserRoles[UserRoles["VISITOR"] = 3] = "VISITOR";
})(UserRoles = exports.UserRoles || (exports.UserRoles = {}));
let UserController = class UserController {
    constructor() {
        this.limit = 20;
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = req.query.limit ? parseInt(req.query.limit) : this.limit;
            const pageNumber = req.query.page ? parseInt(req.query.page) : 1;
            const getUserDto = {
                pageNumber,
                limit,
                filter: req.query.filter,
                path: req.path,
            };
            const response = yield this.userService.getAllUsers(getUserDto);
            res.send(response);
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id) {
                throw new app_errors_1.MissingFieldError('id');
            }
            const user = yield this.userRepository.get((0, utils_1.getValidObjectId)(req.params.id));
            res.send(user);
        });
    }
    /**
     * Create user
     *
     * @requires username An unique user name
     * @requires password A valid password
     * @requires email A valid email
     **/
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email) {
                throw new app_errors_1.MissingFieldError('email');
            }
            if (!req.body.username) {
                throw new app_errors_1.MissingFieldError('username');
            }
            if (!req.body.password) {
                throw new app_errors_1.MissingFieldError('password');
            }
            if (!(0, isEmail_1.default)(req.body.email)) {
                throw new app_errors_1.BadRequestError(constants_1.default.INVALID_EMAIL);
            }
            if (!(0, isLength_1.default)(req.body.password.trim(), { min: 4, max: 20 })) {
                throw new app_errors_1.BadRequestError(constants_1.default.INVALID_PASSWORD);
            }
            const createUserDto = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
            };
            yield this.userService.createUser(createUserDto);
            res.sendStatus(201);
        });
    }
    /**
     * Update email
     */
    updateEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id) {
                throw new app_errors_1.MissingFieldError('id');
            }
            if (!req.body.email) {
                throw new app_errors_1.MissingFieldError('email');
            }
            if (!(0, isEmail_1.default)(req.body.email)) {
                throw new app_errors_1.BadRequestError(constants_1.default.INVALID_EMAIL);
            }
            const updateUserDto = {
                id: (0, utils_1.getValidObjectId)(req.params.id),
                newEmail: req.body.email,
            };
            yield this.userService.updateEmail(updateUserDto);
            res.sendStatus(204);
        });
    }
    /**
     * Update password
     */
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id) {
                throw new app_errors_1.MissingFieldError('id');
            }
            if (!req.body.password) {
                throw new app_errors_1.MissingFieldError('password');
            }
            const updatePasswordDto = {
                id: (0, utils_1.getValidObjectId)(req.params.id),
                password: req.body.password,
            };
            yield this.userService.updatePassword(updatePasswordDto);
            res.sendStatus(204);
        });
    }
    update(_req, _res) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    delete(_req, _res) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email) {
                throw new app_errors_1.MissingFieldError('email');
            }
            if (!req.body.password) {
                throw new app_errors_1.MissingFieldError('password');
            }
            const loginDto = {
                email: req.body.email,
                password: req.body.password,
            };
            const user = yield this.userService.login(loginDto);
            res.send(user);
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token || req.query.token || req.headers["x-access-token"];
            if (!token) {
                throw new app_errors_1.MissingFieldError('token');
            }
            res.send(yield this.userService.logout(token));
        });
    }
    validateOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email) {
                throw new app_errors_1.MissingFieldError('email');
            }
            if (!req.body.otp) {
                throw new app_errors_1.MissingFieldError('otp');
            }
            const otpDto = {
                email: req.body.email,
                otp: req.body.otp,
            };
            const user = yield this.userService.validateOtp(otpDto);
            res.send(user);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(types_1.TYPES.UserRepository),
    __metadata("design:type", Object)
], UserController.prototype, "userRepository", void 0);
__decorate([
    (0, inversify_1.inject)(types_1.TYPES.UserService),
    __metadata("design:type", Object)
], UserController.prototype, "userService", void 0);
UserController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UserController);
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map