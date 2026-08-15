// T11–T13: Helmet must set production security headers on every response.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiUrl, checkPrereqs } from './helpers/http.ts';

async function statusHeaders(): Promise<Headers> {
  const res = await fetch(apiUrl('/config/status'));
  return res.headers;
}

test('T11: X-Content-Type-Options is nosniff', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const headers = await statusHeaders();
  assert.equal(headers.get('x-content-type-options'), 'nosniff');
});

test('T12: X-Frame-Options is DENY or SAMEORIGIN', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const value = (await statusHeaders()).get('x-frame-options');
  assert.ok(value, 'x-frame-options must be present');
  assert.match(value, /^(DENY|SAMEORIGIN)$/i);
});

test('T13: Referrer-Policy header is present', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const value = (await statusHeaders()).get('referrer-policy');
  assert.ok(value, 'referrer-policy must be present');
});
