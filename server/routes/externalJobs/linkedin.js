import express from 'express';
import * as cheerio from 'cheerio';
import { fetchLinkedInPage, LINKEDIN_PAGE_SIZE } from './fetchLinkedInPage.js';
import { stripJobDescriptionHtml } from './htmlUtils.js';

// External job listings from LinkedIn's public "guest" job-search endpoint — no login/
// cookies involved (deliberately chosen over authenticated scraping to avoid any account-
// ban risk). Fetches as many LINKEDIN_PAGE_SIZE pages as needed to reach `count`, in
// parallel; one page failing doesn't fail the whole request (Promise.allSettled), it
// just returns fewer listings than requested.
export function createLinkedInRouter() {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const keywords = (req.query.keywords || '').toString().slice(0, 100);
    const location = (req.query.location || '').toString().slice(0, 100);
    const count = Math.min(Math.max(parseInt(req.query.count, 10) || LINKEDIN_PAGE_SIZE, 1), 50);
    const pagesNeeded = Math.ceil(count / LINKEDIN_PAGE_SIZE);

    try {
      const pageResults = await Promise.allSettled(
        Array.from({ length: pagesNeeded }, (_, i) => fetchLinkedInPage(keywords, location, i * LINKEDIN_PAGE_SIZE))
      );
      const fetched = pageResults
        .filter((r) => r.status === 'fulfilled')
        .flatMap((r) => r.value);
      // LinkedIn's guest endpoint doesn't always honor the `start` offset, so
      // paging can return the same listings more than once — dedupe by jobId
      // rather than trust page count. Returning fewer than `count` listings is
      // expected and fine; returning duplicates is not.
      const data = Array.from(new Map(fetched.map((j) => [j.jobId, j])).values()).slice(0, count);

      if (data.length === 0) {
        throw new Error('All upstream pages failed');
      }

      res.json({ data });
    } catch (err) {
      console.error('Failed to fetch LinkedIn job listings:', err.message);
      res.status(502).json({ error: 'Unable to reach LinkedIn job listings service.' });
    }
  });

  return router;
}

// Only real LinkedIn job-detail pages may be fetched by the route below — without this,
// an endpoint that fetches an arbitrary client-supplied `url` would be an open SSRF proxy.
const LINKEDIN_JOB_VIEW_URL_PATTERN = /^https:\/\/(www\.)?linkedin\.com\/jobs\/view\//i;

// Lazily fetches ONE LinkedIn job's full description from its real detail page — called
// on-demand only when a user opens a specific job's details, not upfront for every
// listing, to keep the added request volume bounded to actual user interest.
export function createLinkedInDescriptionRouter() {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const url = (req.query.url || '').toString();

    if (!LINKEDIN_JOB_VIEW_URL_PATTERN.test(url)) {
      return res.status(400).json({ error: 'url must be a linkedin.com/jobs/view/ link.' });
    }

    try {
      const upstreamRes = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      // LinkedIn frequently blocks scraping requests (429, 999, redirects to auth wall).
      // Return an empty description gracefully rather than a 502 that floods the browser
      // console — callers already handle '' as "not AI-scored" via mapLinkedInJobs.ts.
      if (!upstreamRes.ok) {
        return res.json({ description: '' });
      }
      const html = await upstreamRes.text();
      const $ = cheerio.load(html);
      const markupHtml = $('.show-more-less-html__markup').first().html() || '';
      const description = stripJobDescriptionHtml(markupHtml);

      res.json({ description });
    } catch (err) {
      console.error('Failed to fetch LinkedIn job description:', err.message);
      res.status(502).json({ error: 'Unable to load the full job description right now.' });
    }
  });

  return router;
}
