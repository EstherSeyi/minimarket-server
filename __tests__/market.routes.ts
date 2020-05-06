import request from 'supertest';
import app from '../src/app';

import seed from '../testSetup/db/seed';
const { connectMongoDB, disconnectMongoDB } = require('../testSetup/mongodb');

beforeAll(async () => {
  await connectMongoDB('marketTest');
  await seed();
});

afterAll(async () => await disconnectMongoDB());

describe('Markets', () => {
  test('creates a market', async () => {
    let user = await request(app).post('/api/v1/auth/login').send({
      email: 'test@admin.com',
      password: 'password',
    });

    return await request(app)
      .post('/api/v1/market')
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        name: 'Mile-12 Market',
        description:
          'Popularly known as the largest market for fresh foods and vegetables in West Africa, Mile12 International Market is estimated to have over 150,000 regular traders daily trading on different commodities, including traders from neighboring countries like Togo, Benin, Ghana, Cameroon, Niger and Chad',
        foodCategory: 'grocery',
        address:
          '53 orisigun street kosofe mile 12 Lagos, Kosofe 300001, Lagos',
        images: [
          'https://bit.ly/2VTN8jc',
          'https://bit.ly/2VTN8jc',
          'https://bit.ly/2VTN8jc',
        ],
      })
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('success');
        expect(res.body.payload).toEqual(
          expect.objectContaining({
            name: 'Mile-12 Market',
            cordinates: expect.objectContaining({
              longitute: expect.any(String),
            }),
          }),
        );
      });
  });
});
