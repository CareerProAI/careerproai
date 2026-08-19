import { API_BASE, fetchOrThrow } from './client';
import { ResumeProfile, Job, CvExtract } from '../types';

export async function getExperienceAlignment(profile: ResumeProfile, job: Job): Promise<string> {
  const response = await fetchOrThrow(`${API_BASE}/jobs/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, job })
  }, 'Failed to load experience alignment.');
  const data = await response.json();
  return data.alignment;
}

export interface JobMatchResult {
  id: string;
  matchRate: number;
  whyMatches: string;
  skills: string[];
}

// Source-agnostic scoring input — callers map their own raw listing shape (bdjobs,
// LinkedIn, etc.) into this before calling matchJobsBatch. `id` must be unique across
// ALL jobs in a single call, even across sources — prefix it per-source if combining.
export interface MatchInputJob {
  id: string;
  title: string;
  company: string;
  location: string;
  experience?: string;
  education?: string;
  description?: string;
}

// Scores a whole page of externally-sourced listings against the resume in one
// Groq call (see POST /api/jobs/match-batch) rather than one call per job.
export async function matchJobsBatch(
  profile: ResumeProfile,
  jobs: MatchInputJob[],
  signal?: AbortSignal
): Promise<JobMatchResult[]> {
  // fetchOrThrow attaches `status` to the thrown error — loadJobListings.ts's
  // matchWithRateLimitRetry reads it to detect a 429 and retry once.
  const response = await fetchOrThrow(`${API_BASE}/jobs/match-batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, jobs }),
    signal
  }, 'Failed to compute AI match scores.');
  const data = await response.json();
  return data.matches || [];
}

export interface ApplicationPackage {
  resumeText: string;
  resumePdfBase64: string;
  coverLetterText: string;
  coverLetterPdfBase64: string;
}

// Generates a job-tailored resume + cover letter (see POST /api/jobs/generate-application)
// in one Groq call, rendered server-side as downloadable PDFs.
export async function generateApplicationPackage(profile: ResumeProfile, job: Job): Promise<ApplicationPackage> {
  const response = await fetchOrThrow(`${API_BASE}/jobs/generate-application`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, job })
  }, 'Failed to generate application materials.');
  return response.json();
}

// Generates a tailored resume + cover letter from a free-text job description
// (see POST /api/jobs/customise-resume). Accepts CvExtract (quick wizard upload)
// or the full ResumeProfile (use-existing shortcut) — server needs the same fields.
export async function customiseResume(profile: CvExtract | ResumeProfile, jobDescription: string): Promise<ApplicationPackage> {
  const response = await fetchOrThrow(`${API_BASE}/jobs/customise-resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, jobDescription })
  }, 'Failed to generate customised CV.');
  return response.json();
}
