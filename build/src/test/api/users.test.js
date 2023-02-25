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
const assert = require("assert");
const request = require("supertest");
const app_1 = require("../../src/app");
const helper = require("../index");
describe('Users', () => {
    describe('Create user', () => {
        function createUserRequest({ username, password, email }, error, code) {
            return __awaiter(this, void 0, void 0, function* () {
                const body = { username, password, email };
                const res = yield request(app_1.default).post('/users').send(body).expect(code);
                assert.deepStrictEqual(res.text, error);
            });
        }
        test('response 201 if success', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = { username: 'name', password: 'pass', email: 'name@email.com' };
            yield createUserRequest(body, 'Created', 201);
        }));
        test('password 400 if email field is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = { username: 'user', password: 'password', email: undefined };
            yield createUserRequest(body, 'email is required', 400);
        }));
        test('response 400 if password field is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = { username: 'user', email: 'name@gmail.com', password: undefined };
            yield createUserRequest(body, 'password is required', 400);
        }));
        test('response 400 if username field is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = { password: 'user', email: 'name@gmail.com', username: undefined };
            yield createUserRequest(body, 'username is required', 400);
        }));
        test('response 400 if email is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = { username: 'name', password: 'user', email: 'name' };
            yield createUserRequest(body, 'Invalid email', 400);
        }));
        test('response 400 if password is less than 4 letter', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = { username: 'name', password: 'usr', email: 'name@email.com' };
            yield createUserRequest(body, 'Invalid password', 400);
        }));
        test('response 400 if password is greater than 20 letter', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = { username: 'name', password: 'thisisaverylargepassword', email: 'name@email.com' };
            yield createUserRequest(body, 'Invalid password', 400);
        }));
    });
    describe('Get user', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield helper.createUser();
        }));
        test('response 200 with list of users when get all users', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(app_1.default).get('/users').expect(200);
            assert.deepStrictEqual(Array.isArray(res.body.data), true);
            assert.deepStrictEqual(res.body.data.length, 1);
        }));
    });
});
//# sourceMappingURL=users.test.js.map