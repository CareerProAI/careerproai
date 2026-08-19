import React from 'react';

interface CustomizedResumeJobFieldsProps {
  title: string;
  company: string;
  onTitle: (value: string) => void;
  onCompany: (value: string) => void;
}

export default function CustomizedResumeJobFields({
  title, company, onTitle, onCompany,
}: CustomizedResumeJobFieldsProps) {
  const fieldClass =
    'w-full min-h-12 text-base bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-3 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="custom-job-title" className="text-sm font-bold text-on-surface">Job title</label>
        <input
          id="custom-job-title"
          name="jobTitle"
          autoComplete="organization-title"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          placeholder="e.g. System Support Specialist"
          className={fieldClass}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="custom-job-company" className="text-sm font-bold text-on-surface">Company</label>
        <input
          id="custom-job-company"
          name="company"
          autoComplete="organization"
          value={company}
          onChange={(e) => onCompany(e.target.value)}
          placeholder="e.g. Data Edge Limited"
          className={fieldClass}
        />
      </div>
    </div>
  );
}
