import '../../src/setup.js';
import supertest from 'supertest';
import app from '../../src/app.js';
import connection from '../../src/database/database.js';
import { createProduct } from '../factories/userFactory.js';
import clearDatabase from '../utils/database.js';

const request = supertest(app);

afterAll(() => {
  connection.end();
});
beforeEach(clearDatabase);

describe('GET /product/id', () => {
  it('should return 200 when the product exists', async () => {
    const productId = await createProduct();
    const result = await request.get(`/product/${productId}`);
    expect(result.status).toEqual(200);
  });

  it('should return 404 when the product doesnt exists', async () => {
    const productId = 0;
    const result = await request.get(`/product/${productId}`);
    expect(result.status).toEqual(404);
  });

  it('should return 400 when invalid params', async () => {
    const productId = 'invalid_param';
    const result = await request.get(`/product/${productId}`);
    expect(result.status).toEqual(400);
  });
});
