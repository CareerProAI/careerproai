import React from 'react';
import { RECOMMENDED_MATCH_THRESHOLD } from '../hooks/useJobFilters';

interface NoRecommendedMatchesProps {
  className?: string;
}

export default function NoRecommendedMatches({ className = '' }: NoRecommendedMatchesProps) {
  return (
    <p className={`text-base font-bold text-error ${className}`.trim()}>
      No Job Matches {RECOMMENDED_MATCH_THRESHOLD}% or above
    </p>
  );
}
