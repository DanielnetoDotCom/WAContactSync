import request from 'supertest';
import app from '../app.js';

describe('Reset Contacts API', () => {
  test('DELETE /api/contacts/reset clears all contacts', async () => {
    const res = await request(app).delete('/api/contacts/reset');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true); // adjust as per actual return
  });
});
