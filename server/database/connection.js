import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Abstract Factory: native sqlite3 locally; built-in node:sqlite on serverless. */
export function useBuiltinSqlite() {
  return Boolean(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

function defaultDbPath() {
  if (useBuiltinSqlite()) return path.join('/tmp', 'talentai.db');
  return path.resolve(__dirname, '../../talentai.db');
}

const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : defaultDbPath();

function isWrongOsBinary(err) {
  const msg = String(err?.message || err);
  return err?.code === 'ERR_DLOPEN_FAILED'
    || msg.includes('invalid ELF header')
    || msg.includes('not a valid Win32');
}

export async function getDb() {
  if (useBuiltinSqlite()) {
    const { openNodeSqlite } = await import('./openNodeSqlite.js');
    return openNodeSqlite(dbPath);
  }
  try {
    const sqlite3 = (await import('sqlite3')).default;
    const { open } = await import('sqlite');
    return await open({ filename: dbPath, driver: sqlite3.Database });
  } catch (err) {
    if (!isWrongOsBinary(err)) throw err;
    // WSL + Windows share node_modules — sqlite3's .node is OS-specific.
    console.warn('sqlite3 native binary is for a different OS — using built-in node:sqlite.');
    const { openNodeSqlite } = await import('./openNodeSqlite.js');
    return openNodeSqlite(dbPath);
  }
}
