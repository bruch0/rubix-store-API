import '../../src/setup.js';
import supertest from 'supertest';
import app from '../../src/app.js';
import connection from '../../src/database/database.js';

import createToken from '../factories/tokenFactory';

afterAll(async () => {
  await connection.end();
});

describe('GET /checkout', () => {
  it('should return status 401 when header token is not given', async () => {
    const result = await supertest(app).get('/checkout');
    const { status } = result;
    expect(status).toEqual(401);
  });

  it('should return status 200 when header token is valid', async () => {
    const token = await createToken();
    const result = await supertest(app)
      .get('/checkout')
      .set('x-access-token', token);
    const { status } = result;
    expect(status).toEqual(200);
  });
});

describe('POST /checkout', () => {
  it('should return status 401 when header token is not given', async () => {
    const result = await supertest(app).post('/checkout');
    const { status } = result;
    expect(status).toEqual(401);
  });

  it('should return status 400 when header token is valid but body is invalid', async () => {
    const token = await createToken();
    const result = await supertest(app)
      .post('/checkout')
      .set('x-access-token', token);
    const { status } = result;
    expect(status).toEqual(400);
  });
});
