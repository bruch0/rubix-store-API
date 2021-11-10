/* eslint-disable consistent-return */
import '../../src/setup.js';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import faker from 'faker-br';
import connection from '../../src/database/database.js';
import app from '../../src/app.js';
import cleanDatabase from '../utils/database.js';
import createUser from '../factories/userFactory.js';

const request = supertest(app);

afterAll(() => {
  connection.end();
});

beforeEach(cleanDatabase);

describe('POST /auth/sign-in', () => {
  it('returns status 200 for valid access', async () => {
    const newUser = await createUser();

    const body = {
      email: newUser.email,
      password: newUser.password,
    };

    const result = await request.post('/auth/sign-in').send(body);
    expect(result.status).toEqual(200);
  });

  it('returns status 400 for invalid format inputs', async () => {
    const body = {};
    const result = await request.post('/auth/sign-in').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns invalid msg for invalid format email', async () => {
    const body = {
      email: 'email@invalid',
      password: faker.internet.password(8),
    };
    const result = await request.post('/auth/sign-in').send(body);
    expect(result.text).toEqual('"email" must be a valid email');
  });

  it('returns invalid msg for invalid format password', async () => {
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password(3),
    };
    const result = await request.post('/auth/sign-in').send(body);
    expect(result.text).toEqual(
      '"password" length must be at least 6 characters long'
    );
  });

  it('creates a session for valid access', async () => {
    const newUser = await createUser();

    const body = {
      email: newUser.email,
      password: newUser.password,
    };

    const sessions = await connection.query('SELECT * FROM sessions');
    expect(sessions.rows.length).toEqual(0);

    await request.post('/auth/sign-in').send(body);

    const newSessions = await connection.query('SELECT * FROM sessions;');
    expect(newSessions.rows.length).toEqual(1);
  });

  it('returns a jwt token for valid access', async () => {
    const newUser = await createUser();
    const bodyData = {
      email: newUser.email,
      password: newUser.password,
    };

    const { body } = await request.post('/auth/sign-in').send(bodyData);

    jwt.verify(body.token, process.env.JWT_SECRET, (err, decoded) => {
      expect(err).toBeNull();
    });
  });
});
