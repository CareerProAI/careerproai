import React from 'react';
import { ResumeProfile } from '../types';

interface ResumeUploadHistoryTableProps {
  profiles: ResumeProfile[];
  currentProfile: ResumeProfile | null;
  onSelect: (profile: ResumeProfile) => void;
}

export default function ResumeUploadHistoryTable({ profiles, currentProfile, onSelect }: ResumeUploadHistoryTableProps) {
  return (
    <div className="xl:col-span-5 flex flex-col h-full">
      <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col border border-outline-variant/60 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-on-surface">Upload History</h3>
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Historical Scans</span>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant/50">
                <th className="text-on-surface-variant py-3 px-2 font-semibold">Document</th>
                <th className="text-on-surface-variant py-3 px-2 font-semibold">Date</th>
                <th className="text-on-surface-variant py-3 px-2 font-semibold text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const isPdf = p.fileName.endsWith('.pdf');
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-outline-variant/30 hover:bg-surface-container-low dark:hover:bg-slate-950/60 transition-colors ${
                      p.id === currentProfile?.id ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="py-4 px-2">
                      <button
                        onClick={() => onSelect(p)}
                        aria-label={`View analyzed report for ${p.candidateName}`}
                        className="w-full flex items-center gap-3 text-left cursor-pointer"
                      >
                        <div
                          className={`h-8 w-8 rounded flex items-center justify-center shrink-0 ${
                            isPdf ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'
                          }`}
                        >
                          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                            {isPdf ? 'picture_as_pdf' : 'description'}
                          </span>
                        </div>
                        <div className="truncate max-w-[140px]">
                          <p className="font-bold text-on-surface">{p.fileName}</p>
                          <p className="text-[10px] text-on-surface-variant mt-0.5">{p.candidateName}</p>
                        </div>
                      </button>
                    </td>
                    <td className="py-4 px-2 text-on-surface-variant font-medium">{p.lastAnalyzed}</td>
                    <td className="py-4 px-2 text-right">
                      <span className="inline-flex items-center gap-1 bg-tertiary/10 text-tertiary font-bold px-2.5 py-0.5 rounded-full">
                        {p.score}/100
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
