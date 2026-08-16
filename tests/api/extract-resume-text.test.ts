import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractResumeText } from '../../server/upload/extractResumeText.js';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), '../e2e/fixtures');

function multerFile(filename: string, mimetype: string) {
  return {
    originalname: filename,
    mimetype,
    buffer: fs.readFileSync(path.join(fixtures, filename)),
  };
}

test('PDF fixture extracts readable resume text', async () => {
  const text = await extractResumeText(multerFile('sample-resume.pdf', 'application/pdf'));
  assert.match(text, /Jordan Ellis/i);
});

test('DOCX fixture extracts readable resume text', async () => {
  const text = await extractResumeText(
    multerFile('sample-resume.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
  );
  assert.match(text, /Jordan Ellis/i);
});
