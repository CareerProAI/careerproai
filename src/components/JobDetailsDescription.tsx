import React from 'react';
import { Job } from '../types';
import { useJobDescription } from '../hooks/useJobDescription';

interface JobDetailsDescriptionProps {
  job: Job;
}

export default function JobDetailsDescription({ job }: JobDetailsDescriptionProps) {
  const { description, loading, error } = useJobDescription(job);

  return (
    <div>
      <h4 className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Job Description</h4>
      {loading ? (
        <p className="text-xs text-on-surface-variant italic">Loading full description…</p>
      ) : error ? (
        <p className="text-xs text-error">{error}</p>
      ) : description ? (
        <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap">{description}</p>
      ) : (
        <p className="text-xs text-on-surface-variant italic">No description available.</p>
      )}
    </div>
  );
}
