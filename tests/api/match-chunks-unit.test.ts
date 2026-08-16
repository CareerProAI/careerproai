import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chunkArray } from '../../src/utils/chunkArray.ts';
import { stripHtmlToText } from '../../src/utils/stripHtmlToText.ts';
import { formatRelativeFromMs, formatProfileUpdated } from '../../src/utils/formatRelativeTime.ts';

test('chunkArray splits into windows of the given size', () => {
  assert.deepEqual(chunkArray([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  assert.deepEqual(chunkArray([], 10), []);
  assert.equal(chunkArray(Array.from({ length: 96 }, (_, i) => i), 10).length, 10);
});

test('stripHtmlToText drops complete and truncated tags', () => {
  const raw = 'MSc CSE <span style="color: rg';
  const plain = stripHtmlToText(raw);
  assert.equal(plain.includes('<'), false);
  assert.equal(plain.includes('span'), false);
  assert.match(plain, /MSc CSE/);
});

test('formatProfileUpdated reads res-<timestamp> as relative time', () => {
  const now = Date.now();
  assert.equal(formatRelativeFromMs(now, now), 'Just now');
  assert.equal(formatProfileUpdated(`res-${now - 120_000}`).includes('minute'), true);
});
