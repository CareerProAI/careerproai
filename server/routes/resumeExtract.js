import express from 'express';
import { upload, extractResumeText } from '../upload/extractResumeText.js';
import { callAIAPI } from '../ai/callAIAPI.js';
import { CV_EXTRACT_PROMPT } from '../resumeParsing/cvExtractPrompt.js';
import { MAX_RESUME_BYTES } from '../upload/resumeFileFilter.js';

// POST /api/resumes/extract-cv — lightweight alternative to /api/resumes/parse.
// Used exclusively by the Customised CV wizard: extracts only the six fields that
// buildProfileSummary() needs, skipping DB persistence entirely.
// ~50% smaller prompt and no SQLite round-trips → 3-4× faster than full parse.
export function createResumeExtractRouter() {
  const router = express.Router();

  router.post('/', (req, res) => {
    upload.single('file')(req, res, async (uploadErr) => {
      if (uploadErr) {
        const tooBig = uploadErr.code === 'LIMIT_FILE_SIZE';
        return res.status(400).json({
          error: tooBig ? 'CV must be 5MB or smaller.' : (uploadErr.message || 'File upload failed.'),
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'A CV file is required.' });
      }

      if (req.file.size > MAX_RESUME_BYTES) {
        return res.status(400).json({ error: 'CV must be 5MB or smaller.' });
      }

      let cvText;
      try {
        cvText = await extractResumeText(req.file);
      } catch (extractErr) {
        return res.status(400).json({ error: extractErr.message });
      }

      if (!cvText || !cvText.trim()) {
        return res.status(400).json({ error: 'Could not extract any readable text from the uploaded file.' });
      }

      // Truncate to 6 000 chars (~3 resume pages). The wizard only needs the top
      // 6 fields — all critical info appears early. Fewer tokens = Z.ai finishes
      // well inside its 50s budget even when Groq/Gemini are rate-limited.
      const trimmedText = cvText.slice(0, 6_000);

      try {
        const parsed = await callAIAPI(CV_EXTRACT_PROMPT, trimmedText, {
          maxTokens: 800,
          temperature: 0.7,
        });
        return res.json(parsed);
      } catch (aiErr) {
        console.error('CV extract AI call failed:', aiErr.message);
        if (aiErr.bothRateLimited) {
          return res.status(429).json({ error: 'AI parsing is temporarily rate-limited — please try again in a few minutes.' });
        }
        return res.status(502).json({ error: 'Unable to extract CV data right now. Please try again.' });
      }
    });
  });

  return router;
}
