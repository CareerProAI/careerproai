import React from 'react';

interface ScoreProgressionChartProps {
  scoreHistory: { label: string; score: number }[];
}

const CHART_LEFT = 10;
const CHART_RIGHT = 480;
const CHART_BOTTOM = 120; // area-fill baseline (full viewBox bottom edge)
const PLOT_TOP = 10;
const PLOT_BOTTOM = 110; // keep plotted points within the viewBox regardless of score

function scoreToY(score: number): number {
  const clamped = Math.max(0, Math.min(100, score));
  return PLOT_BOTTOM - (clamped / 100) * (PLOT_BOTTOM - PLOT_TOP);
}

export default function ScoreProgressionChart({ scoreHistory }: ScoreProgressionChartProps) {
  const points =
    scoreHistory.length === 1
      ? [{ x: (CHART_LEFT + CHART_RIGHT) / 2, y: scoreToY(scoreHistory[0].score) }]
      : scoreHistory.map((item, idx) => ({
          x: CHART_LEFT + (idx / (scoreHistory.length - 1)) * (CHART_RIGHT - CHART_LEFT),
          y: scoreToY(item.score),
        }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${CHART_BOTTOM} L ${points[0].x} ${CHART_BOTTOM} Z`
      : '';
  const growth = scoreHistory.length > 1 ? scoreHistory[scoreHistory.length - 1].score - scoreHistory[0].score : null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base font-bold text-on-surface">Score Progression</h3>
          <p className="text-xs text-on-surface-variant">Your CV scoring timeline</p>
        </div>
        {growth !== null && (
          <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
            {growth >= 0 ? '+' : ''}{growth} pts since first analysis
          </span>
        )}
      </div>

      <div className="w-full h-64 relative bg-surface-container-low dark:bg-slate-950/40 rounded-xl p-4 border border-outline-variant/20 flex flex-col justify-between">
        <div className="absolute inset-x-4 inset-y-12 flex flex-col justify-between pointer-events-none opacity-10">
          <div className="border-b border-on-surface"></div>
          <div className="border-b border-on-surface"></div>
          <div className="border-b border-on-surface"></div>
          <div className="border-b border-on-surface"></div>
        </div>

        <div className="flex-1 w-full relative min-h-[140px] mt-6">
          <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a73e8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1a73e8" stopOpacity="0" />
              </linearGradient>
            </defs>
            {areaPath && <path d={areaPath} fill="url(#gradient)" />}
            {points.length > 1 && <path d={linePath} fill="none" stroke="#1a73e8" strokeWidth="3.5" strokeLinecap="round" />}
            {points.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={idx === points.length - 1 ? 6 : 4.5}
                fill="#1a73e8"
                stroke="white"
                strokeWidth={idx === points.length - 1 ? 2 : 1.5}
              />
            ))}
          </svg>
        </div>

        <div className="flex justify-between text-[10px] text-on-surface-variant font-bold border-t border-outline-variant/30 pt-3 px-1 mt-2">
          {scoreHistory.map((item, idx) => (
            <div key={idx} className="text-center">
              <p className="text-on-surface">{item.score} Pts</p>
              <p className="text-[9px] text-on-surface-variant mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-[11px] text-on-surface-variant font-medium">
        <span className="w-3 h-1.5 bg-primary rounded-full"></span>
        <span>Your CV score at each analysis</span>
      </div>
    </div>
  );
}
