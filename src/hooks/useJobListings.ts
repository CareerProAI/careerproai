import { useEffect, useRef, useState } from 'react';
import { Job, ResumeProfile } from '../types';
import { getSearchKeyword } from '../utils/getSearchKeyword';
import { loadJobListings } from '../utils/loadJobListings';

export function useJobListings(profile: ResumeProfile | null, aiConfigured: boolean | null) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const profileRef = useRef(profile);
  profileRef.current = profile;

  useEffect(() => {
    if (!profile || aiConfigured === null) return;

    if (aiConfigured === false) {
      setLoading(false);
      setError('AI provider is not configured — add a Groq API key in Settings to enable AI-matched job listings.');
      return;
    }

    let cancelled = false;
    // React StrictMode double-invokes this effect in dev (mount → cleanup → mount) —
    // without aborting the superseded fetches, that silently doubles real network calls
    // (and Groq quota usage) on every single page visit.
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const keyword = getSearchKeyword(profileRef.current!);
    loadJobListings(profileRef.current!, keyword, controller.signal)
      .then((loadedJobs) => {
        if (!cancelled) setJobs(loadedJobs);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load job listings.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [profile?.id, aiConfigured, retryToken]);

  return { jobs, jobsLoading: loading, jobsError: error, retryJobs: () => setRetryToken((t) => t + 1) };
}
