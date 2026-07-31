import React from 'react';
import { ImprovementItem } from '../types';

interface DashboardRecommendationsCardProps {
  improvements: ImprovementItem[];
  setTab: (tab: string) => void;
}

const PRIORITY_ORDER: Record<ImprovementItem['priority'], number> = { High: 0, Medium: 1, Low: 2 };
const PRIORITY_DOT: Record<ImprovementItem['priority'], string> = { High: 'bg-error', Medium: 'bg-secondary', Low: 'bg-outline-variant' };

export default function DashboardRecommendationsCard({ improvements, setTab }: DashboardRecommendationsCardProps) {
  const topRecommendations = [...improvements]
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 3);

  return (
    <section className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
          AI Recommendations
        </h3>
        <button onClick={() => setTab('resume')} className="text-xs text-primary font-bold hover:underline">
          View All
        </button>
      </div>
      {topRecommendations.length > 0 ? (
        <ul className="space-y-3">
          {topRecommendations.map((imp) => (
            <li key={imp.id} className="flex items-start gap-3">
              <span className={`inline-block w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${PRIORITY_DOT[imp.priority]}`} />
              <div>
                <h4 className="text-xs font-bold text-on-surface leading-tight">{imp.title}</h4>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{imp.description}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-on-surface-variant">No recommendations yet — great job!</p>
      )}
    </section>
  );
}
