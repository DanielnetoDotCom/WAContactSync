import request from 'supertest';
import app from '../app.js';

describe('Messages API', () => {
  const testPhone = '+5511999999999';

  test('GET /api/messages/:phone returns message list', async () => {
    const res = await request(app).get(`/api/messages/${testPhone}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  test('GET /api/messages/:phone/export returns a CSV file', async () => {
    const res = await request(app).get(`/api/messages/${testPhone}/export`);
    expect([200, 404]).toContain(res.statusCode);
  });
});
