// A05: with GROQ_API_KEY deliberately invalid and GEMINI_API_KEY valid, resume parsing
// must still succeed end-to-end via the Gemini fallback, and the server log must show the
// documented fallback message. Runs its own isolated server on a scratch port (see
// helpers/spawnServer.ts) so it never touches the user's already-running dev server.
import 'dotenv/config';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnIsolatedServer } from './helpers/spawnServer.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resumeTxt = path.join(__dirname, '../e2e/fixtures/sample-resume.txt');
const PORT = 3099;

test('A05: Groq failure falls back to Gemini and still parses the resume', async (t) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return t.skip('GEMINI_API_KEY not set — cannot exercise the fallback path');

  const server = await spawnIsolatedServer(PORT, {
    GROQ_API_KEY: 'invalid-test-key-forces-fallback',
    GEMINI_API_KEY: geminiKey,
  });

  let resumeId: string | undefined;
  try {
    const form = new FormData();
    form.append('file', new Blob([fs.readFileSync(resumeTxt)], { type: 'text/plain' }), 'sample-resume.txt');
    form.append('userId', 'user-default');

    const res = await fetch(`${server.baseUrl}/resumes/parse`, { method: 'POST', body: form });
    // Read the body exactly once — reusing it for both the failure message and the
    // resumeId avoids "Body is unusable: Body has already been read".
    const body = await res.json().catch(() => ({}));
    assert.equal(res.status, 200, `expected the Gemini fallback to succeed, got: ${JSON.stringify(body)}`);
    resumeId = body.resumeId;
    assert.ok(resumeId, 'a resumeId must be returned on success');

    assert.match(
      server.logs,
      /Groq call failed, falling back to Gemini/,
      'server log must show the documented fallback message'
    );
  } finally {
    if (resumeId) await fetch(`${server.baseUrl}/resumes/${resumeId}`, { method: 'DELETE' });
    server.stop();
  }
});
