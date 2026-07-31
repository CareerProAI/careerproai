import express from 'express';
import dotenv from 'dotenv';
import { initDb } from './database.js';
import { createUsersRouter, createConfigStatusRouter } from './routes/users.js';
import { createResumesRouter } from './routes/resumes.js';
import { createResumeParseRouter } from './routes/resumeParse.js';
import { createSavedJobsRouter } from './routes/savedJobs.js';
import { createBdjobsRouter, createBdjobsDescriptionRouter } from './routes/externalJobs/bdjobs.js';
import { createLinkedInRouter, createLinkedInDescriptionRouter } from './routes/externalJobs/linkedin.js';
import { createJobCompareRouter } from './routes/jobCompare.js';
import { createJobMatchBatchRouter } from './routes/jobMatchBatch.js';
import { createGenerateApplicationRouter } from './routes/generateApplication.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());

// Enable CORS so the Vite app on port 3000 can call the API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize database. `db` is assigned asynchronously here but routes are mounted
// synchronously below (same timing as before this file was split) — each route reads
// the current value via getDb() only once a real request arrives, by which point
// initDb() has long since resolved in practice.
let db;
initDb().then((database) => {
  db = database;
  console.log('Database initialized successfully.');
}).catch((err) => {
  console.error('Failed to initialize database:', err);
});
const getDb = () => db;

/* ==================== API ROUTES ==================== */

app.use('/api/config/status', createConfigStatusRouter());
app.use('/api/users', createUsersRouter(getDb));

app.use('/api/resumes/parse', createResumeParseRouter(getDb));
app.use('/api/resumes', createResumesRouter(getDb));

app.use('/api/saved-jobs', createSavedJobsRouter(getDb));

app.use('/api/external-jobs/bdjobs/description', createBdjobsDescriptionRouter());
app.use('/api/external-jobs/linkedin/description', createLinkedInDescriptionRouter());
app.use('/api/external-jobs/linkedin', createLinkedInRouter());
app.use('/api/external-jobs', createBdjobsRouter());

app.use('/api/jobs/compare', createJobCompareRouter());
app.use('/api/jobs/match-batch', createJobMatchBatchRouter());
app.use('/api/jobs/generate-application', createGenerateApplicationRouter());

// Start Express server
app.listen(PORT, () => {
  console.log(`TalentAI Backend API server running on port ${PORT}`);
});
