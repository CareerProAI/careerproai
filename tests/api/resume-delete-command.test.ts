import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createResumeDeleteCommand,
  resumeDeleteDialogCopy,
} from '../../src/utils/resumeDeleteCommand.ts';

test('createResumeDeleteCommand returns null when there is nothing to delete', () => {
  assert.equal(createResumeDeleteCommand(null), null);
  assert.equal(createResumeDeleteCommand({ id: '', fileName: 'My CV.docx' }), null);
});

test('createResumeDeleteCommand captures id and fileName (Command)', () => {
  assert.deepEqual(
    createResumeDeleteCommand({ id: 'res-1', fileName: 'My CV.docx' }),
    { id: 'res-1', fileName: 'My CV.docx' },
  );
});

test('resumeDeleteDialogCopy never uses a native confirm string with a blank name', () => {
  const copy = resumeDeleteDialogCopy('My CV.docx');
  assert.equal(copy.title, 'Delete "My CV.docx"?');
  assert.match(copy.description, /cannot be undone/i);
  assert.equal(resumeDeleteDialogCopy('').title, 'Delete this resume?');
});
