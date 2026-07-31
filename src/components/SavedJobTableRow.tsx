import React from 'react';
import { Job, SavedJobRecord } from '../types';
import SavedJobNotesCell from './SavedJobNotesCell';

interface SavedJobTableRowProps {
  // No @types/react is installed in this project, so TS has no JSX.IntrinsicAttributes
  // to auto-exclude `key` from prop-shape checks — declare it explicitly so passing
  // key={record.id} at the call site type-checks.
  key?: string;
  job: Job;
  record: SavedJobRecord;
  applied: boolean;
  isEditing: boolean;
  tempNotes: string;
  onTempNotesChange: (value: string) => void;
  onStartEdit: () => void;
  onConfirmEdit: () => void;
  onRemove: () => void;
  onApply: () => void;
}

export default function SavedJobTableRow({
  job,
  record,
  applied,
  isEditing,
  tempNotes,
  onTempNotesChange,
  onStartEdit,
  onConfirmEdit,
  onRemove,
  onApply,
}: SavedJobTableRowProps) {
  return (
    <tr className="hover:bg-surface-container-low dark:hover:bg-slate-950/60 transition-colors">
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-outline-variant/30 bg-white dark:bg-slate-950 flex items-center justify-center p-1 shrink-0 overflow-hidden">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-7 h-7 object-contain" />
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant text-base">business</span>
            )}
          </div>
          <div>
            <p className="font-extrabold text-on-surface text-sm">{job.title}</p>
            <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{job.company} • {job.location}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-3 text-on-surface-variant font-medium text-xs">{record.saved_at}</td>
      <td className="py-4 px-3">
        <span className="inline-flex items-center gap-1 bg-tertiary/10 text-tertiary font-bold px-2.5 py-0.5 rounded-full">
          {record.match_rate}% Match
        </span>
      </td>
      <td className="py-4 px-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${applied ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary-container text-on-secondary-container'}`}>
          {applied ? 'Applied' : 'Saved'}
        </span>
      </td>
      <td className="py-4 px-3 max-w-[240px]">
        <SavedJobNotesCell
          notes={record.notes}
          isEditing={isEditing}
          tempNotes={tempNotes}
          onTempNotesChange={onTempNotesChange}
          onStartEdit={onStartEdit}
          onConfirmEdit={onConfirmEdit}
        />
      </td>
      <td className="py-4 px-3 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={onRemove}
            className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all"
            title="Remove from saved"
            aria-label="Remove from saved jobs"
          >
            <span className="material-symbols-outlined text-sm leading-none">bookmark_remove</span>
          </button>
          <button
            disabled={applied}
            onClick={onApply}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              applied
                ? 'bg-tertiary/10 text-tertiary cursor-default border border-tertiary/20'
                : 'bg-primary text-on-primary hover:bg-primary/95 cursor-pointer'
            }`}
          >
            {applied ? 'Applied' : 'Apply'}
          </button>
        </div>
      </td>
    </tr>
  );
}
