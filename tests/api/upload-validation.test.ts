// A01 (oversized upload rejected) + A02 (unsupported file type rejected). Both must be
// rejected before any AI call is made, so these tests need the server running but not an
// AI key — and neither should ever create a `resumes` row, which is asserted directly.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiUrl, checkPrereqs, countUserResumes } from './helpers/http.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(__dirname, '../e2e/fixtures');

async function uploadFixture(filename: string, mimeType: string) {
  const buffer = fs.readFileSync(path.join(fixtures, filename));
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mimeType }), filename);
  form.append('userId', 'user-default');
  return fetch(apiUrl('/resumes/parse'), { method: 'POST', body: form });
}

test('A01: file over the 5MB cap is rejected with 400, no resume row written', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const before = await countUserResumes();
  const sixMb = Buffer.alloc(6 * 1024 * 1024, 'x');
  const form = new FormData();
  form.append('file', new Blob([sixMb], { type: 'application/pdf' }), 'oversized.pdf');
  form.append('userId', 'user-default');
  const res = await fetch(apiUrl('/resumes/parse'), { method: 'POST', body: form });
  const after = await countUserResumes();
  const body = await res.json();

  assert.equal(res.status, 400);
  assert.match(body.error, /5MB/i);
  assert.equal(after, before, 'oversized upload must not create a resume row');
});

test('A02: unsupported file type is rejected with 400, no resume row written', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const before = await countUserResumes();
  const res = await uploadFixture('not-a-resume.jpg', 'image/jpeg');
  const after = await countUserResumes();
  const body = await res.json();

  assert.equal(res.status, 400);
  assert.match(body.error, /unsupported file type/i);
  assert.equal(after, before, 'unsupported-type upload must not create a resume row');
});
