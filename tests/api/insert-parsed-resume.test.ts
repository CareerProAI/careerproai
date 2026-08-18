// The parse route saves AI JSON as-is. Models often omit required keys (dates vs
// startDate) or return a string where an array is expected — sqlite3 then throws
// on undefined binds / NOT NULL, and the UI shows "Failed to save the parsed resume".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { wrapNodeSqlite } from '../../server/database/sqliteAdapter.js';
import { createSchema } from '../../server/database/schema/index.js';
import { insertParsedResume } from '../../server/resumeParsing/insertParsedResume.js';

const messyAiJson = {
  candidateName: 'Alex Rivera',
  currentRole: 'Engineer',
  contactInfo: { email: 'alex@example.com', phone: null },
  score: 80,
  atsCompatibility: 'Good ATS Compatibility',
  strengths: [{ title: 'Impact', description: 'Ships features' }],
  improvements: [{ title: 'Metrics', priority: 'Medium', description: 'Add numbers' }],
  experience: [{ role: 'Engineer', company: 'Acme', startDate: '2020', endDate: '2024', bullets: 'Built APIs' }],
  education: [{ degree: 'B.S. CS', institution: 'State University', year: '2019' }],
  skills: ['React', 'Node.js'],
  certifications: [{ name: 'AWS SAA', institution: 'Amazon', year: '2021' }],
  projects: [{ title: 'Queue Insights', description: null, technologies: 'Node' }],
  languages: 'English',
};

async function openMemoryDb() {
  const db = wrapNodeSqlite(new DatabaseSync(':memory:'));
  await db.exec('PRAGMA foreign_keys = ON');
  await createSchema(db);
  await db.run(
    'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
    'user-default',
    'Test User',
    'test@example.com',
  );
  return db;
}

test('messy AI JSON still saves a resume row', async () => {
  const db = await openMemoryDb();
  const resumeId = await insertParsedResume(db, {
    activeUserId: 'user-default',
    filename: 'alex.pdf',
    parsedData: messyAiJson,
  });
  const row = await db.get('SELECT candidate_name FROM resumes WHERE id = ?', resumeId);
  assert.equal(row.candidate_name, 'Alex Rivera');
  const exp = await db.get('SELECT dates FROM experience WHERE resume_id = ?', resumeId);
  assert.match(exp.dates, /2020/);
});

test('loadResumeProfile returns the saved PDF filename after insert', async () => {
  const db = await openMemoryDb();
  const resumeId = await insertParsedResume(db, {
    activeUserId: 'user-default',
    filename: 'My CV.pdf',
    parsedData: messyAiJson,
  });
  const { loadResumeProfile } = await import('../../server/resumeParsing/loadResumeProfile.js');
  const profile = await loadResumeProfile(db, resumeId);
  assert.equal(profile.fileName, 'My CV.pdf');
  assert.equal(profile.candidateName, 'Alex Rivera');
});
