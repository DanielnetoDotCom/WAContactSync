import express from 'express';
import {
  getLatestQR,
  getClientStatus,
  getInstance as getClient,
} from '../services/whatsappService.js';
import { syncContacts } from '../controllers/contactsController.js';

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

// Optional: re-sync route here if needed
// router.post('/sync', syncContacts);

export default router;
