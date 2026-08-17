import { BdJobListing, Job } from '../types';
import { JobMatchResult } from '../api/jobMatch';
import { stripHtmlToText } from './stripHtmlToText';

function mapWorkplaceType(workPlace: string | null | undefined): Job['workplaceType'] {
  const w = (workPlace ?? '').toLowerCase();
  if (w.includes('home')) return 'Remote';
  if (w.includes('both') || w.includes('hybrid')) return 'Hybrid';
  return 'On-site';
}

function mapEmploymentType(jobType: string | null | undefined): Job['employmentType'] {
  const map: Record<string, Job['employmentType']> = {
    fulltime: 'Full-time',
    parttime: 'Part-time',
    contractual: 'Contract',
    internship: 'Internship',
  };
  return map[(jobType ?? '').toLowerCase().replace(/\s/g, '')] || 'Full-time';
}

function mapExperienceLevel(experience: string | null | undefined): Job['experienceLevel'] {
  const match = (experience ?? '').match(/\d+/);
  const years = match ? parseInt(match[0], 10) : 0;
  return years >= 3 ? 'Mid-Senior' : 'Entry';
}

function formatSalary(salary: BdJobListing['Salary'] | null | undefined): string {
  if (!salary || salary.HideSalary || salary.IsNegotiable || (salary.MinSalary === 0 && salary.MaxSalary === 0)) {
    return 'Negotiable';
  }
  // bdjobs.com uses MaxSalary: -1 as a sentinel for "no upper bound" (open-ended range) —
  // e.g. "৳100,000+" listings — rather than a real value to range against MinSalary.
  if (salary.MaxSalary <= 0) {
    return `৳${salary.MinSalary.toLocaleString()}+`;
  }
  return `৳${salary.MinSalary.toLocaleString()} - ৳${salary.MaxSalary.toLocaleString()}`;
}

export { stripHtmlToText };

export function formatPostedTime(publishDate: string): string {
  const hours = Math.max(0, Math.floor((Date.now() - new Date(publishDate).getTime()) / 3600000));
  if (hours < 1) return 'Posted just now';
  if (hours < 24) return `Posted ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `Posted ${days} day${days === 1 ? '' : 's'} ago`;
}

// Fallback only for when the AI match-batch call couldn't score this listing at all —
// either the whole batch failed (e.g. both AI providers temporarily down) or this
// specific listing's id wasn't present in the response. `job.notAiScored` lets the UI
// show this honestly instead of a fake 0% match, mirroring mapLinkedInJobs.ts's own
// (differently-worded, since the failure reason differs) fallback for the same flag.
const NOT_AI_SCORED_REASON = 'Not AI-scored — AI matching is temporarily unavailable, but this listing is real.';

export function mapBdJobListingToJob(listing: BdJobListing, match?: JobMatchResult): Job {
  const scored = Boolean(match);
  return {
    id: `bdjobs-${listing.Jobid}`,
    title: listing.jobTitle,
    company: listing.companyName,
    logo: listing.logoUrl,
    location: listing.location,
    workplaceType: mapWorkplaceType(listing.WorkPlace),
    experienceLevel: mapExperienceLevel(listing.experience),
    employmentType: mapEmploymentType(listing.JobType),
    salary: formatSalary(listing.Salary),
    skills: scored ? match!.skills : [],
    matchRate: scored ? match!.matchRate : 0,
    postedTime: formatPostedTime(listing.publishDate),
    postedAt: listing.publishDate,
    whyMatches: scored ? match!.whyMatches : NOT_AI_SCORED_REASON,
    source: 'bdjobs',
    description: stripHtmlToText(listing.jobContext || listing.jobDescription || ''),
    notAiScored: !scored,
  };
}
