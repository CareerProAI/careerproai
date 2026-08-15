import React from 'react';
import { ResumeProfile } from '../types';
import ScoreRing from './ScoreRing';

interface ResumeScoreCardProps {
  currentProfile: ResumeProfile;
}

export default function ResumeScoreCard({ currentProfile }: ResumeScoreCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-center items-center relative overflow-hidden border border-outline-variant/60 shadow-sm">
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
      <h3 className="text-sm font-bold text-on-surface w-full text-left mb-6">Resume Score</h3>
      <div className="relative w-40 h-40 flex items-center justify-center mb-4">
        <div className="w-full h-full rounded-full border-8 border-surface-container dark:border-slate-800 absolute"></div>
        <ScoreRing score={currentProfile.score} />
        <div className="text-center z-10 flex flex-col items-center">
          <span className="font-sans text-5xl font-extrabold text-primary leading-none">{currentProfile.score}</span>
          <span className="text-xs text-on-surface-variant font-bold mt-1">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-tertiary/10 px-4 py-2 rounded-full mt-2">
        <span aria-hidden="true" className="material-symbols-outlined text-tertiary text-sm">verified</span>
        <span className="text-xs font-bold text-tertiary">{currentProfile.atsCompatibility}</span>
      </div>
    </div>
  );
}
