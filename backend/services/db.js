import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const getDB = async () => {
  return open({
    filename: resolve(__dirname, '../db/contacts.db'),
    driver: sqlite3.Database,
  });
};
