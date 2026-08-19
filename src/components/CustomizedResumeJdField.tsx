import React from 'react';

interface CustomizedResumeJdFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomizedResumeJdField({ value, onChange }: CustomizedResumeJdFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="customized-resume-jd" className="text-sm font-bold text-on-surface">
        Paste the job description
      </label>
      <p id="customized-resume-jd-hint" className="text-xs text-on-surface-variant">
        Required. We tailor the CV and cover letter to this posting.
      </p>
      <textarea
        id="customized-resume-jd"
        name="jobDescription"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby="customized-resume-jd-hint"
        placeholder="Paste the full job description here…"
        className="w-full min-h-40 text-base bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-3 py-3 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
      />
    </div>
  );
}
