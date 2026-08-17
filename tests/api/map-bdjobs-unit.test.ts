import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BdJobListing } from '../../src/types/job.ts';
import { mapBdJobListingToJob } from '../../src/utils/mapBdJobs.ts';

function listing(overrides: Record<string, unknown> = {}): BdJobListing {
  return {
    Jobid: '1',
    jobTitle: 'Engineer',
    companyName: 'Acme',
    deadline: '',
    publishDate: '2026-08-17T00:00:00Z',
    experience: '2 years',
    eduRec: '',
    jobContext: null,
    jobDescription: '',
    location: 'Dhaka',
    logoUrl: '',
    JobType: 'FullTime',
    Vacancies: 1,
    Salary: { MinSalary: 0, MaxSalary: 0, IsNegotiable: true, HideSalary: false },
    WorkPlace: 'Work from office',
    ...overrides,
  } as BdJobListing;
}

test('known WorkPlace and JobType still map', () => {
  const job = mapBdJobListingToJob(listing({ WorkPlace: 'Work from home', JobType: 'PartTime' }));
  assert.equal(job.workplaceType, 'Remote');
  assert.equal(job.employmentType, 'Part-time');
});

test('null WorkPlace does not throw (bdjobs omits it on some listings)', () => {
  const job = mapBdJobListingToJob(listing({ WorkPlace: null }));
  assert.equal(job.workplaceType, 'On-site');
});

test('null JobType does not throw', () => {
  const job = mapBdJobListingToJob(listing({ JobType: null }));
  assert.equal(job.employmentType, 'Full-time');
});

test('null experience and Salary do not throw', () => {
  const job = mapBdJobListingToJob(listing({ experience: null, Salary: null }));
  assert.equal(job.experienceLevel, 'Entry');
  assert.equal(job.salary, 'Negotiable');
});

test('null title/company/location still map to strings', () => {
  const job = mapBdJobListingToJob(listing({ jobTitle: null, companyName: null, location: null }));
  assert.equal(job.title, '');
  assert.equal(job.company, '');
  assert.equal(job.location, '');
});

test('null match.skills becomes an empty array, not null', () => {
  const job = mapBdJobListingToJob(listing(), {
    id: 'bdjobs-1',
    matchRate: 80,
    whyMatches: 'fit',
    skills: null as unknown as string[],
  });
  assert.deepEqual(job.skills, []);
});
