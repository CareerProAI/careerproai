import { Job } from '../types';

// Adapter: free-form Customized CV fields → the Job shape generateApplicationPackage expects.
export function buildCustomJob(input: { title: string; company: string; description: string }): Job {
  const title = input.title.trim() || 'Target Role';
  const company = input.company.trim() || 'Target Company';
  return {
    id: `custom-${title}-${company}`.replace(/\s+/g, '-').toLowerCase(),
    title,
    company,
    logo: '',
    location: '',
    workplaceType: 'On-site',
    experienceLevel: 'Mid-Senior',
    employmentType: 'Full-time',
    salary: '',
    skills: [],
    matchRate: 0,
    postedTime: '',
    postedAt: new Date().toISOString(),
    whyMatches: '',
    description: input.description.trim(),
  };
}
