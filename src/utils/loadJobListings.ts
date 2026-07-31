import { Job, ResumeProfile } from '../types';
import { fetchBdJobs, fetchLinkedInJobs, matchJobsBatch, MatchInputJob } from '../api';
import { mapBdJobListingToJob } from './mapBdJobs';
import { mapLinkedInJobListingToJob } from './mapLinkedInJobs';
import { buildMatchInput } from './buildMatchInput';
import { fetchLinkedInDescriptions } from './fetchLinkedInDescriptions';

// 50 is the max both /api/external-jobs (bdjobs, `rpp`) and /api/external-jobs/linkedin
// (`count`) accept per request — the most volume attainable without multi-page fetching.
const LISTINGS_PER_SOURCE = 50;
// Groq's free-tier models enforce a tight per-minute request cap that a short burst of normal
// usage (switching tabs, a retry click) can trip on its own — one silent automatic retry
// after a short wait clears most of these before the user ever sees a hard error.
const RATE_LIMIT_RETRY_DELAY_MS = 15000;

async function matchWithRateLimitRetry(profile: ResumeProfile, matchInput: MatchInputJob[], signal: AbortSignal) {
  try {
    return await matchJobsBatch(profile, matchInput, signal);
  } catch (err) {
    const status = err instanceof Error ? (err as Error & { status?: number }).status : undefined;
    if (status !== 429) throw err;
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_RETRY_DELAY_MS));
    return matchJobsBatch(profile, matchInput, signal);
  }
}

// Orchestrates a full job-listings load: fetch both sources (independently, so one
// rate-limiting doesn't blank the other), fetch full descriptions for every LinkedIn
// listing (needed for scoring — its list view has none), score everything in one
// combined match-batch call, then map both sources' results into displayable Jobs.
export async function loadJobListings(profile: ResumeProfile, keyword: string, signal: AbortSignal): Promise<Job[]> {
  const [bdResult, liResult] = await Promise.allSettled([
    fetchBdJobs(1, LISTINGS_PER_SOURCE, signal, keyword),
    fetchLinkedInJobs(keyword, '', LISTINGS_PER_SOURCE, signal),
  ]);
  const bdListings = bdResult.status === 'fulfilled' ? bdResult.value.data : [];
  const liListings = liResult.status === 'fulfilled' ? liResult.value.data : [];

  if (bdListings.length === 0 && liListings.length === 0) {
    throw new Error('Unable to load job listings from either source right now.');
  }

  const liWithDescriptions = await fetchLinkedInDescriptions(liListings, signal);
  const matchInput = buildMatchInput(bdListings, liWithDescriptions);

  // AI scoring failing entirely (both Groq and Gemini down, quota exhausted, etc.) must
  // not blank out listings that were already successfully fetched — an empty matchById
  // makes every listing fall through to its mapper's own "not AI-scored" fallback
  // (job.notAiScored / a 0% "Not AI-Scored" badge) instead of losing the whole feed.
  let matchById = new Map<string, Awaited<ReturnType<typeof matchWithRateLimitRetry>>[number]>();
  try {
    const matches = await matchWithRateLimitRetry(profile, matchInput, signal);
    matchById = new Map(matches.map((m) => [m.id, m]));
  } catch (err) {
    console.error('AI match scoring failed for the whole batch — showing unscored listings instead:', err);
  }

  const mappedBd = bdListings.map((l) => mapBdJobListingToJob(l, matchById.get(`bdjobs-${l.Jobid}`)));
  const mappedLi = liWithDescriptions.map((l) => mapLinkedInJobListingToJob(l, matchById.get(`linkedin-${l.jobId}`)));

  return [...mappedBd, ...mappedLi];
}
