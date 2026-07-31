// B07 (saved-jobs inline notes), implemented at the API layer rather than as a Playwright
// spec: SavedJobNotesCell.tsx / SavedJobTableRow.tsx / SavedJobsEmptyState.tsx exist in
// src/components/ but are never imported anywhere — there is no 'saved-jobs' entry in
// navMenuItems.ts and no matching case in ActiveViewRouter.tsx, so there is currently no
// reachable UI to drive for this case (same "defined but unused" status CLAUDE.md already
// documents for mockProfiles.ts). PATCH /api/saved-jobs/:id itself is real and working, so
// this test exercises the actual behavior test.md describes at the layer where it exists.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiUrl, checkPrereqs } from './helpers/http.ts';

test('B07: PATCH notes on a saved job updates only notes, not match data', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  const resumes = await fetch(apiUrl('/resumes?userId=user-default')).then((r) => r.json());
  if (resumes.length === 0) return t.skip('no resume profile exists to attach a saved job to');
  const resumeId = resumes[0].id;
  const matchId = `match-${resumeId}-bdjobs-b07-notes-test`;

  try {
    const saveRes = await fetch(apiUrl('/saved-jobs'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeId, jobId: 'bdjobs-b07-notes-test', matchRate: 77, whyMatches: 'original alignment text' }),
    });
    assert.equal(saveRes.status, 200);

    const patchRes = await fetch(apiUrl(`/saved-jobs/${matchId}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: 'Follow up next week' }),
    });
    assert.equal(patchRes.status, 200);

    const rows = await fetch(apiUrl(`/saved-jobs?resumeId=${resumeId}`)).then((r) => r.json());
    const row = rows.find((r: { id: string }) => r.id === matchId);
    assert.ok(row, 'the saved job row must still exist');
    assert.equal(row.notes, 'Follow up next week');
    assert.equal(row.match_rate, 77, 'notes PATCH must not reset match_rate');
    assert.equal(row.why_matches, 'original alignment text', 'notes PATCH must not reset why_matches');
    assert.ok(row.saved_at, 'notes PATCH must not clear saved_at');
  } finally {
    await fetch(apiUrl(`/saved-jobs/${matchId}`), { method: 'DELETE' });
  }
});
