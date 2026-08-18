import express from 'express';
import { USER_PATCH_FIELDS, validateUserPatch } from '../validation/userPatch.js';
import { buildConfigStatus } from '../ai/providerChain.js';

export function createUsersRouter(getDb) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const users = await getDb().all('SELECT * FROM users');
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    const { id, name, email } = req.body;
    try {
      await getDb().run(
        'INSERT OR REPLACE INTO users (id, name, email) VALUES (?, ?, ?)',
        id || `user-${Date.now()}`,
        name,
        email
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const validationError = validateUserPatch(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const setClauses = [];
    const values = [];
    for (const [field, { column, toDb }] of Object.entries(USER_PATCH_FIELDS)) {
      if (req.body[field] !== undefined) {
        setClauses.push(`${column} = ?`);
        values.push(toDb(req.body[field]));
      }
    }
    if (setClauses.length === 0) return res.json({ success: true });

    try {
      values.push(id);
      await getDb().run(`UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`, values);
      res.json({ success: true });
    } catch (err) {
      if (err.message && err.message.includes('UNIQUE constraint failed: users.email')) {
        return res.status(409).json({ error: 'That email address is already in use.' });
      }
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

export function createConfigStatusRouter() {
  const router = express.Router();
  router.get('/', (req, res) => {
    res.json(buildConfigStatus());
  });
  return router;
}
