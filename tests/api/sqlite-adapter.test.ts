import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { bindParams, wrapNodeSqlite } from '../../server/database/sqliteAdapter.js';
import { useBuiltinSqlite } from '../../server/database/connection.js';

test('bindParams flattens a single array the way sqlite3 does', () => {
  assert.deepEqual(bindParams(['a', 1]), ['a', 1]);
  assert.deepEqual(bindParams([['a', 1]]), ['a', 1]);
});

test('node:sqlite adapter supports exec/run/get/all like the sqlite package', async () => {
  const db = wrapNodeSqlite(new DatabaseSync(':memory:'));
  await db.exec('CREATE TABLE t (id TEXT, n INTEGER)');
  await db.run('INSERT INTO t VALUES (?, ?)', 'a', 1);
  await db.run('INSERT INTO t VALUES (?, ?)', ['b', 2]);
  const row = await db.get('SELECT * FROM t WHERE id = ?', 'a');
  assert.equal(row.n, 1);
  const rows = await db.all('SELECT * FROM t ORDER BY id');
  assert.equal(rows.length, 2);
  assert.equal(rows[1].id, 'b');
});

test('local hosts do not use the serverless sqlite driver', () => {
  assert.equal(useBuiltinSqlite(), false);
});
