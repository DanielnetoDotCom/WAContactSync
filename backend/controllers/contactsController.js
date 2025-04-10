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
  console.log('⚙️ syncContacts() called...');
  const isReady = getClientStatus();
  console.log('🟢 Client ready?', isReady);

  if (!isReady) {
    const message = 'WhatsApp client is not ready';
    console.warn(message);
    if (res) return res.status(503).json({ error: message });
    else throw new Error(message);
  }

  const onlyKnown = req.query.onlyKnown === 'true';
  const onlyNotArchived = req.query.onlyNotArchived === 'true';

  try {
    const db = await getDB();
    const client = getClient();

    if (!client) {
      throw new Error('Client instance is null');
    }

    if (typeof client.getContacts !== 'function') {
      throw new Error('Client.getContacts is not available');
    }

    console.log('📡 Client instance acquired. Waiting before fetching contacts...');
    await wait(1000);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        contact_phone TEXT,
        timestamp DATETIME,
        body TEXT
      )
    `);

    await db.exec('DELETE FROM messages');

    await db.exec('DELETE FROM contacts');

    const contacts = await client.getContacts();
    console.log(`📥 ${contacts.length} contacts fetched`);

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      if (!contact.isUser) continue;

      if (onlyKnown && !contact.name && !contact.pushname) continue;

      try {
        const chat = await contact.getChat();
        if (!chat) continue;

        if (onlyNotArchived && chat.archived) continue;

        const previousCountRow = await db.get(
          'SELECT COUNT(*) as count FROM messages WHERE contact_phone = ?',
          [contact.number]
        );
        const previousCount = previousCountRow?.count || 0;

        let allMessages = [];
        let lastMessage = null;
        const maxMessages = parseInt(req.query.limit) || 100;
        while (true) {
          const options = { limit: maxMessages };
          if (lastMessage) options.before = lastMessage;

          const messages = await chat.fetchMessages(options);
          if (messages.length === 0) break;

          allMessages.push(...messages);
          lastMessage = messages[messages.length - 1];

          if (allMessages.length >= maxMessages) break;
        }

        // Trim excess messages if we fetched more than needed
        if (allMessages.length > maxMessages) {
          allMessages = allMessages.slice(0, maxMessages);
        }

        for (const msg of allMessages) {
          await db.run(
            'INSERT OR IGNORE INTO messages (id, contact_phone, timestamp, body) VALUES (?, ?, ?, ?)',
            [msg.id._serialized, contact.number, new Date(msg.timestamp * 1000).toISOString(), msg.body || '']
          );
        }

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

        const eta = Math.round(Math.max((chat.totalMessages - result.count) * 0.05, 1));

        broadcastEvent('sync-progress', {
          current: i + 1,
          total: contacts.length,
          name: contact.name || contact.pushname || contact.number,
          phone: contact.number,
          etaSeconds: eta,
        });

        console.log(`🔄 [${i + 1}/${contacts.length}] Synced: ${contact.name || contact.pushname || contact.number}`);

        const newMessagesCount = result.count - previousCount;
        if (newMessagesCount > 0) {
          broadcastEvent('toast', {
            type: 'success',
            message: `📩 Found ${newMessagesCount} new message(s) for ${contact.name || contact.pushname || contact.number}`,
          });
        }

      } catch (err) {
        console.warn('⚠️ Failed contact:', contact.number, err.message);
      }
    }

    broadcastEvent('sync-complete', {});
    if (res) res.json({ success: true });

  } catch (e) {
    console.error('❌ Failed to fetch contacts:', e.message);
    if (res) return res.status(500).json({ error: e.message });
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
