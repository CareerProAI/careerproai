import React from 'react';

export default function SecuritySection() {
  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider text-on-surface-variant mb-4">Security</h3>
      <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low dark:bg-slate-950/40">
        <span className="material-symbols-outlined text-on-surface-variant text-lg">info</span>
        <div>
          <p className="text-xs font-bold text-on-surface">No authentication configured</p>
          <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
            This is a single-user sandbox with no login, password, or session system —
            there is nothing here to secure yet. Password management, two-factor
            authentication, and session controls will appear here once the app has real
            per-user authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
