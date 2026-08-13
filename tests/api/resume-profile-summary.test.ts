// Match-batch must score against the uploaded resume, not a name+role stub.
// This asserts the summary actually carries education, projects, and skill lists
// from the parsed ResumeProfile shape so a later prompt trim can't silently drop them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildResumeProfileSummary } from '../../server/ai/buildResumeProfileSummary.js';

const PARSED_UPLOAD = {
  candidateName: 'Md Shakil',
  currentRole: 'Data Scientist',
  gapAnalysis: { targetRole: 'Senior Data Scientist', missingSkills: ['Spark'] },
  skills: {
    frameworks: ['PyTorch', 'scikit-learn'],
    tools: ['Python', 'SQL'],
    softSkills: ['Communication'],
  },
  experience: [
    { role: 'Data Scientist', company: 'ACI', dates: '2023 - Present', bullets: ['Built churn models', 'Led A/B tests'] },
  ],
  education: [{ degree: 'BSc Computer Science', institution: 'MSU', graduationYear: '2022' }],
  certifications: [{ name: 'AWS ML Specialty', institution: 'Amazon', year: '2024' }],
  projects: [{ title: 'Resume Parser', description: 'NLP pipeline for CVs', technologies: ['spaCy'] }],
  languages: [{ name: 'English', proficiency: 'Fluent' }],
};

test('resume profile summary includes uploaded resume sections used for job scoring', () => {
  const summary = buildResumeProfileSummary(PARSED_UPLOAD);
  assert.match(summary, /Md Shakil/);
  assert.match(summary, /Data Scientist/);
  assert.match(summary, /PyTorch/);
  assert.match(summary, /Python/);
  assert.match(summary, /Communication/);
  assert.match(summary, /ACI/);
  assert.match(summary, /BSc Computer Science/);
  assert.match(summary, /AWS ML Specialty/);
  assert.match(summary, /Resume Parser/);
  assert.match(summary, /spaCy/);
  assert.match(summary, /English/);
  assert.match(summary, /Senior Data Scientist/);
});
