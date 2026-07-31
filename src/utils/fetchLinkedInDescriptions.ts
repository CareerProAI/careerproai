import { LinkedInJobListing } from '../types';
import { fetchLinkedInJobDescription } from '../api/linkedinJobs';

export interface LinkedInListingWithDescription extends LinkedInJobListing {
  description: string;
}

// Fetches every listing's full description up front (unlike the on-demand fetch used by
// the details modal) so LinkedIn jobs can be scored by the same match-batch call as
// bdjobs, instead of being permanently excluded from AI scoring. One listing's fetch
// failing just leaves its description empty (falls back to "not AI-scored" downstream,
// see mapLinkedInJobs.ts) rather than failing the whole batch — mirrors the
// Promise.allSettled resilience pattern already used for the two list-fetch calls.
export async function fetchLinkedInDescriptions(
  listings: LinkedInJobListing[],
  signal?: AbortSignal
): Promise<LinkedInListingWithDescription[]> {
  const results = await Promise.allSettled(
    listings.map((listing) => fetchLinkedInJobDescription(listing.listingUrl, signal))
  );
  return listings.map((listing, i) => {
    const result = results[i];
    return { ...listing, description: result.status === 'fulfilled' ? result.value : '' };
  });
}
