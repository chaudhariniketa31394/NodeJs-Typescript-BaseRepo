"use strict";
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
exports.createNUsers = exports.createUser = void 0;
const faker = require("faker");
const logger_1 = require("../src/logger");
const repository_1 = require("../src/repositories/repository");
const dotenv = require("dotenv");
dotenv.config();
if (process.env.NODE_ENV !== 'test') {
    logger_1.default.error('Invalid environment for tests');
    process.exit(1);
}
let userRepository;
function clearDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield userRepository.remove({}, true);
    });
}
function clearDatabaseIndices() {
    return __awaiter(this, void 0, void 0, function* () {
        yield userRepository.getCollection().dropIndexes();
    });
}
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield clearDatabase();
    }
    catch (error) {
        logger_1.default.info(error.message);
    }
}));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        jest.setTimeout(10000);
        // Wait for Jest to run the app and connect to database
        yield new Promise((resolve) => setTimeout(resolve, 5000));
        userRepository = new repository_1.default('users');
        yield clearDatabaseIndices();
    }
    catch (error) {
        logger_1.default.info(error.message);
    }
}));
function createUser(username, email, password = 'password') {
    return __awaiter(this, void 0, void 0, function* () {
        username = username !== null && username !== void 0 ? username : faker.internet.userName();
        email = email !== null && email !== void 0 ? email : faker.internet.email();
        // password = 'password';
        const user = yield userRepository.create({ username, email, password });
        return user;
    });
}
exports.createUser = createUser;
function createNUsers(number) {
    return __awaiter(this, void 0, void 0, function* () {
        while (number--) {
            const password = 'test';
            const email = faker.internet.email();
            const username = faker.internet.userName();
            yield createUser(username, email, password);
        }
    });
}
exports.createNUsers = createNUsers;
//# sourceMappingURL=index.js.map