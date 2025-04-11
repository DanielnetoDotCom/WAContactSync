import request from 'supertest';
import app from '../app.js';

describe('WhatsApp API', () => {
  test('GET /api/whatsapp/status returns client status', async () => {
    const res = await request(app).get('/api/whatsapp/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ready');
  });

  test('POST /api/whatsapp/restart restarts the client', async () => {
    const res = await request(app).post('/api/whatsapp/restart');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
