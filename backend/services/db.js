import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

let dbInstance;

export const getDB = async () => {
  if (dbInstance) return dbInstance;

  const DB_FILE = process.env.NODE_ENV === 'test' ? 'contacts.test.db' : 'contacts.db';
  const dbPath = resolve(__dirname, `../db/${DB_FILE}`);
  const schemaPath = resolve(__dirname, '../db/schema.sql');

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  const tableExists = await dbInstance.get(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='contacts';
  `);

  if (!tableExists) {
    console.log('⚠️ Tables not found. Initializing from schema.sql...');
    const schemaSQL = await fs.readFile(schemaPath, 'utf-8');
    await dbInstance.exec(schemaSQL);
    console.log('✅ Database schema created.');
  }

  return dbInstance;
};
