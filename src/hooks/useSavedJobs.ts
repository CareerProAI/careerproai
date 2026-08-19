import { useState, useEffect } from 'react';
import { fetchSavedJobs, saveJob, deleteSavedJob } from '../api';
import { SavedJobRecord, Job } from '../types';

export function useSavedJobs(currentProfileId: string | undefined, triggerToast: (msg: string) => void) {
  const [savedJobRecords, setSavedJobRecords] = useState<SavedJobRecord[]>([]);
  const savedJobIds = savedJobRecords.map((record) => record.job_id);

  // Saved jobs are scoped per CV (job_matches.resume_id) — reload whenever the
  // active CV changes.
  useEffect(() => {
    let cancelled = false;

    if (!currentProfileId) {
      setSavedJobRecords([]);
      return;
    }

    fetchSavedJobs(currentProfileId)
      .then((rows) => {
        if (!cancelled) setSavedJobRecords(rows);
      })
      .catch((err) => {
        console.error('Failed to load saved jobs:', err instanceof Error ? err.message : err);
      });

    return () => {
      cancelled = true;
    };
  }, [currentProfileId]);

  const onSaveJob = async (job: Job) => {
    if (!currentProfileId) {
      triggerToast('Select or upload a CV before saving jobs.');
      return;
    }
    const isSaved = savedJobIds.includes(job.id);
    try {
      if (isSaved) {
        await deleteSavedJob(`match-${currentProfileId}-${job.id}`);
        setSavedJobRecords((prev) => prev.filter((record) => record.job_id !== job.id));
        triggerToast(`Removed ${job.company} from saved listings`);
      } else {
        await saveJob(currentProfileId, job.id, job.matchRate, job.whyMatches, [], []);
        const rows = await fetchSavedJobs(currentProfileId);
        setSavedJobRecords(rows);
        triggerToast(`Saved ${job.company} job listing`);
      }
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Failed to update saved job.');
    }
  };

  return { savedJobIds, onSaveJob };
}
