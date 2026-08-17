import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAX_RESUME_BYTES, validateResumeFile } from '../../src/utils/validateResumeFile.ts';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

test('PDF and DOCX under 5MB are accepted', () => {
  assert.equal(validateResumeFile(new File(['ok'], 'cv.pdf', { type: 'application/pdf' })), null);
  assert.equal(validateResumeFile(new File(['ok'], 'cv.docx')), null);
});

test('DOCX is accepted by MIME when the filename has no extension', () => {
  assert.equal(validateResumeFile(new File(['ok'], 'document', { type: DOCX_MIME })), null);
});

test('exactly 5MB PDF is accepted; PDF one byte over is rejected', () => {
  assert.equal(
    validateResumeFile(new File([new Uint8Array(MAX_RESUME_BYTES)], 'cv.pdf', { type: 'application/pdf' })),
    null,
  );
  const oversizedPdf = new File([new Uint8Array(MAX_RESUME_BYTES + 1)], 'cv.pdf', { type: 'application/pdf' });
  assert.match(validateResumeFile(oversizedPdf) ?? '', /5MB/i);
});

test('DOCX one byte over 5MB is rejected', () => {
  const oversized = new File([new Uint8Array(MAX_RESUME_BYTES + 1)], 'cv.docx');
  assert.match(validateResumeFile(oversized) ?? '', /5MB/i);
});

test('unsupported types are rejected', () => {
  assert.match(validateResumeFile(new File(['x'], 'photo.jpg')) ?? '', /PDF|DOCX/i);
});
