import '../../src/setup.js';
import supertest from 'supertest';
import faker from 'faker-br';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js';
import connection from '../../src/database/database.js';
import clearDatabase from '../utils/database.js';
import { createProduct, createSession } from '../factories/userFactory.js';

const request = supertest(app);

afterAll(async () => {
  await connection.end();
});

describe('POST /cart', () => {
  beforeEach(clearDatabase);

  it('returns 200 when add product to cart successfully', async () => {
    const token = jwt.sign({
      sessionId: await createSession(),
    }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

    const body = {
      product_id: await createProduct(),
      product_qty: faker.random.number({
        min: 1, max: 10,
      }),
    };

    const result = await request
      .post('/cart')
      .set('x-access-token', token)
      .send(body);

    expect(result.status).toEqual(200);
  });

  it('returns 401 when not sending header token', async () => {
    const result = await request.post('/cart');
    expect(result.status).toEqual(401);
  });

  it('returns 400 when quantity product greater than available', async () => {
    const token = jwt.sign({
      sessionId: await createSession(),
    }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

    const body = {
      product_id: await createProduct(),
      product_qty: 9999999,
    };

    const result = await request
      .post('/cart')
      .set('x-access-token', token)
      .send(body);
    expect(result.status).toEqual(400);
  });

  it('returns 404 when product id doesnt exist', async () => {
    const token = jwt.sign({
      sessionId: await createSession(),
    }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

    const body = {
      product_id: 0,
      product_qty: 1,
    };

    const result = await request
      .post('/cart')
      .set('x-access-token', token)
      .send(body);
    expect(result.status).toEqual(404);
  });
});
