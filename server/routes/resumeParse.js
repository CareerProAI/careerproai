import express from 'express';
import { upload, extractResumeText } from '../upload/extractResumeText.js';
import { callAIAPI } from '../ai/callAIAPI.js';
import { RESUME_PARSE_SYSTEM_PROMPT } from '../resumeParsing/resumeParsePrompt.js';
import { insertParsedResume } from '../resumeParsing/insertParsedResume.js';
import { MAX_RESUME_BYTES } from '../upload/resumeFileFilter.js';

// Parse Resume endpoint (Groq/Gemini) — accepts a multipart/form-data upload under the "file" field
export function createResumeParseRouter(getDb) {
  const router = express.Router();

  router.post('/', (req, res) => {
    upload.single('file')(req, res, async (uploadErr) => {
      if (uploadErr) {
        const tooBig = uploadErr.code === 'LIMIT_FILE_SIZE';
        return res.status(400).json({
          error: tooBig ? 'Resume must be 5MB or smaller.' : (uploadErr.message || 'File upload failed.'),
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'A resume file is required.' });
      }

      if (req.file.size > MAX_RESUME_BYTES) {
        return res.status(400).json({ error: 'Resume must be 5MB or smaller.' });
      }

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

      // Split into two try/catches (was one) so an AI-provider failure and a DB failure
      // get distinct, safe client-facing messages — neither err.message is ever forwarded
      // raw: an AI error embeds the full upstream provider error bodies (see the same fix
      // in jobCompare.js), and a DB error can name real table/column names.
      let parsedData;
      try {
        parsedData = await callAIAPI(RESUME_PARSE_SYSTEM_PROMPT, resumeText);
      } catch (aiErr) {
        console.error('Resume parsing AI call failed:', aiErr.message);
        if (aiErr.bothRateLimited) {
          return res.status(429).json({ error: 'AI parsing is temporarily rate-limited — please try again in a few minutes.' });
        }
        return res.status(502).json({ error: 'Unable to parse the resume right now. Please try again.' });
      }

      try {
        const resumeId = await insertParsedResume(getDb(), { activeUserId, filename, parsedData });
        res.json({
          success: true,
          resumeId: resumeId,
          candidateName: parsedData.candidateName,
          score: parsedData.score
        });
      } catch (dbErr) {
        console.error('Resume parsing DB transaction error:', dbErr);
        res.status(500).json({ error: 'Failed to save the parsed resume. Please try again.' });
      }
    });
  });

  return router;
}
