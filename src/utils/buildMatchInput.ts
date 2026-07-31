import { BdJobListing } from '../types';
import { MatchInputJob } from '../api/jobMatch';
import { LinkedInListingWithDescription } from './fetchLinkedInDescriptions';

// Matches the server's own MAX_JOB_TEXT_FIELD_LENGTH (server.js) — anything beyond this
// gets thrown away there anyway before it reaches Groq, so sending more is wasted
// bandwidth. Truncating here also keeps the combined request (now up to ~100 listings
// across both sources, each carrying its own untruncated raw text) safely under
// Express's default JSON body-size limit — this exact request hit "PayloadTooLargeError:
// request entity too large" once LinkedIn's full descriptions were added on top of
// bdjobs's, which alone had stayed under it.
const MAX_FIELD_LENGTH = 600;
const truncate = (value: string) => value.slice(0, MAX_FIELD_LENGTH);

// Combines both sources into one source-agnostic match-batch input array. LinkedIn
// listings without a fetched description (the fetch failed, or returned nothing) are
// skipped — there's no signal for the AI to score against, so they stay "not AI-scored"
// downstream (see mapLinkedInJobs.ts) rather than getting sent in as an empty field.
export function buildMatchInput(
  bdListings: BdJobListing[],
  linkedInListings: LinkedInListingWithDescription[] = []
): MatchInputJob[] {
  const bdInput = bdListings.map((l) => ({
    id: `bdjobs-${l.Jobid}`,
    title: l.jobTitle,
    company: l.companyName,
    location: l.location,
    experience: l.experience,
    education: truncate(l.eduRec || ''),
    description: truncate(l.jobContext || l.jobDescription || ''),
  }));

  const linkedInInput = linkedInListings
    .filter((l) => l.description)
    .map((l) => ({
      id: `linkedin-${l.jobId}`,
      title: l.title,
      company: l.company,
      location: l.location,
      description: truncate(l.description),
    }));

  return [...bdInput, ...linkedInInput];
}
