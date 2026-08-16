import React, { useState, useEffect } from 'react';

interface ApiKeysSectionProps {
  aiConfigured: boolean | null;
  apiKeyLabel: string;
  onUpdateApiKeyLabel: (label: string) => void;
}

export default function ApiKeysSection({ aiConfigured, apiKeyLabel, onUpdateApiKeyLabel }: ApiKeysSectionProps) {
  const [label, setLabel] = useState(apiKeyLabel);

  useEffect(() => {
    setLabel(apiKeyLabel);
  }, [apiKeyLabel]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateApiKeyLabel(label);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider text-on-surface-variant mb-4">API Keys</h3>

      <div className="flex items-center justify-between mb-5 p-3 rounded-xl bg-surface-container-low dark:bg-slate-950/40">
        <div>
          <p className="text-xs font-bold text-on-surface">AI Provider (Groq → Gemini → DeepSeek)</p>
          <p className="text-[10px] text-on-surface-variant mt-0.5">Used server-side for resume parsing and job matching. Groq first, then Gemini, then DeepSeek if a key is set.</p>
        </div>
        {aiConfigured === null ? (
          <span className="text-[10px] font-bold text-on-surface-variant">Checking…</span>
        ) : aiConfigured ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-tertiary">
            <span aria-hidden="true" className="material-symbols-outlined text-sm">check_circle</span> Configured
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold text-error">
            <span aria-hidden="true" className="material-symbols-outlined text-sm">error</span> Not configured
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-2">
        <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Account Label</label>
        <p className="text-[10px] text-on-surface-variant mb-1">
          An optional note for your own reference (e.g. "Personal account") — never the key itself.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Personal account"
            className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low dark:bg-slate-950/40 text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-on-primary font-bold rounded-xl text-xs hover:bg-primary/95 transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
