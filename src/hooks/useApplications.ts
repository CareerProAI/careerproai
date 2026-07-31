import { useState } from 'react';
import { mockApplications } from '../data';
import { Application } from '../types';

export function useApplications(triggerToast: (msg: string) => void) {
  const [applications, setApplications] = useState<Application[]>(mockApplications);

  const onUpdateStatus = (id: string, newStatus: Application['status']) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)));
    triggerToast(`Updated application status to ${newStatus}`);
  };

  const onUpdateNotes = (id: string, notes: string) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, notes } : app)));
    triggerToast('Application notes updated');
  };

  const resetApplications = () => setApplications(mockApplications);

  return { applications, onUpdateStatus, onUpdateNotes, resetApplications };
}
