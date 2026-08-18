import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timedFetch } from '../../server/ai/timedFetch.js';

test('timedFetch aborts a hung provider before Vercel maxDuration', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (_url, init) => new Promise((_resolve, reject) => {
    init.signal.addEventListener('abort', () => {
      const err = new Error('This operation was aborted');
      err.name = 'AbortError';
      reject(err);
    });
  });
  try {
    const started = Date.now();
    await assert.rejects(() => timedFetch('https://example.invalid/ai', {}, 30), {
      message: /timed out after 30ms/i,
    });
    assert.ok(Date.now() - started < 1000);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
