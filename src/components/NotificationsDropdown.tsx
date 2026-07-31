import React from 'react';

const notifications = [
  { id: 1, text: 'Your resume has high ATS score (92/100)!', time: '10 min ago' },
  { id: 2, text: 'Google matched your profile (98% match)', time: '2 hours ago' },
  { id: 3, text: 'Stripe requested an update to your resume', time: 'Yesterday' },
];

interface NotificationsDropdownProps {
  showNotifications: boolean;
  onToggle: () => void;
}

export default function NotificationsDropdown({ showNotifications, onToggle }: NotificationsDropdownProps) {
  return (
    <div className="relative">
      <button
        id="btn-notifications"
        onClick={onToggle}
        aria-label="Notifications"
        className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all relative"
      >
        <span className="material-symbols-outlined">notifications</span>
        <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-container border border-outline-variant rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 border-b border-outline-variant/60 flex justify-between items-center">
            <span className="font-semibold text-xs uppercase tracking-wider text-on-surface-variant">Notifications</span>
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">New</span>
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-outline-variant/30">
            {notifications.map((n) => (
              <div key={n.id} className="p-3 text-xs hover:bg-surface-container-low transition-colors">
                <p className="text-on-surface font-medium">{n.text}</p>
                <p className="text-[10px] text-on-surface-variant mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
