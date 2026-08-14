import React from 'react';
import { Application } from '../types';

interface ApplicationTableRowProps {
  // No @types/react is installed in this project, so TS has no JSX.IntrinsicAttributes
  // to auto-exclude `key` from prop-shape checks — declare it explicitly so passing
  // key={app.id} at the call site type-checks.
  key?: string;
  app: Application;
  editingId: string | null;
  tempNotes: string;
  statusColors: Record<Application['status'], string>;
  onUpdateStatus: (id: string, newStatus: Application['status']) => void;
  onTempNotesChange: (value: string) => void;
  onStartEdit: () => void;
  onConfirmEdit: () => void;
}

export default function ApplicationTableRow({
  app,
  editingId,
  tempNotes,
  statusColors,
  onUpdateStatus,
  onTempNotesChange,
  onStartEdit,
  onConfirmEdit,
}: ApplicationTableRowProps) {
  return (
    <tr className="hover:bg-surface-container-low dark:hover:bg-slate-950/60 transition-colors">
      <td className="py-4 px-3">
        <div>
          <p className="font-extrabold text-on-surface text-sm">{app.title}</p>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">{app.company} • {app.location}</p>
        </div>
      </td>

      <td className="py-4 px-3 text-on-surface-variant font-medium text-xs">{app.appliedDate}</td>

      <td className="py-4 px-3">
        <select
          value={app.status}
          onChange={(e) => onUpdateStatus(app.id, e.target.value as Application['status'])}
          aria-label={`Status for ${app.title} at ${app.company}`}
          className={`text-xs font-bold rounded-full px-3 py-1 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${statusColors[app.status]}`}
        >
          <option value="Applied">Applied</option>
          <option value="Screening">Screening</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offered">Offered</option>
          <option value="Rejected">Rejected</option>
        </select>
      </td>

      <td className="py-4 px-3 max-w-[280px]">
        {editingId === app.id ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={tempNotes}
              onChange={(e) => onTempNotesChange(e.target.value)}
              className="bg-surface-container-high border border-outline-variant/60 rounded px-2.5 py-1 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary flex-1"
            />
            <button
              onClick={onConfirmEdit}
              aria-label="Save notes"
              className="p-1 rounded bg-primary text-on-primary hover:bg-primary/95"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">done</span>
            </button>
          </div>
        ) : (
          <div className="group/notes flex items-center gap-2">
            <p className="text-xs text-on-surface-variant font-medium italic truncate max-w-[240px]">
              {app.notes || 'No comments added yet.'}
            </p>
            <button
              onClick={onStartEdit}
              aria-label="Edit notes"
              className="opacity-0 group-hover/notes:opacity-100 hover:text-primary transition-opacity"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-sm leading-none">edit</span>
            </button>
          </div>
        )}
      </td>

      <td className="py-4 px-3 text-right">
        <button
          onClick={onStartEdit}
          className="text-primary hover:text-primary-container font-extrabold hover:underline transition-colors mr-1 cursor-pointer"
        >
          Edit Notes
        </button>
      </td>
    </tr>
  );
}
