import React from 'react';
import { Job } from '../types';
import JobDetailsHeader from './JobDetailsHeader';
import JobDetailsDescription from './JobDetailsDescription';
import Modal from './ui/Modal';

interface JobDetailsModalProps {
  job: Job;
  isSaved: boolean;
  applied: boolean;
  onClose: () => void;
  onSaveJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
}

export default function JobDetailsModal({
  job,
  isSaved,
  applied,
  onClose,
  onSaveJob,
  onApplyJob,
}: JobDetailsModalProps) {
  const stats = [
    { label: 'Match', value: job.notAiScored ? 'Not Scored' : `${job.matchRate}%` },
    { label: 'Workplace', value: job.workplaceType },
    { label: 'Employment', value: job.employmentType },
    { label: 'Level', value: job.experienceLevel },
  ];

  return (
    <Modal scrollable onClose={onClose}>
      <JobDetailsHeader job={job} onClose={onClose} />

      <div className="space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface-container-low dark:bg-slate-950/40 rounded-xl p-3 text-center">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">{stat.label}</p>
              <p className="text-sm font-extrabold text-on-surface mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between bg-primary/5 p-4 rounded-xl border border-primary/20">
          <div>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Salary</p>
            <p className="text-base font-extrabold text-primary">{job.salary}</p>
          </div>
          <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">{job.postedTime}</span>
        </div>

        <div>
          <h4 className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Why It Matches</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">{job.whyMatches}</p>
        </div>

        <JobDetailsDescription job={job} />

        <div>
          <h4 className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Required Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <span key={skill} className="px-2.5 py-1 bg-surface-container dark:bg-slate-800 text-on-surface rounded-lg text-[11px] font-semibold border border-outline-variant/20">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-outline-variant/40 flex justify-end gap-2">
        <button
          onClick={() => onSaveJob(job)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${isSaved ? 'bg-secondary-container border-secondary-container text-on-secondary-container' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}
        >
          <span className="material-symbols-outlined text-sm leading-none">{isSaved ? 'bookmark_added' : 'bookmark_border'}</span>
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button
          disabled={applied}
          onClick={() => onApplyJob(job)}
          className={`px-5 py-2 rounded-xl text-xs font-bold ${applied ? 'bg-tertiary/10 text-tertiary cursor-default border border-tertiary/20' : 'bg-primary text-on-primary hover:bg-primary/95'}`}
        >
          {applied ? 'Applied' : 'Apply Now'}
        </button>
      </div>
    </Modal>
  );
}
