import { useState, useEffect } from 'react';
import { getExperienceAlignment } from '../api';
import { Job, ResumeProfile } from '../types';

export function useExperienceAlignment(compareJob: Job | null, currentProfile: ResumeProfile) {
  const [dynamicAlignment, setDynamicAlignment] = useState('');
  const [isAligning, setIsAligning] = useState(false);
  const [alignmentError, setAlignmentError] = useState<string | null>(null);

  const loadAlignment = async (job: Job, profile: ResumeProfile) => {
    setIsAligning(true);
    setAlignmentError(null);
    try {
      const text = await getExperienceAlignment(profile, job);
      setDynamicAlignment(text);
    } catch (err) {
      setAlignmentError(err instanceof Error ? err.message : 'Failed to load experience alignment.');
    } finally {
      setIsAligning(false);
    }
  };

  useEffect(() => {
    if (!compareJob) {
      setDynamicAlignment('');
      setAlignmentError(null);
      return;
    }
    loadAlignment(compareJob, currentProfile);
  }, [compareJob, currentProfile]);

  const retry = () => {
    if (compareJob) loadAlignment(compareJob, currentProfile);
  };

  return { dynamicAlignment, isAligning, alignmentError, retry };
}
