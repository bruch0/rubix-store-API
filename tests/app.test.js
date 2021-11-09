import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';

afterAll(() => {
  connection.end();
});

describe('GET /products', () => {
  it('should return 200 when products are requested', async () => {
    const result = await supertest(app).get('/products');
    const { status } = result;
    expect(status).toEqual(200);
  });
});
