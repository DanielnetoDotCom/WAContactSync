import express from 'express';
import {
  getLatestQR,
  getClientStatus,
  getInstance as getClient,
  reinitializeClient,
} from '../services/whatsappService.js';

const router = express.Router();

// GET /api/whatsapp/qr
router.get('/qr', (req, res) => {
  const qrCode = getLatestQR();
  if (qrCode) {
    res.json({ qr: qrCode });
  } else {
    res.status(204).json({ message: 'No QR code available' });
  }
});

// GET /api/whatsapp/status
router.get('/status', (req, res) => {
  const ready = getClientStatus();
  res.json({ ready });
});

// GET /api/whatsapp/client-info
router.get('/client-info', async (req, res) => {
  try {
    const client = getClient();
    if (!client) {
      return res.status(500).json({ error: 'WhatsApp client is not available' });
    }

    const info = await client.info;
    res.json({
      pushname: info.pushname,
      wid: info.wid,
      platform: info.platform,
    });
  } catch (err) {
    console.error('Error getting client info:', err);
    res.status(500).json({ error: 'Failed to get client info' });
  }
});

// POST /api/whatsapp/restart
router.post('/restart', async (req, res) => {
  await reinitializeClient();
  res.json({ success: true });
});

export default router;
