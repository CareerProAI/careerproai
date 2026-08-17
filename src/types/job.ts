export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  experienceLevel: 'Entry' | 'Mid-Senior';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary: string;
  skills: string[];
  matchRate: number;
  postedTime: string;
  postedAt: string;
  whyMatches: string;
  // Optional (not set by mockJobs.ts's dead-code entries) — always set by the two
  // external-job mappers, used by JobFeedList to split the feed into two columns.
  source?: 'bdjobs' | 'linkedin';
  // Plain-text (never raw HTML — external content is never rendered via
  // dangerouslySetInnerHTML). Populated immediately for bdjobs (already fetched in the
  // list call); empty for LinkedIn until fetched on-demand via useJobDescription, since
  // LinkedIn's list view exposes no description at all.
  description?: string;
  // Original listing URL on the source site. Only LinkedIn has a real one — no reliable
  // public per-job URL was found for bdjobs.com's listings.
  sourceUrl?: string;
  // Explicit "no real AI score" signal — needed because matchRate alone is ambiguous
  // once LinkedIn listings can also be genuinely scored (a real 0% is possible),
  // unlike the old always-0-for-LinkedIn sentinel this replaces.
  notAiScored?: boolean;
}

// Raw row shape returned by GET /api/saved-jobs (SELECT * FROM job_matches) —
// intentionally snake_case to match the actual wire format; this endpoint
// does no camelCase reassembly server-side, unlike /api/resumes/:id.
export interface SavedJobRecord {
  id: string;
  resume_id: string;
  job_id: string;
  match_rate: number;
  why_matches: string;
  missing_skills: string;
  resume_improvements: string;
  saved_at: string;
  notes: string | null;
}

// Raw shape of a single listing from Bdjobs.com's public job-search API
// (proxied via GET /api/external-jobs) — left as-is rather than reassembled,
// same precedent as SavedJobRecord: it's not our wire format to redefine.
export interface BdJobListing {
  Jobid: string;
  jobTitle: string;
  companyName: string;
  deadline: string;
  publishDate: string;
  experience: string | null;
  eduRec: string;
  jobContext: string | null;
  jobDescription: string;
  location: string;
  logoUrl: string;
  JobType: string | null;
  Vacancies: number;
  Salary: {
    MinSalary: number;
    MaxSalary: number;
    IsNegotiable: boolean;
    HideSalary: boolean;
  } | null;
  WorkPlace: string | null;
}

export interface BdJobSearchResponse {
  message: string;
  statuscode: string;
  data: BdJobListing[];
}

// Already-normalized shape from GET /api/external-jobs/linkedin — unlike BdJobListing,
// there's no "raw upstream JSON" to preserve here since the server parses LinkedIn's
// server-rendered HTML (its public "guest" job-search page) into this shape itself.
// Notably thinner than BdJobListing: LinkedIn's guest list view exposes no salary,
// employment type, experience level, or description text — only these fields.
export interface LinkedInJobListing {
  jobId: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  listingUrl: string;
  logoUrl: string;
}

export interface LinkedInJobSearchResponse {
  data: LinkedInJobListing[];
}
