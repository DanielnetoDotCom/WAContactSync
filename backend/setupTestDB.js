// backend/setupTestDB.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.resolve('database.sqlite');
const schemaPath = path.resolve('db', 'schema.sql');

const run = async () => {
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  const schema = await fs.readFile(schemaPath, 'utf-8');
  await db.exec(schema);
  console.log('🗂️ Test database initialized');
};

run();
