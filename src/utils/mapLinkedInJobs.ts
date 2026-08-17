import { Job } from '../types';
import { JobMatchResult } from '../api/jobMatch';
import { LinkedInListingWithDescription } from './fetchLinkedInDescriptions';
import { formatPostedTime } from './mapBdJobs';
import { asText } from './asText';

// LinkedIn's public "guest" job-search view exposes no workplace type, employment
// type, experience level, or salary per listing — these three fields are best-guess
// defaults (the most common case on LinkedIn), NOT scraped facts. Don't treat them as
// verified; if LinkedIn ever exposes this data (e.g. via the per-job detail page),
// replace these constants with a real per-listing mapping.
const DEFAULT_WORKPLACE_TYPE: Job['workplaceType'] = 'On-site';
const DEFAULT_EMPLOYMENT_TYPE: Job['employmentType'] = 'Full-time';
const DEFAULT_EXPERIENCE_LEVEL: Job['experienceLevel'] = 'Mid-Senior';

// Fallback only for the listings whose description fetch failed or returned nothing
// (see fetchLinkedInDescriptions.ts) — those never reach buildMatchInput, so there's no
// real match to report. `job.notAiScored` lets the UI show this honestly instead of a
// fake 0% match.
const NOT_AI_SCORED_REASON =
  "Not AI-scored — a full job description couldn't be loaded for our AI to evaluate.";

export function mapLinkedInJobListingToJob(listing: LinkedInListingWithDescription, match?: JobMatchResult): Job {
  const scored = Boolean(match);
  return {
    id: `linkedin-${listing.jobId}`,
    title: asText(listing.title),
    company: asText(listing.company),
    logo: asText(listing.logoUrl),
    location: asText(listing.location),
    workplaceType: DEFAULT_WORKPLACE_TYPE,
    experienceLevel: DEFAULT_EXPERIENCE_LEVEL,
    employmentType: DEFAULT_EMPLOYMENT_TYPE,
    salary: 'Not disclosed',
    skills: scored && Array.isArray(match?.skills) ? match.skills.filter((s) => typeof s === 'string') : [],
    matchRate: scored ? match!.matchRate : 0,
    postedTime: listing.postedDate ? formatPostedTime(listing.postedDate) : 'Recently posted',
    postedAt: listing.postedDate || new Date().toISOString(),
    whyMatches: scored ? match!.whyMatches : NOT_AI_SCORED_REASON,
    source: 'linkedin',
    sourceUrl: listing.listingUrl,
    description: listing.description || undefined,
    notAiScored: !scored,
  };
}
