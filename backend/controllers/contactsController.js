import { getDB } from '../services/db.js';
import {
  getInstance as getClient,
  getClientStatus,
  reinitializeClient,
  setClientReady,
} from '../services/whatsappService.js';
import { broadcastEvent } from '../routes/whatsappEvents.js';
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';


function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function syncContacts(req, res = null) {
  const isReady = getClientStatus();
  if (!isReady) {
    const message = 'WhatsApp client is not ready';
    console.warn(message);
    if (res) return res.status(503).json({ error: message });
    else throw new Error(message);
  }

  try {
    const db = await getDB();
    const client = getClient();
    if (!client) throw new Error('Client instance is null');

    await wait(1000); // Ensure client is stable

    // Ensure messages table exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        contact_phone TEXT,
        timestamp DATETIME,
        body TEXT
      )
    `);

    await db.exec('DELETE FROM contacts');
    const contacts = await client.getContacts();

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      if (!contact.isUser) continue;

      try {
        const chat = await contact.getChat();
        if (!chat) continue;

        let allMessages = [];
        let lastMessage = null;
        const batchSize = 20;

        while (allMessages.length <= 100) {
          const options = { limit: batchSize };
          if (lastMessage) options.before = lastMessage;

          const messages = await chat.fetchMessages(options);
          if (messages.length === 0) break;

          allMessages.push(...messages);
          lastMessage = messages[messages.length - 1];

          if (messages.length < batchSize) break;
        }

        // Save unique messages to DB
        for (const msg of allMessages) {
          await db.run(
            'INSERT OR IGNORE INTO messages (id, contact_phone, timestamp, body) VALUES (?, ?, ?, ?)',
            [msg.id._serialized, contact.number, new Date(msg.timestamp * 1000).toISOString(), msg.body || '']
          );
        }

        // Count total messages for this contact
        const result = await db.get(
          'SELECT COUNT(*) as count FROM messages WHERE contact_phone = ?',
          [contact.number]
        );

        const lastMsgTimestamp = allMessages[0]?.timestamp
          ? new Date(allMessages[0].timestamp * 1000).toISOString()
          : null;

        await db.run(
          `INSERT INTO contacts (name, phone, last_message_date, message_count)
           VALUES (?, ?, ?, ?)`,
          [
            contact.name || contact.pushname || contact.number,
            contact.number,
            lastMsgTimestamp,
            result.count,
          ]
        );

        broadcastEvent('sync-progress', {
          current: i + 1,
          total: contacts.length,
          name: contact.name || contact.pushname || contact.number,
          phone: contact.number,
        });
      } catch (err) {
        console.warn('⚠️ Failed contact:', contact.number, err.message);
      }
    }

    if (res) res.json({ success: true });
  } catch (e) {
    console.error('❌ Failed to fetch contacts:', e.message);
    if (res) return res.status(500).json({ error: 'Client not ready or disconnected' });
  }
}

export async function listContacts(req, res) {
  const db = await getDB();
  const contacts = await db.all('SELECT * FROM contacts ORDER BY last_message_date DESC');
  res.json({ contacts });
}

export async function resetContacts(req, res) {
  try {
    const db = await getDB();
    await db.exec('DELETE FROM contacts');

    const client = getClient();
    if (client) {
      try {
        await client.destroy();
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

    await reinitializeClient();
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to reset:', err);
    res.status(500).json({ error: 'Failed to reset' });
  }
}
