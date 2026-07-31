// Direct SQLite access used ONLY to clean up test-created rows that the REST API has no
// way to remove — there is no DELETE /api/users/:id endpoint (by design: server.js never
// needed one), but A04 must create real users to exercise the duplicate-email 409 path.
// Uses the same `sqlite`/`sqlite3` packages database.js already depends on, pointed at
// the same talentai.db file — never used for assertions, only for cleanup, so the actual
// test behavior still goes entirely through the real HTTP API.
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../../talentai.db');

export async function deleteUsersByIdPrefix(prefix: string): Promise<void> {
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  try {
    await db.run('DELETE FROM users WHERE id LIKE ?', `${prefix}%`);
  } finally {
    await db.close();
  }
}
