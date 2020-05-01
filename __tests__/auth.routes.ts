import request from 'supertest';
import app from '../src/app';

import seed from '../testSetup/db/seed';
const { connectMongoDB, disconnectMongoDB } = require('../testSetup/mongodb');

beforeAll(async () => {
  await connectMongoDB();

  await seed();
});

afterAll(() => disconnectMongoDB());

test('logs admin in', () => {
  return request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'test@admin.com',
      password: 'password',
    })
    .expect((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({ token: expect.any(String) }),
      );
    });
});
