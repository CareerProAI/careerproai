import React, { useState, useEffect } from 'react';

interface AccountSectionProps {
  accountName: string;
  accountEmail: string;
  onUpdateAccount: (name: string, email: string) => void;
}

export default function AccountSection({ accountName, accountEmail, onUpdateAccount }: AccountSectionProps) {
  const [name, setName] = useState(accountName);
  const [email, setEmail] = useState(accountEmail);

  useEffect(() => {
    setName(accountName);
    setEmail(accountEmail);
  }, [accountName, accountEmail]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAccount(name, email);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-base font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-3">Account</h3>
      <form onSubmit={handleSave} className="space-y-5 text-xs">
        <div>
          <label htmlFor="account-name" className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Account Name</label>
          <input
            id="account-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low dark:bg-slate-950/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="account-email" className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Account Email</label>
          <input
            id="account-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low dark:bg-slate-950/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:bg-primary/95 transition-all cursor-pointer"
          >
            Save Account Details
          </button>
        </div>
      </form>
    </div>
  );
}
