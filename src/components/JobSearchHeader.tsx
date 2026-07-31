import React from 'react';

interface JobSearchHeaderProps {
  tabFilter: 'all' | 'recommended';
  setTabFilter: (filter: 'all' | 'recommended') => void;
}

export default function JobSearchHeader({ tabFilter, setTabFilter }: JobSearchHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h2 className="font-sans text-3xl font-extrabold text-on-surface">AI Job Match</h2>
        <p className="text-sm text-on-surface-variant max-w-2xl mt-1.5">
          Discover opportunities tailored to your resume using our predictive AI model. We analyze skills, experience, and cultural fit.
        </p>
      </div>
      <div className="flex bg-surface-container-low dark:bg-slate-900 p-1 rounded-xl self-start">
        <button
          onClick={() => setTabFilter('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            tabFilter === 'all' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          All Jobs
        </button>
        <button
          onClick={() => setTabFilter('recommended')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
            tabFilter === 'recommended' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-secondary">auto_awesome</span> Highly Recommended
        </button>
      </div>
    </div>
  );
}
