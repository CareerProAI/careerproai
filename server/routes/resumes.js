import express from 'express';
import { loadResumeProfile } from '../resumeParsing/loadResumeProfile.js';
import { loadAllProfiles } from '../resumeParsing/loadAllProfiles.js';

export function createResumesRouter(getDb) {
  const router = express.Router();

  // Get all resumes for a user (summary list only)
  router.get('/', async (req, res) => {
    const userId = req.query.userId || 'user-default';
    try {
      const resumes = await getDb().all(
        'SELECT id, filename, candidate_name, current_role, score, ats_compatibility, last_analyzed FROM resumes WHERE user_id = ?',
        userId
      );
      res.json(resumes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Batch: all full profiles in one request — eliminates the 1+N pattern.
  // Must be defined before GET /:id so Express matches /all literally.
  router.get('/all', async (req, res) => {
    const userId = req.query.userId || 'user-default';
    try {
      const profiles = await loadAllProfiles(getDb(), userId);
      res.json(profiles);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load CV profiles.' });
    }
  });

  // Get a detailed single resume including all sub-tables
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const db = getDb();
    try {
      const fullProfile = await loadResumeProfile(db, id);
      if (!fullProfile) {
        return res.status(404).json({ error: 'Resume profile not found.' });
      }
      res.json(fullProfile);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── S9: Resume DELETE — ownership guard ────────────────────────────────────
  // Without this, any client can delete any user's resume by guessing the ID.
  // Now the requesting user's userId (from query param) must match the stored
  // user_id on the resume row. Falls back to 'user-default' if not provided,
  // preserving backward-compatibility for single-user sandbox mode.
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const requestingUserId = req.query.userId || req.body?.userId || 'user-default';

    try {
      const db = getDb();
      // Fetch the owner first — two separate DB calls is safer than a conditional
      // DELETE because it gives us a clear 404 vs 403 distinction.
      const resume = await db.get('SELECT user_id FROM resumes WHERE id = ?', id);
      if (!resume) {
        return res.status(404).json({ error: 'Resume not found.' });
      }
      if (resume.user_id !== requestingUserId) {
        return res.status(403).json({ error: 'Forbidden: you do not own this resume.' });
      }
      await db.run('DELETE FROM resumes WHERE id = ?', id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
