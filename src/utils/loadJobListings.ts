import { Job, ResumeProfile } from '../types';
import { fetchBdJobs, fetchLinkedInJobs } from '../api';
import { mapBdJobListingToJob } from './mapBdJobs';
import { mapLinkedInJobListingToJob } from './mapLinkedInJobs';
import { buildMatchInput } from './buildMatchInput';
import { fetchLinkedInDescriptions } from './fetchLinkedInDescriptions';
import { matchJobsInChunks } from './matchJobsInChunks';
import { mapListingsSafely } from './mapListingsSafely';

// 50 is the max both /api/external-jobs (bdjobs, `rpp`) and /api/external-jobs/linkedin
// (`count`) accept per request — the most volume attainable without multi-page fetching.
const LISTINGS_PER_SOURCE = 50;

// Orchestrates a full job-listings load: fetch both sources (independently, so one
// rate-limiting doesn't blank the other), fetch full descriptions for every LinkedIn
// listing (needed for scoring — its list view has none), score in small match-batch
// chunks (Groq output cap), then map both sources' results into displayable Jobs.
export async function loadJobListings(profile: ResumeProfile, keyword: string, signal: AbortSignal): Promise<Job[]> {
  const [bdResult, liResult] = await Promise.allSettled([
    fetchBdJobs(1, LISTINGS_PER_SOURCE, signal, keyword),
    fetchLinkedInJobs(keyword, '', LISTINGS_PER_SOURCE, signal),
  ]);
  const bdListings = bdResult.status === 'fulfilled' ? (bdResult.value.data ?? []) : [];
  const liListings = liResult.status === 'fulfilled' ? (liResult.value.data ?? []) : [];

  if (bdListings.length === 0 && liListings.length === 0) {
    throw new Error('Unable to load job listings from either source right now.');
  }

  const liWithDescriptions = await fetchLinkedInDescriptions(liListings.filter(Boolean), signal);
  let matchInput = [];
  try {
    matchInput = buildMatchInput(bdListings, liWithDescriptions);
  } catch (err) {
    console.error('Failed to build match input — continuing without AI scores:', err);
  }

  const matches = await matchJobsInChunks(profile, matchInput, signal);
  const matchById = new Map(matches.map((m) => [m.id, m]));

  const mappedBd = mapListingsSafely(bdListings.filter(Boolean), (l) => (
    mapBdJobListingToJob(l, matchById.get(`bdjobs-${l.Jobid}`))
  ));
  const mappedLi = mapListingsSafely(liWithDescriptions, (l) => (
    mapLinkedInJobListingToJob(l, matchById.get(`linkedin-${l.jobId}`))
  ));

  return [...mappedBd, ...mappedLi];
}
