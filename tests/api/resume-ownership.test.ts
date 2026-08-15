// T19–T20: DELETE /api/resumes/:id requires the requesting userId to own the row.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiUrl, checkPrereqs } from './helpers/http.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resumeTxt = path.join(__dirname, '../e2e/fixtures/sample-resume.txt');

async function parseSampleResume() {
  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(resumeTxt)], { type: 'text/plain' }), 'sample-resume.txt');
  form.append('userId', 'user-default');
  const parseRes = await fetch(apiUrl('/resumes/parse'), { method: 'POST', body: form });
  const parseBody = await parseRes.json().catch(() => ({}));
  return { parseRes, parseBody };
}

test('T19: DELETE resume with the wrong userId returns 403', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));
  if (!prereqs.aiConfigured) return t.skip('No AI provider configured (GROQ_API_KEY/GEMINI_API_KEY)');

  const { parseRes, parseBody } = await parseSampleResume();
  assert.equal(parseRes.status, 200, `parse failed: ${JSON.stringify(parseBody)}`);
  const resumeId: string = parseBody.resumeId;

  try {
    const res = await fetch(apiUrl(`/resumes/${resumeId}?userId=wrong-user-xyz`), { method: 'DELETE' });
    const body = await res.json().catch(() => ({}));
    assert.equal(res.status, 403);
    assert.match(String(body.error), /forbidden/i);
  } finally {
    await fetch(apiUrl(`/resumes/${resumeId}?userId=user-default`), { method: 'DELETE' });
  }
});

test('T20: DELETE resume with the owning userId returns 200', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));
  if (!prereqs.aiConfigured) return t.skip('No AI provider configured (GROQ_API_KEY/GEMINI_API_KEY)');

  const { parseRes, parseBody } = await parseSampleResume();
  assert.equal(parseRes.status, 200, `parse failed: ${JSON.stringify(parseBody)}`);
  const resumeId: string = parseBody.resumeId;

  const deleteRes = await fetch(apiUrl(`/resumes/${resumeId}?userId=user-default`), { method: 'DELETE' });
  const deleteBody = await deleteRes.json().catch(() => ({}));
  assert.equal(deleteRes.status, 200);
  assert.equal(deleteBody.success, true);

  const getAfter = await fetch(apiUrl(`/resumes/${resumeId}`));
  assert.equal(getAfter.status, 404);
});
