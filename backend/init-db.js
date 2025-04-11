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

  const schemaPath = resolve(__dirname, 'db', 'schema.sql');
  const schemaSQL = await fs.readFile(schemaPath, 'utf-8');
  await db.exec(schemaSQL);

  console.log('📦 Database initialized.');
  await db.close();
}

init();
