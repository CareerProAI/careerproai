import { DatabaseSync } from 'node:sqlite';
import { wrapNodeSqlite } from './sqliteAdapter.js';

export function openNodeSqlite(filename) {
  return wrapNodeSqlite(new DatabaseSync(filename, { enableForeignKeyConstraints: true }));
}
