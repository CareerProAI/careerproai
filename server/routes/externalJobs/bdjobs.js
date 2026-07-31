import express from 'express';
import { stripJobDescriptionHtml } from './htmlUtils.js';

export function createBdjobsRouter() {
  const router = express.Router();

  // External job listings from Bdjobs.com (Bangladesh's largest job site) — server-side
  // proxy since this must run server-side regardless of CORS (avoids exposing the
  // upstream host directly to the client) and to keep query params validated/clamped.
  router.get('/', async (req, res) => {
    const page = Math.min(Math.max(parseInt(req.query.page, 10) || 1, 1), 500);
    const rpp = Math.min(Math.max(parseInt(req.query.rpp, 10) || 20, 1), 50);
    const keyword = (req.query.keyword || '').toString().slice(0, 100);

    try {
      let upstreamUrl = `https://gateway.bdjobs.com/recruitment-account-test/api/JobSearch/GetJobSearch?isPro=1&rpp=${rpp}&pg=${page}`;
      if (keyword) upstreamUrl += `&keyword=${encodeURIComponent(keyword)}`;
      const upstreamRes = await fetch(upstreamUrl);
      if (!upstreamRes.ok) {
        throw new Error(`Upstream responded with status ${upstreamRes.status}`);
      }
      const data = await upstreamRes.json();
      res.json(data);
    } catch (err) {
      console.error('Failed to fetch external job listings:', err.message);
      res.status(502).json({ error: 'Unable to reach external job listings service.' });
    }
  });

  return router;
}

// Lazily fetches ONE bdjobs.com job's full description from its (separate, reverse-
// engineered) details API — only reachable for a subset of listings (roughly the
// premium/early-access tier); many basic-tier listings genuinely have nothing here,
// which is bdjobs's own data gap, not a failure of this endpoint. Called on-demand only
// when a user opens a job's details whose initial list-fetch had no description, mirroring
// the LinkedIn route.
export function createBdjobsDescriptionRouter() {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const jobId = (req.query.jobId || '').toString();

    if (!/^\d+$/.test(jobId)) {
      return res.status(400).json({ error: 'jobId must be numeric.' });
    }

    try {
      const upstreamUrl = `https://gateway.bdjobs.com/ActtivejobsTest/api/JobSubsystem/jobDetails?jobId=${jobId}`;
      const upstreamRes = await fetch(upstreamUrl);
      if (!upstreamRes.ok) {
        throw new Error(`Upstream responded with status ${upstreamRes.status}`);
      }
      const body = await upstreamRes.json();
      const rawDescription = body?.data?.[0]?.JobDescription || '';
      const description = rawDescription ? stripJobDescriptionHtml(rawDescription) : '';

      res.json({ description });
    } catch (err) {
      console.error('Failed to fetch bdjobs job description:', err.message);
      res.status(502).json({ error: 'Unable to load the full job description right now.' });
    }
  });

  return router;
}
