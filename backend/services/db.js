import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const getDB = async () => {
  const DB_FILE = process.env.NODE_ENV === 'test' ? 'contacts.test.db' : 'contacts.db';

  return open({
    filename: resolve(__dirname, `../db/${DB_FILE}`),
    driver: sqlite3.Database,
  });
};
