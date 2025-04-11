import request from 'supertest';
import app from '../app.js';

describe('Contacts API', () => {
  test('GET /api/contacts returns a list of contacts', async () => {
    const res = await request(app).get('/api/contacts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.contacts)).toBe(true);
  });
});
