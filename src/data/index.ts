// Barrel re-export so existing `from '../data'` / `from './data'` imports
// across the codebase keep resolving unchanged after this file was split by
// domain into mockProfiles.ts / mockJobs.ts / mockApplications.ts / mockActivities.ts.
export * from './mockProfiles';
export * from './mockJobs';
export * from './mockApplications';
export * from './mockActivities';
