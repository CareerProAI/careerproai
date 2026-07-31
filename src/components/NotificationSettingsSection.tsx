import React from 'react';
import { NotificationPrefs } from '../types';

interface NotificationSettingsSectionProps {
  prefs: NotificationPrefs;
  onUpdatePrefs: (prefs: NotificationPrefs) => void;
}

const TOGGLE_ITEMS: { key: keyof NotificationPrefs; label: string; description: string }[] = [
  {
    key: 'notifyJobMatches',
    label: 'Job match alerts',
    description: 'Notify when a new high-match job is found',
  },
  {
    key: 'notifyResumeAnalysis',
    label: 'Resume analysis complete',
    description: 'Notify when a resume finishes parsing and scoring',
  },
  {
    key: 'notifyWeeklySummary',
    label: 'Weekly summary',
    description: 'A weekly digest of your application activity',
  },
];

export default function NotificationSettingsSection({ prefs, onUpdatePrefs }: NotificationSettingsSectionProps) {
  const toggle = (key: keyof NotificationPrefs) => {
    onUpdatePrefs({ ...prefs, [key]: !prefs[key] });
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider text-on-surface-variant mb-4">
        Notification Settings
      </h3>
      <div className="space-y-4">
        {TOGGLE_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-on-surface">{item.label}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{item.description}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              role="switch"
              aria-checked={prefs[item.key]}
              aria-label={item.label}
              className={`w-11 h-6 rounded-full p-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 flex items-center ${
                prefs[item.key] ? 'bg-primary justify-end' : 'bg-surface-container-high justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
