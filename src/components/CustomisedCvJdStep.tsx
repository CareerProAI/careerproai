import React, { useState } from 'react';

interface Props {
  loading: boolean;
  error: string | null;
  profileName: string;
  onGenerate: (jd: string) => void;
  onBack: () => void;
}

const MAX_JD = 3000;
const MIN_JD = 50;

export default function CustomisedCvJdStep({ loading, error, profileName, onGenerate, onBack }: Props) {
  const [jd, setJd] = useState('');

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs text-on-surface-variant">
          Tailoring for <span className="font-semibold text-on-surface">{profileName}</span>
        </p>
        <h3 className="text-base font-bold text-on-surface mt-0.5">Paste the Job Description</h3>
        <p className="text-xs text-on-surface-variant mt-1">
          Copy the full job posting text and paste it below. The AI will rewrite your resume to match the role and write a personalised cover letter.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value.slice(0, MAX_JD))}
          placeholder="Paste the job description here…"
          className="w-full h-60 p-4 glass-card rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 border border-outline-variant focus:border-primary focus:outline-none resize-none transition-colors leading-relaxed"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">Paste the entire job posting for best results</p>
          <p className={`text-xs font-medium ${jd.length >= MAX_JD ? 'text-error' : 'text-on-surface-variant'}`}>
            {jd.length}/{MAX_JD}
          </p>
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-error text-center">{error}</p>}

      <div className="flex gap-3">
        <button onClick={onBack} disabled={loading}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40">
          <span className="material-symbols-outlined text-base">arrow_back</span>Back
        </button>
        <button
          onClick={() => onGenerate(jd)}
          disabled={jd.trim().length < MIN_JD || loading}
          className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          {loading
            ? <><span className="material-symbols-outlined animate-spin text-base">autorenew</span>Generating tailored CV…</>
            : <><span className="material-symbols-outlined text-base">auto_fix_high</span>Generate Tailored CV</>}
        </button>
      </div>
    </div>
  );
}
