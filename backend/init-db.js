import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function init() {
  const db = await open({
    filename: resolve(__dirname, 'db', 'contacts.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      last_message_date TEXT,
      message_count INTEGER
    );
  `);

  console.log('📦 Database initialized.');
  await db.close();
}

init();
