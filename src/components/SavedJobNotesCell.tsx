import React from 'react';

interface SavedJobNotesCellProps {
  notes: string | null;
  isEditing: boolean;
  tempNotes: string;
  onTempNotesChange: (value: string) => void;
  onStartEdit: () => void;
  onConfirmEdit: () => void;
}

export default function SavedJobNotesCell({
  notes,
  isEditing,
  tempNotes,
  onTempNotesChange,
  onStartEdit,
  onConfirmEdit,
}: SavedJobNotesCellProps) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={tempNotes}
          onChange={(e) => onTempNotesChange(e.target.value)}
          className="bg-surface-container-high border border-outline-variant/60 rounded px-2.5 py-1 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary flex-1"
        />
        <button onClick={onConfirmEdit} aria-label="Save notes" className="p-1 rounded bg-primary text-on-primary hover:bg-primary/95">
          <span className="material-symbols-outlined text-[16px]">done</span>
        </button>
      </div>
    );
  }

  return (
    <div className="group/notes flex items-center gap-2">
      <p className="text-xs text-on-surface-variant font-medium italic truncate max-w-[200px]">
        {notes || 'No notes added yet.'}
      </p>
      <button onClick={onStartEdit} aria-label="Edit notes" className="opacity-0 group-hover/notes:opacity-100 hover:text-primary transition-opacity">
        <span className="material-symbols-outlined text-sm leading-none">edit</span>
      </button>
    </div>
  );
}
