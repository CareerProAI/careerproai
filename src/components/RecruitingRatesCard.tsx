import React from 'react';
import { Application } from '../types';

interface RecruitingRatesCardProps {
  applications: Application[];
}

// Reuses the T22-validated categorical slots (blue, aqua) — same palette,
// no new validation needed for these two identities.
const METERS = [
  { key: 'interview', label: 'Interview Rate', barClass: 'bg-[#2a78d6] dark:bg-[#3987e5]', trackClass: 'bg-[#2a78d6]/10 dark:bg-[#3987e5]/15' },
  { key: 'offer', label: 'Offer Rate', barClass: 'bg-[#1baf7a] dark:bg-[#199e70]', trackClass: 'bg-[#1baf7a]/10 dark:bg-[#199e70]/15' },
];

export default function RecruitingRatesCard({ applications }: RecruitingRatesCardProps) {
  const total = applications.length;
  // 'Offered' implies interviewing already happened (safe inference). 'Rejected'
  // is excluded from both — it could have been rejected at any prior stage, and
  // status only stores the current stage, not a stage-history, so assuming it
  // passed through Interviewing would be a guess, not a real computed value.
  const interviewedOrBeyond = applications.filter((a) => a.status === 'Interviewing' || a.status === 'Offered').length;
  const offered = applications.filter((a) => a.status === 'Offered').length;

  const values: Record<string, number> = {
    interview: total > 0 ? Math.round((interviewedOrBeyond / total) * 100) : 0,
    offer: total > 0 ? Math.round((offered / total) * 100) : 0,
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider text-on-surface-variant mb-4">Recruiting Funnel</h3>
      {total === 0 ? (
        <p className="text-xs text-on-surface-variant">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {METERS.map((meter) => (
            <div key={meter.key}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-xs font-medium text-on-surface-variant">{meter.label}</span>
                <span className="text-xs font-extrabold text-on-surface">{values[meter.key]}%</span>
              </div>
              <div className={`h-2 w-full rounded-r-full overflow-hidden ${meter.trackClass}`}>
                <div className={`h-full rounded-r-full ${meter.barClass}`} style={{ width: `${values[meter.key]}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
