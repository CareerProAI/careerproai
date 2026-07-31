import React, { useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
  scrollable?: boolean;
  onClose: () => void;
}

export default function Modal({ children, scrollable = false, onClose }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[20px] z-50 flex items-center justify-center p-4">
      <div
        className={`bg-surface-container-high border border-outline-variant rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 ${
          scrollable ? 'max-h-[90vh] overflow-y-auto' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
}
