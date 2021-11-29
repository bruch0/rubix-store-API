import '../../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import app from '../../src/app.js';
import connection from '../../src/database/database.js';

import createUser from '../factories/userFactory.js';

afterAll(async () => {
  await connection.end();
});

describe('POST /recover-password', () => {
  const validEmail = faker.internet.email();
  const invalidEmail = faker.name.findName();

  it('should return status 400 when email is not given', async () => {
    const result = await supertest(app).post('/recover-password');
    const { status } = result;
    expect(status).toEqual(400);
  });

  it('should return status 400 when email is not valid', async () => {
    const body = { email: invalidEmail };
    const result = await supertest(app).post('/recover-password').send(body);
    const { status } = result;
    expect(status).toEqual(400);
  });

  it('should return status 404 when email is not found', async () => {
    const body = { email: validEmail };
    const result = await supertest(app).post('/recover-password').send(body);
    const { status } = result;
    expect(status).toEqual(404);
  });

  it('should return status 200 when email is found', async () => {
    const { email } = await createUser();
    const result = await supertest(app)
      .post('/recover-password')
      .send({ email });
    const { status } = result;
    expect(status).toEqual(200);
  });
});
