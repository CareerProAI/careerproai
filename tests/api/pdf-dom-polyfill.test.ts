import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ensurePdfJsDomPolyfills } from '../../server/upload/pdfJsDomPolyfill.js';

test('pdf.js DOM polyfills define DOMMatrix when the canvas native is missing', () => {
  const previous = globalThis.DOMMatrix;
  try {
    delete globalThis.DOMMatrix;
    ensurePdfJsDomPolyfills();
    assert.equal(typeof globalThis.DOMMatrix, 'function');
    assert.ok(new globalThis.DOMMatrix());
  } finally {
    if (previous) globalThis.DOMMatrix = previous;
  }
});

test('loading extractResumeText does not import pdf-parse at module evaluation', async () => {
  const previous = globalThis.DOMMatrix;
  try {
    delete globalThis.DOMMatrix;
    await assert.doesNotReject(() => import('../../server/upload/extractResumeText.js'));
  } finally {
    if (previous) globalThis.DOMMatrix = previous;
  }
});
