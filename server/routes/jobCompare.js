import express from 'express';
import { callAIAPI } from '../ai/callAIAPI.js';
import { buildResumeProfileSummary } from '../ai/buildResumeProfileSummary.js';

// Job Match Matrix comparison endpoint
export function createJobCompareRouter() {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { profile, job } = req.body;

    if (!profile || !job) {
      return res.status(400).json({ error: 'profile and job are required.' });
    }

    const systemPrompt = `You are an expert career matcher. Compare the user's resume profile with the job description.
Provide a concise, professional comparison (2-3 sentences max) explaining how the user's experience aligns with this job, highlighting matching strengths or specific skills. Address the user directly (e.g. "Your experience..."). Do not use markdown styling.
Return strict JSON only, in this exact shape: {"alignment": "<the comparison text>"}.`;

    const userPrompt = `Resume Profile:
${buildResumeProfileSummary(profile)}

Job:
Title: ${job.title}
Company: ${job.company}
Required Skills: ${job.skills.join(', ')}
Why it matches: ${job.whyMatches}`;

    try {
      const parsedData = await callAIAPI(systemPrompt, userPrompt);
      // Express returns the alignment string if parsedData has it or standard response
      const alignment = parsedData.alignment || parsedData.text || JSON.stringify(parsedData);
      res.json({ alignment });
    } catch (err) {
      // Primary call failed for any reason (network error, non-2xx, JSON-mode parse
      // failure, etc.) — retry once as a plain-text completion instead of JSON mode.
      console.error('Primary alignment call failed, retrying as plain text:', err.message);
      try {
        const alignment = await callAIAPI(systemPrompt, userPrompt, { jsonMode: false, maxTokens: 150, temperature: 0.5 });
        res.json({ alignment });
      } catch (fallbackErr) {
        // Never forward fallbackErr.message to the client — it's the raw combined
        // provider error (full upstream JSON bodies, org IDs, billing URLs), the exact
        // kind of internal detail CLAUDE.md's security checklist says not to leak.
        // Mirrors the clean-message pattern already used in jobMatchBatch.js /
        // generateApplication.js.
        console.error('Failed to load experience alignment:', fallbackErr.message);
        if (fallbackErr.bothRateLimited) {
          return res.status(429).json({ error: 'AI matching is temporarily rate-limited — please try again in a few minutes.' });
        }
        res.status(502).json({ error: 'Unable to load experience alignment right now.' });
      }
    }
  });

  return router;
}
