// A06 (bothRateLimited flag) + A08 (match-batch tampering guard) as fast, deterministic
// unit tests against the real production logic (server-utils.js), instead of trying to
// force two real 429 responses from live providers or coerce a live model into returning
// a malformed response — both of which test.md itself flags as slow/flaky/quota-burning.
// No server, no network, no AI key needed — these always run.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeBothRateLimited, computeAllRateLimited, sanitizeMatchEntry, clampMatchRate } from '../../server/server-utils.js';

test('A06: both providers 429 -> bothRateLimited is true', () => {
  const groqMsg = 'Groq API Error (429): rate limit exceeded';
  const geminiMsg = 'Gemini API Error (429): rate limit exceeded';
  assert.equal(computeBothRateLimited(groqMsg, geminiMsg), true);
});

test('A06: Groq 429 + unrelated Gemini failure -> bothRateLimited is false', () => {
  const groqMsg = 'Groq API Error (429): rate limit exceeded';
  const geminiMsg = 'Gemini API Error (401): invalid API key';
  assert.equal(computeBothRateLimited(groqMsg, geminiMsg), false);
});

test('A06: Groq 429 + Gemini 429 is not all-limited if Z.ai failed for another reason', () => {
  assert.equal(computeAllRateLimited([
    'Groq API Error (429): cap',
    'Gemini API Error (429): cap',
    'AI provider timed out after 20000ms',
  ]), false);
});

test('A08: unknown id in a match entry is dropped', () => {
  const validIds = new Set(['bdjobs-1', 'linkedin-2']);
  const result = sanitizeMatchEntry({ id: 'bdjobs-999', matchRate: 80, whyMatches: 'x', skills: [] }, validIds);
  assert.equal(result, null);
});

test('A08: out-of-range matchRate is clamped into [0, 100]', () => {
  assert.equal(clampMatchRate(9999), 100);
  assert.equal(clampMatchRate(-50), 0);
  assert.equal(clampMatchRate('high'), 0);
  assert.equal(clampMatchRate('87'), 87);
});

test('A08: a valid entry passes through with fields coerced/capped', () => {
  const validIds = new Set(['bdjobs-1']);
  const entry = {
    id: 'bdjobs-1',
    matchRate: '95.6',
    whyMatches: 'a'.repeat(600),
    skills: ['React', 'Node', 42, 'TypeScript', 'AWS', 'Docker', 'Extra'],
  };
  const result = sanitizeMatchEntry(entry, validIds);
  assert.ok(result);
  assert.equal(result!.id, 'bdjobs-1');
  assert.equal(result!.matchRate, 96);
  assert.equal(result!.whyMatches.length, 500);
  assert.equal(result!.skills.length, 6);
  assert.ok(result!.skills.every((s) => typeof s === 'string'));
});
