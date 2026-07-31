// A09: GET /api/external-jobs/linkedin/description must reject any URL that isn't a real
// linkedin.com/jobs/view/... link BEFORE making any outbound fetch — otherwise this
// endpoint would be an open SSRF proxy. No AI key needed, just the server running.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiUrl, checkPrereqs } from './helpers/http.ts';

async function requestDescription(url: string) {
  return fetch(apiUrl(`/external-jobs/linkedin/description?url=${encodeURIComponent(url)}`));
}

test('A09: SSRF guard rejects non-LinkedIn and lookalike URLs, accepts the real pattern', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const rejected = [
    'https://evil.example.com/internal-metadata',
    'https://linkedin.com.evil.com/jobs/view/123',
    'http://169.254.169.254/latest/meta-data/',
  ];
  for (const url of rejected) {
    const res = await requestDescription(url);
    assert.equal(res.status, 400, `expected 400 for ${url}`);
    const body = await res.json();
    assert.match(body.error, /url must be a linkedin\.com\/jobs\/view\/ link/i);
  }

  // Positive case: a well-formed URL must pass the regex gate (not be rejected with the
  // same 400). The actual scrape against a real, possibly-stale job id is not asserted
  // here — that depends on LinkedIn's live upstream, not on this app's SSRF guard.
  const positive = await requestDescription('https://www.linkedin.com/jobs/view/123456789');
  assert.notEqual(positive.status, 400, 'a genuine linkedin.com/jobs/view/ URL must not be rejected by the guard');
});
