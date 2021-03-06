/* eslint-disable consistent-return */
import '../../src/setup.js';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import faker from 'faker-br';
import connection from '../../src/database/database.js';
import app from '../../src/app.js';
import clearDatabase from '../utils/database.js';
import createUser from '../factories/userFactory.js';

const request = supertest(app);

beforeAll(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await connection.end();
});

describe('POST /auth/sign-in', () => {
  it('should return status 400 for invalid format inputs', async () => {
    const body = {};
    const result = await request.post('/auth/sign-in').send(body);
    expect(result.status).toEqual(400);
  });

  it('should return invalid msg for invalid format email', async () => {
    const body = {
      email: 'email@invalid',
      password: faker.internet.password(8),
    };
    const result = await request.post('/auth/sign-in').send(body);
    expect(result.status).toEqual(400);
  });

  it('should return invalid msg for invalid format password', async () => {
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password(3),
    };
    const result = await request.post('/auth/sign-in').send(body);
    expect(result.status).toEqual(400);
  });

  it('creates a session for valid access', async () => {
    const newUser = await createUser();

    const body = {
      email: newUser.email,
      password: newUser.password,
    };

    await request.post('/auth/sign-in').send(body);

    const newSessions = await connection.query('SELECT * FROM sessions;');
    expect(newSessions.rows.length).toEqual(1);
  });

  it('should return a valid jwt token on sign-in', async () => {
    const newUser = await createUser();
    const bodyData = {
      email: newUser.email,
      password: newUser.password,
    };

    const { body } = await request.post('/auth/sign-in').send(bodyData);

    jwt.verify(body.token, process.env.JWT_SECRET, (err) => {
      expect(err).toBeNull();
    });
  });

  it('should return status 200 for valid access', async () => {
    const newUser = await createUser();

    const body = {
      email: newUser.email,
      password: newUser.password,
    };

    const result = await request.post('/auth/sign-in').send(body);
    expect(result.status).toEqual(200);
  });
});
