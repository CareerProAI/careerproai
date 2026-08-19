import { useRef, useState } from 'react';
import { generateApplicationPackage, ApplicationPackage } from '../api';
import { Job, ResumeProfile } from '../types';
import { isProfileReadyForApplication } from '../utils/isProfileReadyForApplication';

// Keyed by profile id too, not just job id — the same job (bdjobs/LinkedIn ids are global,
// not profile-scoped) can appear in more than one resume profile's listings, and a package
// generated for one profile must never be shown as if it were tailored to another.
function cacheKey(profileId: string, jobId: string): string {
  return `${profileId}:${jobId}`;
}

export function useApplicationPackage(currentProfile: ResumeProfile | null) {
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const cacheRef = useRef(new Map<string, ApplicationPackage>());
  const [, setCacheVersion] = useState(0);

  const generate = async (profile: ResumeProfile, job: Job) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateApplicationPackage(profile, job);
      cacheRef.current.set(cacheKey(profile.id, job.id), result);
      setCacheVersion((v) => v + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate application materials.');
    } finally {
      setLoading(false);
    }
  };

  const openFor = (job: Job) => {
    setActiveJob(job);
    setError(null);
    if (!isProfileReadyForApplication(currentProfile)) {
      setProfileIncomplete(true);
      return;
    }
    setProfileIncomplete(false);
    if (cacheRef.current.has(cacheKey(currentProfile.id, job.id))) return;
    generate(currentProfile, job);
  };

  const retry = () => {
    if (activeJob && isProfileReadyForApplication(currentProfile)) generate(currentProfile, activeJob);
  };

  const close = () => setActiveJob(null);

  const data =
    activeJob && isProfileReadyForApplication(currentProfile)
      ? cacheRef.current.get(cacheKey(currentProfile.id, activeJob.id)) || null
      : null;

  return { activeJob, data, loading, error, profileIncomplete, openFor, retry, close };
}
