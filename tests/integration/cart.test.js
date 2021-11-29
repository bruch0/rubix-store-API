import '../../src/setup.js';
import supertest from 'supertest';
import faker from 'faker-br';
import app from '../../src/app.js';
import connection from '../../src/database/database.js';
import clearDatabase from '../utils/database.js';
import createProduct from '../factories/productFactory';
import createToken from '../factories/tokenFactory.js';

const request = supertest(app);

afterAll(async () => {
  await connection.end();
});

describe('POST /cart', () => {
  beforeEach(clearDatabase);

  it('should return status 200 when adding a product to the cart successfully', async () => {
    const token = await createToken();

    const body = {
      product_id: await createProduct(),
      product_qty: faker.random.number({
        min: 1,
        max: 10,
      }),
      isUpdate: false,
    };

    const result = await request
      .post('/cart')
      .set('x-access-token', token)
      .send(body);

    expect(result.status).toEqual(200);
  });

  it('should return status 401 when not sending header token', async () => {
    const result = await request.post('/cart');
    expect(result.status).toEqual(401);
  });

  it('should return status 400 when product quantity is greater than available', async () => {
    const token = await createToken();

    const body = {
      product_id: await createProduct(),
      product_qty: 9999999,
    };

    const result = await request
      .post('/cart')
      .set('x-access-token', token)
      .send(body);
    expect(result.status).toEqual(403);
  });

  it('should return status 400 when product dont exist', async () => {
    const token = await createToken();

    const body = {
      product_id: 0,
      product_qty: 1,
    };

    const result = await request
      .post('/cart')
      .set('x-access-token', token)
      .send(body);
    expect(result.status).toEqual(400);
  });
});

describe('GET /cart', () => {
  it('should return status 401 when not sending header token', async () => {
    const result = await request.get('/cart');
    expect(result.status).toEqual(401);
  });

  it('should return status 200 when sending valid header token', async () => {
    const token = await createToken();
    const result = await request.get('/cart').set('x-access-token', token);
    expect(result.status).toEqual(200);
  });
});
