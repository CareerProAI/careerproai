import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveApiBase } from '../../src/api/resolveApiBase.ts';
import { restoreExpressUrl } from '../../server/restoreExpressUrl.js';
import { isOriginAllowed, isSameHostOrigin } from '../../server/middleware/cors.js';

test('API base is same-origin /api unless VITE_API_BASE is set', () => {
  assert.equal(resolveApiBase(), '/api');
  assert.equal(resolveApiBase(''), '/api');
  assert.equal(resolveApiBase('https://api.example.com/api/'), 'https://api.example.com/api');
});

test('restoreExpressUrl leaves a full /api path unchanged', () => {
  const req = { url: '/api/resumes?userId=user-default', headers: {}, query: {} };
  restoreExpressUrl(req);
  assert.equal(req.url, '/api/resumes?userId=user-default');
});

test('restoreExpressUrl prefixes catch-all paths missing /api', () => {
  const req = { url: '/resumes?userId=x', headers: {}, query: {} };
  restoreExpressUrl(req);
  assert.equal(req.url, '/api/resumes?userId=x');
});

test('restoreExpressUrl rebuilds path from Vercel query.path', () => {
  const req = {
    url: '/?path=jobs&path=match-batch',
    headers: {},
    query: { path: ['jobs', 'match-batch'] },
  };
  restoreExpressUrl(req);
  assert.equal(req.url, '/api/jobs/match-batch');
});

test('same-host Origin is allowed on any deployed domain', () => {
  const req = { headers: { 'x-forwarded-host': 'talentai-lilac.vercel.app' } };
  assert.equal(isSameHostOrigin('https://talentai-lilac.vercel.app', req), true);
  assert.equal(isOriginAllowed('https://talentai-lilac.vercel.app', new Set(), req), true);
  assert.equal(isOriginAllowed('https://evil.example', new Set(), req), false);
});
