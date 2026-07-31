import React from 'react';
import { Application } from '../types';

interface ApplicationsPerMonthChartProps {
  applications: Application[];
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthKey(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key: string): string {
  const [year, month] = key.split('-');
  return `${MONTH_LABELS[parseInt(month, 10) - 1]} '${year.slice(2)}`;
}

export default function ApplicationsPerMonthChart({ applications }: ApplicationsPerMonthChartProps) {
  const counts: Record<string, number> = {};
  applications.forEach((app) => {
    const key = monthKey(app.appliedAt);
    counts[key] = (counts[key] || 0) + 1;
  });
  const sortedMonths = Object.keys(counts).sort();
  const maxCount = Math.max(1, ...sortedMonths.map((key) => counts[key]));

  return (
    <section className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-base font-bold text-on-surface mb-1">Applications Per Month</h3>
      <p className="text-xs text-on-surface-variant mb-5">{applications.length} total applications tracked</p>
      {sortedMonths.length === 0 ? (
        <p className="text-xs text-on-surface-variant">No applications yet.</p>
      ) : (
        <div className="flex items-end justify-between gap-3 h-40">
          {sortedMonths.map((key) => (
            <div key={key} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
              <span className="text-[10px] font-bold text-on-surface">{counts[key]}</span>
              <div className="w-full h-full bg-surface-container rounded-t-full overflow-hidden flex items-end">
                <div
                  className="w-full bg-[#2a78d6] dark:bg-[#3987e5] rounded-t-full"
                  style={{ height: `${(counts[key] / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-[9px] text-on-surface-variant font-bold">{monthLabel(key)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
