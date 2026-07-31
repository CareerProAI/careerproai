import React from 'react';

interface UiSettingsSectionProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onResetState: () => void;
}

export default function UiSettingsSection({ darkMode, setDarkMode, onResetState }: UiSettingsSectionProps) {
  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider text-on-surface-variant mb-5">UI Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface">Dark theme mode</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">Toggle immersive workspace colors</p>
          </div>
          <button
            onClick={toggleDarkMode}
            role="switch"
            aria-checked={darkMode}
            aria-label="Dark theme mode"
            className={`w-11 h-6 rounded-full p-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 flex items-center ${
              darkMode ? 'bg-primary justify-end' : 'bg-surface-container-high justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        <div className="border-t border-outline-variant/30 pt-4 mt-2">
          <p className="text-xs font-bold text-on-surface">State Reset</p>
          <p className="text-[10px] text-on-surface-variant mt-0.5 mb-3">Clear simulated applications and history</p>
          <button
            onClick={onResetState}
            className="px-4 py-2 bg-error/10 hover:bg-error/20 text-error rounded-lg text-xs font-bold transition-all border border-error/30"
          >
            Reset sandbox state
          </button>
        </div>
      </div>
    </div>
  );
}
