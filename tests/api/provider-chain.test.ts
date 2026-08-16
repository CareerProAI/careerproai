import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runProviderChain } from '../../server/ai/providerChain.js';

function stub(name, configured, impl) {
  return { name, isConfigured: () => configured, call: impl };
}

test('provider chain skips unconfigured providers and uses Gemini', async () => {
  const result = await runProviderChain('sys', 'user', {}, [
    stub('Groq', false, async () => { throw new Error('should not run'); }),
    stub('Gemini', true, async () => ({ matches: [{ id: 'j1', matchRate: 80 }] })),
    stub('DeepSeek', false, async () => { throw new Error('should not run'); }),
  ]);
  assert.equal(result.matches[0].matchRate, 80);
});

test('provider chain falls through Groq to Gemini then DeepSeek', async () => {
  const result = await runProviderChain('sys', 'user', {}, [
    stub('Groq', true, async () => { throw new Error('Groq API Error (429): cap'); }),
    stub('Gemini', true, async () => { throw new Error('Gemini API Error (502): busy'); }),
    stub('DeepSeek', true, async () => ({ ok: true })),
  ]);
  assert.equal(result.ok, true);
});

test('provider chain sets bothRateLimited when every attempt is 429', async () => {
  await assert.rejects(
    () => runProviderChain('sys', 'user', {}, [
      stub('Groq', true, async () => { throw new Error('Groq API Error (429): a'); }),
      stub('Gemini', true, async () => { throw new Error('Gemini API Error (429): b'); }),
    ]),
    (err: unknown) => err instanceof Error && (err as Error & { bothRateLimited?: boolean }).bothRateLimited === true,
  );
});
