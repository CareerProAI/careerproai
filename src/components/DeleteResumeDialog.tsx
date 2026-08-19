import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { resumeDeleteDialogCopy } from '../utils/resumeDeleteCommand';

interface DeleteResumeDialogProps {
  fileName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteResumeDialog({ fileName, onCancel, onConfirm }: DeleteResumeDialogProps) {
  const copy = resumeDeleteDialogCopy(fileName);

  return (
    <Modal compact onClose={onCancel} labelledBy="delete-resume-title" describedBy="delete-resume-desc">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="material-symbols-outlined text-error shrink-0 mt-0.5"
        >
          delete
        </span>
        <div>
          <h2 id="delete-resume-title" className="text-base font-bold text-on-surface">
            {copy.title}
          </h2>
          <p id="delete-resume-desc" className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            {copy.description}
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" size="sm" className="text-on-surface" autoFocus onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm}>
          Delete CV
        </Button>
      </div>
    </Modal>
  );
}
