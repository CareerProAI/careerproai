import express from 'express';
import dotenv from 'dotenv';
import { ensurePdfJsDomPolyfills } from './upload/pdfJsDomPolyfill.js';
import { initDb } from './database.js';
import { applySecurity, aiLimiter } from './middleware/applySecurity.js';
import { createUsersRouter, createConfigStatusRouter } from './routes/users.js';
import { createResumesRouter } from './routes/resumes.js';
import { createResumeParseRouter } from './routes/resumeParse.js';
import { createSavedJobsRouter } from './routes/savedJobs.js';
import { createBdjobsRouter, createBdjobsDescriptionRouter } from './routes/externalJobs/bdjobs.js';
import { createLinkedInRouter, createLinkedInDescriptionRouter } from './routes/externalJobs/linkedin.js';
import { createJobCompareRouter } from './routes/jobCompare.js';
import { createJobMatchBatchRouter } from './routes/jobMatchBatch.js';
import { createGenerateApplicationRouter } from './routes/generateApplication.js';

ensurePdfJsDomPolyfills();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
applySecurity(app);

let db;
initDb().then((database) => {
  db = database;
  console.log('Database initialized successfully.');
}).catch((err) => {
  console.error('Failed to initialize database:', err);
});
const getDb = () => db;

app.use('/api/config/status', createConfigStatusRouter());
app.use('/api/users', createUsersRouter(getDb));
app.use('/api/resumes/parse', aiLimiter, createResumeParseRouter(getDb));
app.use('/api/resumes', createResumesRouter(getDb));
app.use('/api/saved-jobs', createSavedJobsRouter(getDb));
app.use('/api/external-jobs/bdjobs/description', createBdjobsDescriptionRouter());
app.use('/api/external-jobs/linkedin/description', createLinkedInDescriptionRouter());
app.use('/api/external-jobs/linkedin', createLinkedInRouter());
app.use('/api/external-jobs', createBdjobsRouter());
app.use('/api/jobs/compare', aiLimiter, createJobCompareRouter());
app.use('/api/jobs/match-batch', aiLimiter, createJobMatchBatchRouter());
app.use('/api/jobs/generate-application', aiLimiter, createGenerateApplicationRouter());

app.listen(PORT, () => {
  console.log(`TalentAI Backend API server running on port ${PORT}`);
});
