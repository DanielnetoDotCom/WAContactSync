// backend/setupTestDB.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DB_FILE = path.resolve('db', 'contacts.test.db');
const SCHEMA_PATH = path.resolve('db', 'schema.sql');

try {
  const schema = readFileSync(SCHEMA_PATH, 'utf8');

  const db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database,
  });

  await db.exec(schema);
  console.log('✅ Test database created and schema applied.');
  await db.close();
} catch (err) {
  console.error('❌ Error creating test database:', err);
  process.exit(1);
}

