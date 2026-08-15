// T16–T18: SavedJobs POST validates required fields; PATCH notes cap at 2,000 chars.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiUrl, checkPrereqs } from './helpers/http.ts';

test('T16: SavedJobs POST missing resumeId returns 400', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const res = await fetch(apiUrl('/saved-jobs'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId: 'j1', matchRate: 80 }),
  });
  const body = await res.json().catch(() => ({}));
  assert.equal(res.status, 400);
  assert.match(String(body.error), /resumeId/i);
});

test('T17: SavedJobs POST invalid matchRate returns 400', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const res = await fetch(apiUrl('/saved-jobs'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeId: 'r1', jobId: 'j1', matchRate: 999 }),
  });
  const body = await res.json().catch(() => ({}));
  assert.equal(res.status, 400);
  assert.match(String(body.error), /matchRate/i);
});

test('T18: SavedJobs notes PATCH truncates at 2000 chars', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const resumes = await fetch(apiUrl('/resumes?userId=user-default')).then((r) => r.json());
  if (resumes.length === 0) return t.skip('no resume profile exists to attach a saved job to');
  const resumeId = resumes[0].id;
  const jobId = 't18-notes-cap';
  const matchId = `match-${resumeId}-${jobId}`;

  try {
    const saveRes = await fetch(apiUrl('/saved-jobs'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeId, jobId, matchRate: 70 }),
    });
    assert.equal(saveRes.status, 200);

    const patchRes = await fetch(apiUrl(`/saved-jobs/${matchId}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: 'n'.repeat(3000) }),
    });
    assert.equal(patchRes.status, 200);

    const rows = await fetch(apiUrl(`/saved-jobs?resumeId=${resumeId}`)).then((r) => r.json());
    const row = rows.find((r: { id: string }) => r.id === matchId);
    assert.ok(row, 'saved job must exist after notes PATCH');
    assert.equal(row.notes.length, 2000);
  } finally {
    await fetch(apiUrl(`/saved-jobs/${matchId}`), { method: 'DELETE' });
  }
});
