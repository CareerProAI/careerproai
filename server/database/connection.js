import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// server/database/connection.js -> up two levels to the project root, where
// talentai.db lives alongside package.json (unchanged location).
const dbPath = path.resolve(__dirname, '../../talentai.db');

export async function getDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}
