/* eslint-disable consistent-return */
import '../../src/setup.js';
import supertest from 'supertest';
import app from '../../src/app.js';
import {
  validUser,
  invalidName,
  invalidEmail,
  invalidEmptyEmail,
  invalidPassword,
  invalidEmptyPassword,
  invalidCpf,
  invalidEmptyCpf,
  invalidPhone,
  invalidEmptyPhone,
} from '../factories/userFactory.js';

const request = supertest(app);

describe('POST /auth/sign-up', () => {
  it('returns status 201 for valid body and unused email', async () => {
    const body = await validUser();

    const result = await request.post('/auth/sign-up').send(body);
    expect(result.status).toEqual(201);
  });

  it('returns status 400 for invalid name', async () => {
    const body = await invalidName();
    const result = await request.post('/auth/sign-up').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns status 400 for invalid email', async () => {
    const body = await invalidEmail();

    const result = await request.post('/auth/sign-up').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns status 400 for empty email', async () => {
    const body = await invalidEmptyEmail();

    const result = await request.post('/auth/sign-up').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns status 400 for invalid password', async () => {
    const body = await invalidPassword();

    const result = await request.post('/auth/sign-up').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns status 400 for empty password', async () => {
    const body = await invalidEmptyPassword();

    const result = await request.post('/auth/sign-up').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns status 400 for invalid cpf', async () => {
    const body = await invalidCpf();

    const result = await request.post('/auth/sign-up').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns status 400 for empty cpf', async () => {
    const body = await invalidEmptyCpf();

    const result = await request.post('/auth/sign-up').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns status 400 for invalid phone', async () => {
    const body = await invalidPhone();

    const result = await request.post('/auth/sign-up').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns status 400 for empty phone', async () => {
    const body = await invalidEmptyPhone();

    const result = await request.post('/auth/sign-up').send(body);
    expect(result.status).toEqual(400);
  });
});
