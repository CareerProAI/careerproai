import express from 'express';

// Update one or more user fields (account name/email, API key label,
// notification prefs) via a targeted UPDATE built from a fixed column
// allowlist, not an INSERT OR REPLACE, so it never risks clobbering
// fields the caller didn't send.
const USER_PATCH_FIELDS = {
  name: { column: 'name', toDb: (v) => v.trim() },
  email: { column: 'email', toDb: (v) => v.trim() },
  apiKeyLabel: { column: 'api_key_label', toDb: (v) => v || '' },
  notifyJobMatches: { column: 'notify_job_matches', toDb: (v) => (v ? 1 : 0) },
  notifyResumeAnalysis: { column: 'notify_resume_analysis', toDb: (v) => (v ? 1 : 0) },
  notifyWeeklySummary: { column: 'notify_weekly_summary', toDb: (v) => (v ? 1 : 0) }
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (req.body.name !== undefined && (typeof req.body.name !== 'string' || !req.body.name.trim())) {
      return res.status(400).json({ error: 'Name cannot be empty.' });
    }
    if (req.body.email !== undefined && (typeof req.body.email !== 'string' || !EMAIL_PATTERN.test(req.body.email.trim()))) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const setClauses = [];
    const values = [];

    for (const [field, { column, toDb }] of Object.entries(USER_PATCH_FIELDS)) {
      if (req.body[field] !== undefined) {
        setClauses.push(`${column} = ?`);
        values.push(toDb(req.body[field]));
      }
    }

    if (setClauses.length === 0) {
      return res.json({ success: true });
    }

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

// Safe, read-only config status — reports WHETHER at least one server-side AI provider
// key is configured, never the key values themselves.
export function createConfigStatusRouter() {
  const router = express.Router();
  router.get('/', (req, res) => {
    const aiConfigured = Boolean(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY);
    res.json({ aiConfigured });
  });
  return router;
}
