import React from 'react';
import { ActivityLog } from '../types';
import Card from './ui/Card';

interface DashboardActivityTimelineProps {
  activityLogs: ActivityLog[];
}

export default function DashboardActivityTimeline({ activityLogs }: DashboardActivityTimelineProps) {
  return (
    <Card as="section">
      <h3 className="text-lg font-bold text-on-surface mb-5">Recent Activity</h3>
      <div className="relative border-l-2 border-outline-variant/40 ml-3 space-y-6">
        {activityLogs.map((log, index) => (
          <div key={log.id} className="relative pl-6">
            <div
              className={`absolute w-3.5 h-3.5 rounded-full -left-[8px] top-1 border-2 border-white dark:border-slate-900 shadow-sm ${
                index === 0 ? 'bg-primary-container animate-pulse' : 'bg-surface-variant'
              }`}
            />
            <p className="text-xs font-bold text-on-surface leading-tight">{log.text}</p>
            <p className="text-[10px] text-on-surface-variant mt-1 font-medium">{log.time}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
