import supertest from 'supertest';
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
    expect(result.text).toEqual('"password" length must be at least 6 characters long');
  });
});
