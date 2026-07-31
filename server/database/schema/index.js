import { ensureCoreTables } from './coreTables.js';
import { ensureProfileTables } from './profileTables.js';
import { ensurePortfolioTables } from './portfolioTables.js';
import { ensureMetaTables } from './metaTables.js';
import { ensureIndexes } from './indexes.js';

// Runs every CREATE TABLE IF NOT EXISTS + CREATE INDEX IF NOT EXISTS statement — all
// idempotent, safe to run on every startup against an existing database.
export async function createSchema(db) {
  await ensureCoreTables(db);
  await ensureProfileTables(db);
  await ensurePortfolioTables(db);
  await ensureMetaTables(db);
  await ensureIndexes(db);
}
