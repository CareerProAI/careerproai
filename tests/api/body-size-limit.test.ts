// T14: express.json({ limit: '50kb' }) must reject oversized payloads.
// T15: CORS must not reflect origins outside the allowlist (no wildcard).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiUrl, checkPrereqs } from './helpers/http.ts';

test('T14: JSON body over 50kb is rejected with 413', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const res = await fetch(apiUrl('/users'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 't14-oversized',
      name: 'x'.repeat(100_000),
      email: 't14@example.com',
    }),
  });
  assert.equal(res.status, 413);
});

test('T14b: match-batch JSON over 50kb is not rejected with 413', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const res = await fetch(apiUrl('/jobs/match-batch'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile: { summary: 'x'.repeat(60_000) }, jobs: [] }),
  });
  assert.notEqual(res.status, 413);
});

test('T15: CORS does not reflect an unlisted origin', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const res = await fetch(apiUrl('/config/status'), {
    headers: { Origin: 'https://evil.example.com' },
  });
  assert.notEqual(res.headers.get('access-control-allow-origin'), 'https://evil.example.com');
});

test('T15b: CORS reflects Vite fallback loopback origin', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const res = await fetch(apiUrl('/config/status'), {
    headers: { Origin: 'http://localhost:3002' },
  });
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:3002');
});
