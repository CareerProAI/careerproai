import { Application } from '../types';

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-vercel',
    title: 'Senior Frontend Developer',
    company: 'Vercel',
    location: 'Remote',
    appliedDate: 'Today, 10:30 AM',
    appliedAt: '2026-07-19T10:30:00.000Z',
    status: 'Applied',
    notes: 'Submitted CV v2. Feeling highly confident about the match rate!'
  },
  {
    id: 'app-2',
    jobId: 'job-stripe',
    title: 'Machine Learning Lead',
    company: 'Stripe',
    location: 'Remote',
    appliedDate: 'Yesterday',
    appliedAt: '2026-07-18T14:00:00.000Z',
    status: 'Screening',
    notes: 'Recruiter reached out for initial chat.'
  },
  {
    id: 'app-3',
    jobId: 'job-stark',
    title: 'Senior Frontend Engineer',
    company: 'Stark Industries',
    location: 'San Francisco, CA',
    appliedDate: 'Oct 24',
    appliedAt: '2025-10-24T09:00:00.000Z',
    status: 'Interviewing',
    notes: 'Technical rounds scheduled for next Tuesday.'
  }
];
