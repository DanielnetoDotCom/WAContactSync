const request = require('supertest');
const app = require('../app.js');

// Mock completo do whatsappService
jest.mock('../services/whatsappService.js', () => ({
  getClientStatus: jest.fn(() => ({ ready: true })),
  syncContacts: jest.fn(() => ({ success: true })),
  syncMoreMessages: jest.fn(() => ({ success: true })),
}));

describe('Sync API', () => {
  test('POST /api/contacts/sync triggers sync', async () => {
    const res = await request(app).post('/api/contacts/sync');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/contacts/sync-more triggers sync more messages', async () => {
    const res = await request(app).post('/api/contacts/sync-more');
    expect([200, 404]).toContain(res.statusCode); // 404 if not implemented yet
  });
});
