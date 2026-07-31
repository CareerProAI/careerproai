import { useEffect, useState } from 'react';
import { Job } from '../types';
import { fetchLinkedInJobDescription, fetchBdJobDescription } from '../api';

// Both sources fetch descriptions lazily when a job's initial list-fetch had none — only
// when details are actually opened, not upfront for every listing — mirroring
// useExperienceAlignment's pattern. A job that already has a description (the common
// bdjobs case) skips the fetch entirely; `job.id` is prefixed by source (bdjobs-<id> /
// linkedin-<id>), so the raw bdjobs id is recovered by stripping that known prefix.
function fetchDescriptionFor(job: Job): Promise<string> | null {
  if (job.source === 'linkedin' && job.sourceUrl) {
    return fetchLinkedInJobDescription(job.sourceUrl);
  }
  if (job.source === 'bdjobs') {
    return fetchBdJobDescription(job.id.replace(/^bdjobs-/, ''));
  }
  return null;
}

export function useJobDescription(job: Job) {
  const [description, setDescription] = useState(job.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (job.description) {
      setDescription(job.description);
      setError(null);
      return;
    }

    const fetchPromise = fetchDescriptionFor(job);
    if (!fetchPromise) {
      setDescription('');
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPromise
      .then((text) => {
        if (!cancelled) setDescription(text);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load description.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [job.id, job.source, job.sourceUrl, job.description]);

  return { description, loading, error };
}
