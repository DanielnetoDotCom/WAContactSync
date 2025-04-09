import { getDB } from '../services/db.js';
import {
  getInstance as getClient,
  getClientStatus,
  reinitializeClient,
  setClientReady,
} from '../services/whatsappService.js';

import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function listContacts(req, res) {
  const db = await getDB();
  let contacts = await db.all(`SELECT * FROM contacts ORDER BY last_message_date DESC`);

  if (contacts.length === 0) {
    await syncContacts(); // sync if empty
    contacts = await db.all(`SELECT * FROM contacts ORDER BY last_message_date DESC`);
  }

  res.json({ contacts });
}

export async function resetContacts(req, res) {
  try {
    const db = await getDB();
    await db.exec('DELETE FROM contacts');

    const client = getClient();
    if (client) {
      try {
        await client.destroy(); // must fully release files
        setClientReady(false);
        console.log('🛑 WhatsApp client destroyed');
      } catch (err) {
        console.warn('⚠️ Failed to destroy client:', err.message);
      }
    }

    const sessionDir = resolve(__dirname, '../.wwebjs_auth');
    if (fs.existsSync(sessionDir)) {
      try {
        fs.rmSync(sessionDir, { recursive: true, force: true });
        console.log('🗑️ WhatsApp session removed');
      } catch (err) {
        if (err.code === 'EBUSY') {
          console.warn(`⚠️ Could not delete session files: ${err.path}`);
        } else {
          throw err;
        }
      }
    }

    await reinitializeClient(); // force new QR
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to reset:', err);
    res.status(500).json({ error: 'Failed to reset' });
  }
}

export async function syncContacts(req, res = null) {
  const isReady = getClientStatus();
  if (!isReady) {
    const message = 'WhatsApp client is not ready';
    console.warn(message);
    if (res) return res.status(503).json({ error: message });
    else throw new Error(message);
  }

  const db = await getDB();
  const client = getClient();
  const contacts = await client.getContacts();

  await db.exec('DELETE FROM contacts');

  for (const contact of contacts) {
    if (!contact.isUser) continue;
    try {
      const chat = await contact.getChat();
      if (!chat) continue;
      const messages = await chat.fetchMessages({ limit: 100 });

      await db.run(
        `INSERT INTO contacts (name, phone, last_message_date, message_count)
         VALUES (?, ?, ?, ?)`,
        [
          contact.name || contact.pushname || contact.number,
          contact.number,
          messages[0]?.timestamp
            ? new Date(messages[0].timestamp * 1000).toISOString()
            : null,
          messages.length,
        ]
      );
    } catch (err) {
      console.warn('⚠️ Failed contact:', contact.number, err.message);
    }
  }

  if (res) res.json({ success: true });
}
