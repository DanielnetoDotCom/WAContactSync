import express from 'express';
import { getClientStatus, getLatestQR } from '../services/whatsappService.js';

const router = express.Router();

let clients = [];

router.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  res.flushHeaders();

  const client = { res };
  clients.push(client);

  req.on('close', () => {
    clients = clients.filter((c) => c !== client);
  });

  // Send initial QR and status
  const qr = getLatestQR();
  if (qr) res.write(`event: qr\ndata: ${JSON.stringify({ qr })}\n\n`);

  if (getClientStatus()) {
    res.write(`event: ready\ndata: {}\n\n`);
  }
});

export function broadcastEvent(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => client.res.write(payload));
}

export default router;
