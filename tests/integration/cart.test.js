import '../../src/setup.js';
import supertest from 'supertest';
import app from '../../src/app.js';
import connection from '../../src/database/database.js';
import clearDatabase from '../utils/database.js';
import { createUser } from '../factories/userFactory.js';

const request = supertest(app);

afterAll(() => {
  connection.end();
});

beforeEach(clearDatabase);

describe('POST /cart', () => {
  it('returns 200 when add product to cart successfully', async () => {
    const newUser = await createUser();

    const bodySignIn = {
      email: newUser.email,
      password: newUser.password,
    };

    const resultSignIn = await request.post('/auth/sign-in').send(bodySignIn);

    const { token } = resultSignIn.body;

    const body = {
      product_id: 11,
      product_qty: 1,
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
    const newUser = await createUser();

    const bodySignIn = {
      email: newUser.email,
      password: newUser.password,
    };

    const resultSignIn = await request.post('/auth/sign-in').send(bodySignIn);

    const { token } = resultSignIn.body;

    const body = {
      product_id: 11,
      product_qty: 9999999,
    };

    const result = await request
      .post('/cart')
      .set('x-access-token', token)
      .send(body);
    expect(result.status).toEqual(400);
  });

  it('returns 400 when product id doesnt exist', async () => {
    const newUser = await createUser();

    const bodySignIn = {
      email: newUser.email,
      password: newUser.password,
    };

    const resultSignIn = await request.post('/auth/sign-in').send(bodySignIn);

    const { token } = resultSignIn.body;

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
