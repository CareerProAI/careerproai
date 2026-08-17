import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAX_RESUME_BYTES, isAllowedResumeFile } from '../../server/upload/resumeFileFilter.js';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

test('DOCX is allowed by extension even with an empty MIME type', () => {
  assert.equal(isAllowedResumeFile({ originalname: 'CV.DOCX', mimetype: '' }), true);
});

test('DOCX is allowed by MIME when originalname has no extension', () => {
  assert.equal(isAllowedResumeFile({ originalname: 'document', mimetype: DOCX_MIME }), true);
});

test('JPEG is rejected', () => {
  assert.equal(isAllowedResumeFile({ originalname: 'photo.jpg', mimetype: 'image/jpeg' }), false);
});

test('resume cap is 5MB', () => {
  assert.equal(MAX_RESUME_BYTES, 5 * 1024 * 1024);
});
