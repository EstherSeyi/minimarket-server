import request from 'supertest';
import app from '../src/app';

import seed from '../testSetup/db/seed';
import market from '../src/controller/market';
const { connectMongoDB, disconnectMongoDB } = require('../testSetup/mongodb');
import testHelp from '../src/utils/testHelp';

const { mockRequest, mockResponse } = testHelp;

let id: string;

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
        foodCategory: 'meat',
        latlng: '9.0226177,7.4888433',
        images: [
          'https://bit.ly/2VTN8jc',
          'https://bit.ly/2VTN8jc',
          'https://bit.ly/2VTN8jc',
        ],
      })
      .expect((res) => {
        id = res.body.payload._id;

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

  test('gets single market', async () => {
    return await request(app)
      .get('/api/v1/market/single')
      .query({ id: id })
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('success');
      });
  });

  test('gets all market', async () => {
    return await request(app)
      .get('/api/v1/market')
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('success');
        expect(res.body.payload).toEqual(expect.any(Array));
      });
  });
  test('Find single market by category', async () => {
    return await request(app)
      .get('/api/v1/market/category')
      .query({ searchBy: 'foodCategory', searchValue: 'fruits' })
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('success');
        expect(res.body.payload).toEqual(expect.any(Array));
      });
  });
  test('Gets nearest market', async () => {
    let req = mockRequest();
    req.params.market = '19 Daniel Makinde Street, Ikosi, Ketu, Lagos';
    const res = mockResponse();
    await market.getNearestMarket(req, res);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send.mock.calls.length).toBe(1);
  });
});
