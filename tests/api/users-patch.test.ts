// A04: PATCH /api/users/:id must touch only the columns it was sent (regression guard
// against the INSERT OR REPLACE pattern this endpoint deliberately avoids), and must
// reject a duplicate email with 409 without modifying anything. No AI/network needed.
// There is no DELETE /api/users/:id endpoint, so cleanup uses direct DB access
// (helpers/db.ts) — assertions themselves still go entirely through the real HTTP API.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiUrl, checkPrereqs } from './helpers/http.ts';
import { deleteUsersByIdPrefix } from './helpers/db.ts';

const RUN_ID = Date.now();
const PREFIX = 'test-a04-';
const userA = { id: `${PREFIX}a-${RUN_ID}`, name: 'Test User A', email: `a04-a-${RUN_ID}@example.com` };
const userB = { id: `${PREFIX}b-${RUN_ID}`, name: 'Test User B', email: `a04-b-${RUN_ID}@example.com` };

async function createUser(user: typeof userA) {
  const res = await fetch(apiUrl('/users'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  assert.equal(res.status, 200);
}

async function getUser(id: string) {
  const users = await fetch(apiUrl('/users')).then((r) => r.json());
  return users.find((u: { id: string }) => u.id === id);
}

test('A04: targeted PATCH updates only the sent column; duplicate-email PATCH is rejected with 409', async (t) => {
  const prereqs = await checkPrereqs();
  if (!prereqs.reachable) return t.skip('API server not reachable at ' + apiUrl(''));

  try {
    await createUser(userA);
    await createUser(userB);

    const patchPrefs = await fetch(apiUrl(`/users/${userA.id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notifyJobMatches: false }),
    });
    assert.equal(patchPrefs.status, 200);

    const afterPrefs = await getUser(userA.id);
    assert.equal(afterPrefs.name, userA.name, 'name must be untouched by an unrelated PATCH');
    assert.equal(afterPrefs.email, userA.email, 'email must be untouched by an unrelated PATCH');
    assert.equal(afterPrefs.notify_job_matches, 0, 'the targeted field must actually change');

    const patchDupEmail = await fetch(apiUrl(`/users/${userA.id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userB.email }),
    });
    assert.equal(patchDupEmail.status, 409);

    const afterDupAttempt = await getUser(userA.id);
    assert.equal(afterDupAttempt.email, userA.email, 'rejected PATCH must not modify the email');
  } finally {
    await deleteUsersByIdPrefix(PREFIX);
  }
});
