import request from 'supertest';
import app from '../src/app';

test('it allows a get request', () => {
  return request(app)
    .get('/api/')
    .expect((res) => {
      expect(res.status).toBe(200);
    });
});
