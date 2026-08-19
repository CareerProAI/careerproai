import React from 'react';
import { Job, ResumeProfile } from '../types';
import Modal from './ui/Modal';
import MatchMatrixSkillsBreakdown from './MatchMatrixSkillsBreakdown';
import MatchMatrixAlignment from './MatchMatrixAlignment';

interface MatchMatrixModalProps {
  compareJob: Job;
  currentProfile: ResumeProfile;
  onClose: () => void;
  dynamicAlignment: string;
  isAligning: boolean;
  alignmentError: string | null;
  onRetryAlignment: () => void;
  applied: boolean;
  onApplyJob: (job: Job) => void;
}

export default function MatchMatrixModal({
  compareJob,
  currentProfile,
  onClose,
  dynamicAlignment,
  isAligning,
  alignmentError,
  onRetryAlignment,
  applied,
  onApplyJob,
}: MatchMatrixModalProps) {
  return (
    <Modal onClose={onClose} labelledBy="match-matrix-title">
      <div className="flex justify-between items-center border-b border-outline-variant/40 pb-4 mb-4">
        <div>
          <h3 id="match-matrix-title" className="text-lg font-bold text-on-surface">Match Matrix Comparison</h3>
          <p className="text-xs text-on-surface-variant">Comparing with your CV and {compareJob.company}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
        >
          <span aria-hidden="true" className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="space-y-5">
        <div className="flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/20">
          <div>
            <h4 className="text-sm font-bold text-primary">{compareJob.title}</h4>
            <p className="text-xs text-on-surface-variant">{compareJob.company} • {compareJob.salary}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-primary">
              {compareJob.notAiScored ? 'N/A' : `${compareJob.matchRate}%`}
            </p>
            <p className="text-[10px] text-primary/70 font-bold uppercase tracking-wider">Predictive Fit</p>
          </div>
        </div>

        <MatchMatrixSkillsBreakdown compareJob={compareJob} currentProfile={currentProfile} />

        <MatchMatrixAlignment
          dynamicAlignment={dynamicAlignment}
          isAligning={isAligning}
          alignmentError={alignmentError}
          onRetry={onRetryAlignment}
        />
      </div>

      <div className="mt-6 pt-4 border-t border-outline-variant/40 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold text-on-surface-variant"
        >
          Close Matrix
        </button>
        <button
          disabled={applied}
          onClick={() => onApplyJob(compareJob)}
          className={`px-5 py-2 rounded-xl text-xs font-bold text-white ${
            applied ? 'bg-tertiary/20 text-tertiary cursor-default' : 'bg-primary hover:bg-primary/95'
          }`}
        >
          {applied ? 'Applied' : 'Apply Instantly'}
        </button>
      </div>
    </Modal>
  );
}
