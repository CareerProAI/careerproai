import express from 'express';
import { upload, extractResumeText } from '../upload/extractResumeText.js';
import { callAIAPI } from '../ai/callAIAPI.js';
import { RESUME_PARSE_SYSTEM_PROMPT } from '../resumeParsing/resumeParsePrompt.js';
import { insertParsedResume } from '../resumeParsing/insertParsedResume.js';
import { loadResumeProfile } from '../resumeParsing/loadResumeProfile.js';
import { applyUkAtsToParsed } from '../ats/applyUkAtsToParsed.js';
import { MAX_RESUME_BYTES } from '../upload/resumeFileFilter.js';

export function createResumeParseRouter(getDb) {
  const router = express.Router();

  router.post('/', (req, res) => {
    upload.single('file')(req, res, async (uploadErr) => {
      if (uploadErr) {
        const tooBig = uploadErr.code === 'LIMIT_FILE_SIZE';
        return res.status(400).json({
          error: tooBig ? 'CV must be 5MB or smaller.' : (uploadErr.message || 'File upload failed.'),
        });
      }
      if (!req.file) return res.status(400).json({ error: 'A CV file is required.' });
      if (req.file.size > MAX_RESUME_BYTES) return res.status(400).json({ error: 'CV must be 5MB or smaller.' });

      const activeUserId = req.body.userId || 'user-default';
      const filename = req.file.originalname;

      let resumeText;
      try {
        resumeText = await extractResumeText(req.file);
      } catch (extractErr) {
        return res.status(400).json({ error: extractErr.message });
      }
      if (!resumeText || !resumeText.trim()) {
        return res.status(400).json({ error: 'Could not extract any readable text from the uploaded file.' });
      }

      const cvText = resumeText.slice(0, 8_000);
      let parsedData;
      try {
        parsedData = await callAIAPI(RESUME_PARSE_SYSTEM_PROMPT, cvText, { maxTokens: 2000, temperature: 0.7 });
      } catch (aiErr) {
        console.error('Resume parsing AI call failed:', aiErr.message);
        if (aiErr.bothRateLimited) {
          return res.status(429).json({ error: 'AI parsing is temporarily rate-limited — please try again in a few minutes.' });
        }
        return res.status(502).json({ error: 'Unable to parse the CV right now. Please try again.' });
      }

      parsedData = applyUkAtsToParsed(parsedData, {
        text: cvText,
        filename,
        jobDescription: req.body.jobDescription,
      });

      try {
        const db = getDb();
        const resumeId = await insertParsedResume(db, { activeUserId, filename, parsedData });
        const profile = await loadResumeProfile(db, resumeId);
        res.json({
          success: true,
          resumeId,
          candidateName: parsedData.candidateName,
          score: parsedData.score,
          profile,
        });
      } catch (dbErr) {
        console.error('Resume parsing DB transaction error:', dbErr);
        res.status(500).json({ error: 'Failed to save the parsed CV. Please try again.' });
      }
    });
  });

  return router;
}
