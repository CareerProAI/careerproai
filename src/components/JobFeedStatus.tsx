import React from 'react';
import RetryableError from './RetryableError';

interface JobFeedStatusProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function JobFeedStatus({ loading, error, onRetry }: JobFeedStatusProps) {
  if (error) return <RetryableError message={error} onRetry={onRetry} />;

  return (
    <div className="glass-card rounded-2xl p-12 text-center border border-outline-variant/60">
      <p className="text-sm text-on-surface-variant">
        {loading ? 'Fetching live listings from Bdjobs.com and scoring them against your CV…' : ''}
      </p>
    </div>
  );
}
