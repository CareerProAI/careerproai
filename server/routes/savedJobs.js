import express from 'express';
import { validateSavedJobPost, capNotes } from '../validation/savedJob.js';

export function createSavedJobsRouter(getDb) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const resumeId = req.query.resumeId;
    if (!resumeId) return res.status(400).json({ error: 'resumeId is required.' });
    try {
      const savedJobs = await getDb().all('SELECT * FROM job_matches WHERE resume_id = ?', resumeId);
      res.json(savedJobs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    const { resumeId, jobId, matchRate, whyMatches, missingSkills, resumeImprovements } = req.body;
    const validationError = validateSavedJobPost({ resumeId, jobId, matchRate });
    if (validationError) return res.status(400).json({ error: validationError });

    try {
      await getDb().run(
        `INSERT OR REPLACE INTO job_matches (id, resume_id, job_id, match_rate, why_matches, missing_skills, resume_improvements, saved_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        `match-${resumeId}-${jobId}`,
        resumeId,
        jobId,
        matchRate,
        whyMatches || '',
        JSON.stringify(missingSkills || []),
        JSON.stringify(resumeImprovements || []),
        new Date().toLocaleString()
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await getDb().run('UPDATE job_matches SET notes = ? WHERE id = ?', capNotes(req.body.notes), id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await getDb().run('DELETE FROM job_matches WHERE id = ?', req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
