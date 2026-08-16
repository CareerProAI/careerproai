import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateResumeFile } from '../../src/utils/validateResumeFile.ts';

test('PDF and DOCX under 5MB are accepted', () => {
  assert.equal(validateResumeFile(new File(['ok'], 'cv.pdf', { type: 'application/pdf' })), null);
  assert.equal(validateResumeFile(new File(['ok'], 'cv.docx')), null);
});

test('files over 5MB are rejected', () => {
  const oversized = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'cv.pdf');
  assert.match(validateResumeFile(oversized) ?? '', /5MB/i);
});

test('unsupported types are rejected', () => {
  assert.match(validateResumeFile(new File(['x'], 'photo.jpg')) ?? '', /PDF|DOCX/i);
});
