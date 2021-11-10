import '../../src/setup.js';
import supertest from 'supertest';
import app from '../../src/app.js';
import connection from '../../src/database/database.js';

afterAll(() => {
  connection.end();
});

describe('POST /cart', () => {
  it('returns 200 when add product to cart', async () => {
    const result = await supertest(app).post('/cart');
    const { status } = result;
    expect(status).toEqual(200);
  });
});
