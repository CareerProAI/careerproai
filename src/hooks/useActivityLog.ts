import { useState } from 'react';
import { mockActivities } from '../data';
import { ActivityLog } from '../types';

export function useActivityLog() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivities);

  const addLog = (text: string) => {
    const newLog: ActivityLog = { id: `act-${Date.now()}`, text, time: 'Just Now' };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const resetLogs = () => setActivityLogs(mockActivities);

  return { activityLogs, addLog, resetLogs };
}
