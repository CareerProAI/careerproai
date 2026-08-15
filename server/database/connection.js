import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── S11: Configurable DB path via DB_PATH env var ─────────────────────────────
// In development the default is talentai.db at the project root (unchanged).
// In production, set DB_PATH=/data/talentai.db to move the file outside the
// web root so it can't be served as a static asset even if the web server is
// misconfigured. path.resolve() normalises relative paths to absolute.
function defaultDbPath() {
  if (process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'talentai.db');
  }
  return path.resolve(__dirname, '../../talentai.db');
}

const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : defaultDbPath();

export async function getDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}
