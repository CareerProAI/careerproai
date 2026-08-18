import './upload/pdfJsDomPolyfill.js';
import express from 'express';
import dotenv from 'dotenv';
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
import { serveSpa } from './serveSpa.js';
import { logConfiguredAiChain } from './ai/providerChain.js';

dotenv.config();
logConfiguredAiChain();

let db;
let dbPromise;

export function ready() {
  if (!dbPromise) {
    dbPromise = initDb().then((database) => {
      db = database;
      console.log('Database initialized successfully.');
      return db;
    });
  }
  return dbPromise;
}

const getDb = () => db;

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  applySecurity(app);
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
  serveSpa(app);
  return app;
}
