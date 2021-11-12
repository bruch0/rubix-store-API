import '../../src/setup.js';
import supertest from 'supertest';
import app from '../../src/app.js';
import connection from '../../src/database/database.js';
import { createProduct } from '../factories/userFactory.js';
import clearDatabase from '../utils/database.js';

afterAll(() => {
  connection.end();
});

const request = supertest(app);

describe('GET /product/id', () => {
  beforeEach(clearDatabase);
  it('should return 200 when the product exists', async () => {
    const productId = await createProduct();
    const result = await request.get(`/product/${productId}`);
    expect(result.status).toEqual(200);
  });
});
