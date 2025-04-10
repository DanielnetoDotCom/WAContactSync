import express from 'express';
import { getDB } from '../services/db.js';

const router = express.Router();

router.get('/:phone', async (req, res) => {
  const db = await getDB();
  const { phone } = req.params;

  const messages = await db.all(
    'SELECT * FROM messages WHERE contact_phone = ? ORDER BY timestamp DESC LIMIT 100',
    [phone]
  );

  res.json({ messages });
});

export default router;
