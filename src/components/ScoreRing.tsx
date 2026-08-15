import React, { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
}

export default function ScoreRing({ score }: ScoreRingProps) {
  const [dash, setDash] = useState('0 100');

  useEffect(() => {
    if (score === 0) return;
    setDash(`${score} 100`);
  }, [score]);

  return (
    <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 36 36">
      <defs>
        <linearGradient id="score-ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a78d6" />
          <stop offset="100%" stopColor="#7fda8b" />
        </linearGradient>
      </defs>
      <path
        fill="none"
        stroke="url(#score-ring-grad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray={dash}
        className={score === 0 ? undefined : 'animate-score-ring'}
        style={score === 0 ? undefined : { animation: 'score-ring-draw 0.8s ease-out forwards' }}
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </svg>
  );
}
