// A03: deleting a resume must cascade to every child table, including job_matches.
// Needs a real AI parse (to populate the child tables). Everything from the parse call
// onward is wrapped in one try/finally so a crash mid-test can never leave the created
// resume orphaned in the user's real talentai.db.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiUrl, checkPrereqs } from './helpers/http.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resumeTxt = path.join(__dirname, '../e2e/fixtures/sample-resume.txt');

test('A03: resume delete cascades — resume and its saved jobs are both gone', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));
  if (!prereqs.aiConfigured) return t.skip('No AI provider configured (GROQ_API_KEY/GEMINI_API_KEY)');

  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(resumeTxt)], { type: 'text/plain' }), 'sample-resume.txt');
  form.append('userId', 'user-default');

  const parseRes = await fetch(apiUrl('/resumes/parse'), { method: 'POST', body: form });
  // Read the body exactly once — reusing it for both the failure message and the
  // resumeId avoids "Body is unusable: Body has already been read".
  const parseBody = await parseRes.json().catch(() => ({}));
  assert.equal(parseRes.status, 200, `parse failed: ${JSON.stringify(parseBody)}`);
  const resumeId: string = parseBody.resumeId;

  try {
    const saveRes = await fetch(apiUrl('/saved-jobs'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeId, jobId: 'bdjobs-a03-cascade-test', matchRate: 80, whyMatches: 'x' }),
    });
    assert.equal(saveRes.status, 200);

    const savedBefore = await fetch(apiUrl(`/saved-jobs?resumeId=${resumeId}`)).then((r) => r.json());
    assert.equal(savedBefore.length, 1, 'sanity check: the saved job exists before delete');
  } finally {
    const deleteRes = await fetch(apiUrl(`/resumes/${resumeId}`), { method: 'DELETE' });
    assert.equal(deleteRes.status, 200);
  }

  const getAfter = await fetch(apiUrl(`/resumes/${resumeId}`));
  assert.equal(getAfter.status, 404, 'resume row must be gone after delete');

  const savedAfter = await fetch(apiUrl(`/saved-jobs?resumeId=${resumeId}`)).then((r) => r.json());
  assert.equal(savedAfter.length, 0, 'job_matches rows must cascade-delete with the resume');
});
