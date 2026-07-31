import * as cheerio from 'cheerio';

// LinkedIn's public "guest" job-search endpoint returns a fixed ~10 listings per
// request (its own hardcoded page size, not something a query param controls) — this
// helper fetches and parses exactly one such page, given a `start` offset.
export const LINKEDIN_PAGE_SIZE = 10;

export async function fetchLinkedInPage(keywords, location, start) {
  const params = new URLSearchParams({ keywords, location, start: String(start) });
  const upstreamUrl = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?${params}`;
  const upstreamRes = await fetch(upstreamUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  if (!upstreamRes.ok) {
    throw new Error(`Upstream responded with status ${upstreamRes.status}`);
  }
  const html = await upstreamRes.text();
  const $ = cheerio.load(html);

  const jobs = [];
  $('div.base-search-card').each((_, el) => {
    const urn = $(el).attr('data-entity-urn') || '';
    const jobId = urn.split(':').pop() || '';
    if (!jobId) return;
    jobs.push({
      jobId,
      title: $(el).find('.base-search-card__title').first().text().trim(),
      company: $(el).find('.base-search-card__subtitle a').first().text().trim(),
      location: $(el).find('.job-search-card__location').first().text().trim(),
      postedDate: $(el).find('time.job-search-card__listdate').first().attr('datetime') || '',
      listingUrl: $(el).find('a.base-card__full-link').first().attr('href') || '',
      logoUrl: $(el).find('img').first().attr('data-delayed-url') || '',
    });
  });
  return jobs;
}
