import { BdJobListing, Job } from '../types';
import { JobMatchResult } from '../api/jobMatch';
import { stripHtmlToText } from './stripHtmlToText';
import { asText } from './asText';

function mapWorkplaceType(workPlace: unknown): Job['workplaceType'] {
  const w = asText(workPlace).toLowerCase();
  if (w.includes('home')) return 'Remote';
  if (w.includes('both') || w.includes('hybrid')) return 'Hybrid';
  return 'On-site';
}

function mapEmploymentType(jobType: unknown): Job['employmentType'] {
  const map: Record<string, Job['employmentType']> = {
    fulltime: 'Full-time',
    parttime: 'Part-time',
    contractual: 'Contract',
    internship: 'Internship',
  };
  return map[asText(jobType).toLowerCase().replace(/\s/g, '')] || 'Full-time';
}

function mapExperienceLevel(experience: unknown): Job['experienceLevel'] {
  const match = asText(experience).match(/\d+/);
  const years = match ? parseInt(match[0], 10) : 0;
  return years >= 3 ? 'Mid-Senior' : 'Entry';
}

function formatSalary(salary: BdJobListing['Salary'] | null | undefined): string {
  if (!salary || salary.HideSalary || salary.IsNegotiable || (salary.MinSalary === 0 && salary.MaxSalary === 0)) {
    return 'Negotiable';
  }
  if (salary.MaxSalary <= 0) {
    return `৳${Number(salary.MinSalary || 0).toLocaleString()}+`;
  }
  return `৳${Number(salary.MinSalary || 0).toLocaleString()} - ৳${Number(salary.MaxSalary).toLocaleString()}`;
}

export { stripHtmlToText };

export function formatPostedTime(publishDate: string): string {
  const then = new Date(publishDate).getTime();
  if (!Number.isFinite(then)) return 'Recently posted';
  const hours = Math.max(0, Math.floor((Date.now() - then) / 3600000));
  if (hours < 1) return 'Posted just now';
  if (hours < 24) return `Posted ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `Posted ${days} day${days === 1 ? '' : 's'} ago`;
}

const NOT_AI_SCORED_REASON = 'Not AI-scored — AI matching is temporarily unavailable, but this listing is real.';

function matchSkills(match?: JobMatchResult): string[] {
  return Array.isArray(match?.skills) ? match.skills.filter((s) => typeof s === 'string') : [];
}

export function mapBdJobListingToJob(listing: BdJobListing, match?: JobMatchResult): Job {
  const scored = Boolean(match);
  return {
    id: `bdjobs-${listing.Jobid}`,
    title: asText(listing.jobTitle),
    company: asText(listing.companyName),
    logo: asText(listing.logoUrl),
    location: asText(listing.location),
    workplaceType: mapWorkplaceType(listing.WorkPlace),
    experienceLevel: mapExperienceLevel(listing.experience),
    employmentType: mapEmploymentType(listing.JobType),
    salary: formatSalary(listing.Salary),
    skills: scored ? matchSkills(match) : [],
    matchRate: scored ? match!.matchRate : 0,
    postedTime: formatPostedTime(asText(listing.publishDate)),
    postedAt: asText(listing.publishDate),
    whyMatches: scored ? match!.whyMatches : NOT_AI_SCORED_REASON,
    source: 'bdjobs',
    description: stripHtmlToText(asText(listing.jobContext) || asText(listing.jobDescription)),
    notAiScored: !scored,
  };
}
