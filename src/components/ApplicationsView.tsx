import React, { useState } from 'react';
import { Application } from '../types';
import ApplicationsEmptyState from './ApplicationsEmptyState';
import ApplicationsKpiRow from './ApplicationsKpiRow';
import ApplicationTableRow from './ApplicationTableRow';
import Card from './ui/Card';
import Table from './ui/Table';

interface ApplicationsViewProps {
  applications: Application[];
  onUpdateStatus: (id: string, newStatus: Application['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  setTab: (tab: string) => void;
}

const TABLE_HEADERS = ['Job & Company', 'Applied Date', 'Status', 'Notes', 'Actions'];

export default function ApplicationsView({
  applications,
  onUpdateStatus,
  onUpdateNotes,
  setTab,
}: ApplicationsViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  if (applications.length === 0) {
    return (
      <div id="view-applications" className="animate-in fade-in duration-300">
        <ApplicationsEmptyState onBrowseJobs={() => setTab('jobs')} />
      </div>
    );
  }

  // Status statistics counts
  const stats = {
    applied: applications.filter((a) => a.status === 'Applied').length,
    screening: applications.filter((a) => a.status === 'Screening').length,
    interviewing: applications.filter((a) => a.status === 'Interviewing').length,
    offered: applications.filter((a) => a.status === 'Offered').length,
  };

  const statusColors: Record<Application['status'], string> = {
    Applied: 'bg-tertiary-container text-on-tertiary-container border border-tertiary-container',
    Screening: 'bg-secondary-container text-on-secondary-container border border-secondary-container',
    Interviewing: 'bg-secondary-container text-on-secondary-container border border-secondary-container',
    Offered: 'bg-tertiary-container text-on-tertiary-container border border-tertiary-container',
    Rejected: 'bg-error-container text-on-error-container border border-error-container',
  };

  return (
    <div id="view-applications" className="animate-in fade-in duration-300">
      <ApplicationsKpiRow stats={stats} />

      {/* Main Applications Table */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Application Pipeline</h3>
            <p className="text-xs text-on-surface-variant">Update, review, or edit the status of submitted jobs.</p>
          </div>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wider">
            {applications.length} Applications tracked
          </span>
        </div>

        <Table headers={TABLE_HEADERS}>
          {applications.map((app) => (
            <ApplicationTableRow
              key={app.id}
              app={app}
              editingId={editingId}
              tempNotes={tempNotes}
              statusColors={statusColors}
              onUpdateStatus={onUpdateStatus}
              onTempNotesChange={setTempNotes}
              onStartEdit={() => {
                setEditingId(app.id);
                setTempNotes(app.notes || '');
              }}
              onConfirmEdit={() => {
                onUpdateNotes(app.id, tempNotes);
                setEditingId(null);
              }}
            />
          ))}
        </Table>
      </Card>
    </div>
  );
}
