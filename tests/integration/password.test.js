import '../../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import app from '../../src/app.js';
import connection from '../../src/database/database.js';
import { v4 as uuid } from 'uuid'

afterAll(async () => {
  connection.end();
});

describe('POST /recover-password', () => {
  const validEmail = faker.internet.email();
  const invalidEmail = faker.name.findName();

  it('should return 400 when email is not given', async () => {
    const result = await supertest(app).post('/recover-password');
    const { status } = result;
    expect(status).toEqual(400);
  });

  it('should return 400 when email is not valid', async () => {
    const body = { email: invalidEmail };
    const result = await supertest(app).post('/recover-password').send(body);
    const { status } = result;
    expect(status).toEqual(400);
  });

  it('should return 404 when email is not found', async () => {
    const body = { email: validEmail };
    const result = await supertest(app).post('/recover-password').send(body);
    const { status } = result;
    expect(status).toEqual(404);
  });
});

describe('POST /authorize-password', () => {
  const validToken = uuid();
  const invalidToken = faker.name.findName();

  it('should return 401 when token is not given', async () => {
    const result = await supertest(app).post('/authorize-password');
    const { status } = result;
    expect(status).toEqual(401);
  });

  it('should return 404 when token is not found', async () => {
    const result = await supertest(app).post('/authorize-password').send({ token: invalidToken });
    const { status } = result;
    expect(status).toEqual(404);
  });
});
