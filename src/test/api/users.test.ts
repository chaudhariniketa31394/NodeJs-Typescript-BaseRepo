import * as assert from 'assert';
import * as request from 'supertest';
import app from '../../src/app';
import * as helper from '../index';

describe('Users', () => {
  describe('Create user', () => {

    async function createUserRequest({ username, password, email }, error?: string, code?: number) {
      const body = { username, password, email };
      const res = await request(app).post('/users').send(body).expect(code);
      assert.deepStrictEqual(res.text, error);
    }

    test('response 201 if success', async () => {
      const body = { username: 'name', password: 'pass', email: 'name@email.com' };
      await createUserRequest(body, 'Created', 201);
    });

    test('password 400 if email field is empty', async () => {
      const body = { username: 'user', password: 'password', email: undefined };
      await createUserRequest(body, 'email is required', 400);
    });

    test('response 400 if password field is empty', async () => {
      const body = { username: 'user', email: 'name@gmail.com', password: undefined };
      await createUserRequest(body, 'password is required', 400);
    });

    test('response 400 if username field is empty', async () => {
      const body = { password: 'user', email: 'name@gmail.com', username: undefined };
      await createUserRequest(body, 'username is required', 400);
    });

    test('response 400 if email is invalid', async () => {
      const body = { username: 'name', password: 'user', email: 'name' };
      await createUserRequest(body, 'Invalid email', 400);
    });

    test('response 400 if password is less than 4 letter', async () => {
      const body = { username: 'name', password: 'usr', email: 'name@email.com' };
      await createUserRequest(body, 'Invalid password', 400);
    });

    test('response 400 if password is greater than 20 letter', async () => {
      const body = { username: 'name', password: 'thisisaverylargepassword', email: 'name@email.com' };
      await createUserRequest(body, 'Invalid password', 400);
    });

  });

  describe('Get user', () => {
    beforeEach(async () => {
      await helper.createUser();
    });

    test('response 200 with list of users when get all users', async () => {
      const res = await request(app).get('/users').expect(200);
      assert.deepStrictEqual(Array.isArray(res.body.data), true);
      assert.deepStrictEqual(res.body.data.length, 1);
    });
  });
});
