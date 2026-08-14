import React, { useEffect, useRef } from 'react';
import { isDialogBackdropClick } from '../../utils/dialogLightDismiss';

interface ModalProps {
  children: React.ReactNode;
  scrollable?: boolean;
  onClose: () => void;
  labelledBy?: string;
}

export default function Modal({ children, scrollable = false, onClose, labelledBy }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.setAttribute('closedby', 'any');
    if (!dialog.open) dialog.showModal();

    const onDialogClose = () => onCloseRef.current();
    dialog.addEventListener('close', onDialogClose);

    const supportsClosedBy = 'closedBy' in HTMLDialogElement.prototype;
    const onBackdropClick = (event: MouseEvent) => {
      if (supportsClosedBy) return;
      if (isDialogBackdropClick(dialog, event, dialog.getBoundingClientRect())) dialog.close();
    };
    if (!supportsClosedBy) dialog.addEventListener('click', onBackdropClick);

    return () => {
      dialog.removeEventListener('close', onDialogClose);
      dialog.removeEventListener('click', onBackdropClick);
      // Skip dialog.close(): Strict Mode would fire `close` after remount.
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      className={`app-dialog bg-surface-container-high text-on-surface border border-outline-variant rounded-2xl max-w-2xl w-[calc(100%-2rem)] p-6 ${
        scrollable ? 'max-h-[90vh] overflow-y-auto' : ''
      }`}
    >
      {children}
    </dialog>
  );
}
