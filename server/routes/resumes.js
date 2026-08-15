import express from 'express';
import { reassembleResumeProfile } from '../resumeParsing/reassembleResumeProfile.js';

export function createResumesRouter(getDb) {
  const router = express.Router();

  // Get all resumes for a user
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

  // Get a detailed single resume including all sub-tables
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const db = getDb();
    try {
      const resume = await db.get('SELECT * FROM resumes WHERE id = ?', id);
      if (!resume) {
        return res.status(404).json({ error: 'Resume profile not found.' });
      }

      // None of these 8 queries depend on each other's results — fire them together
      // rather than one round trip at a time. sqlite3 still serializes execution
      // internally, but this lets it dispatch each queued command back-to-back instead
      // of waiting a full event-loop tick between every individual await.
      const [skills, experience, education, certifications, projects, languages, socialLinks, analysis] = await Promise.all([
        db.all('SELECT skill_name, category FROM resume_skills WHERE resume_id = ?', id),
        db.all('SELECT * FROM experience WHERE resume_id = ?', id),
        db.all('SELECT * FROM education WHERE resume_id = ?', id),
        db.all('SELECT * FROM certifications WHERE resume_id = ?', id),
        db.all('SELECT * FROM projects WHERE resume_id = ?', id),
        db.all('SELECT * FROM languages WHERE resume_id = ?', id),
        db.all('SELECT platform, url FROM social_links WHERE resume_id = ?', id),
        db.get('SELECT strengths, improvements FROM resume_analysis WHERE resume_id = ?', id),
      ]);

      const fullProfile = reassembleResumeProfile(resume, {
        skills, experience, education, certifications, projects, languages, socialLinks, analysis,
      });
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
