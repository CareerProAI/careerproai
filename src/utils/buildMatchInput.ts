import { BdJobListing } from '../types';
import { MatchInputJob } from '../api/jobMatch';
import { LinkedInListingWithDescription } from './fetchLinkedInDescriptions';
import { stripHtmlToText } from './stripHtmlToText';
import { asText } from './asText';
import { mapListingsSafely } from './mapListingsSafely';

const MAX_FIELD_LENGTH = 600;
const truncate = (value: unknown) => stripHtmlToText(asText(value)).slice(0, MAX_FIELD_LENGTH);

export function buildMatchInput(
  bdListings: BdJobListing[] = [],
  linkedInListings: LinkedInListingWithDescription[] = []
): MatchInputJob[] {
  const bdInput = mapListingsSafely((bdListings || []).filter(Boolean), (l) => ({
    id: `bdjobs-${l.Jobid}`,
    title: asText(l.jobTitle),
    company: asText(l.companyName),
    location: asText(l.location),
    experience: asText(l.experience),
    education: truncate(l.eduRec),
    description: truncate(asText(l.jobContext) || asText(l.jobDescription)),
  }));

  const linkedInInput = mapListingsSafely(
    (linkedInListings || []).filter((l) => l && l.description),
    (l) => ({
      id: `linkedin-${l.jobId}`,
      title: asText(l.title),
      company: asText(l.company),
      location: asText(l.location),
      description: truncate(l.description),
    }),
  );

  return [...bdInput, ...linkedInInput];
}
