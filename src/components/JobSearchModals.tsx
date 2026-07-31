import React from 'react';
import { Job, ResumeProfile } from '../types';
import MatchMatrixModal from './MatchMatrixModal';
import JobDetailsModal from './JobDetailsModal';

interface AlignmentState {
  dynamicAlignment: string;
  isAligning: boolean;
  alignmentError: string | null;
  retry: () => void;
}

interface JobSearchModalsProps {
  compareJob: Job | null;
  detailsJob: Job | null;
  currentProfile: ResumeProfile;
  alignment: AlignmentState;
  savedJobIds: string[];
  isApplied: (jobId: string) => boolean;
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  onCloseCompare: () => void;
  onCloseDetails: () => void;
}

export default function JobSearchModals({
  compareJob,
  detailsJob,
  currentProfile,
  alignment,
  savedJobIds,
  isApplied,
  onApplyJob,
  onSaveJob,
  onCloseCompare,
  onCloseDetails,
}: JobSearchModalsProps) {
  return (
    <>
      {compareJob && (
        <MatchMatrixModal
          compareJob={compareJob}
          currentProfile={currentProfile}
          onClose={onCloseCompare}
          dynamicAlignment={alignment.dynamicAlignment}
          isAligning={alignment.isAligning}
          alignmentError={alignment.alignmentError}
          onRetryAlignment={alignment.retry}
          applied={isApplied(compareJob.id)}
          onApplyJob={(job) => {
            onApplyJob(job);
            onCloseCompare();
          }}
        />
      )}

      {detailsJob && (
        <JobDetailsModal
          job={detailsJob}
          isSaved={savedJobIds.includes(detailsJob.id)}
          applied={isApplied(detailsJob.id)}
          onClose={onCloseDetails}
          onSaveJob={onSaveJob}
          onApplyJob={onApplyJob}
        />
      )}
    </>
  );
}
