import supertest from 'supertest';
import connection from '../src/database/database.js';
import app from '../src/app.js';
import cleanDatabase from './utils/database.js';
import createUser from './factories/user.js';

const request = supertest(app);

afterAll(() => {
  connection.end();
});

beforeEach(cleanDatabase);

describe('POST /sign-in', () => {
  it('returns status 200 for valid access', async () => {
    const newUser = await createUser();

    const bodyData = {
      email: newUser.email,
      password: newUser.password,
    };

    const result = await request.post('/api/auth/signin').send(bodyData);
    expect(result.status).toEqual(200);
  });
});
