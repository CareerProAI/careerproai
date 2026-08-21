import { getDb } from './database/connection.js';
import { createSchema } from './database/schema/index.js';
import { runMigrations } from './database/migrations.js';
import { seedDefaultUser } from './database/seed.js';

export { getDb };

export async function initDb() {
  const db = await getDb();

  // Enable foreign keys + WAL (reduces SQLITE_BUSY when tests hit the DB concurrently).
  await db.exec('PRAGMA foreign_keys = ON');
  await db.exec('PRAGMA journal_mode = WAL');

  await createSchema(db);
  await runMigrations(db);
  await seedDefaultUser(db);

  console.log('SQLite Database schema initialized successfully.');
  return db;
}
