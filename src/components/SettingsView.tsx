import React, { useState } from 'react';
import { ResumeProfile, NotificationPrefs } from '../types';
import ResumeManagementSection from './ResumeManagementSection';
import ApiKeysSection from './ApiKeysSection';
import NotificationSettingsSection from './NotificationSettingsSection';
import AccountSection from './AccountSection';
import SecuritySection from './SecuritySection';
import ProfileDetailsSection from './ProfileDetailsSection';
import UiSettingsSection from './UiSettingsSection';
import Toast from './ui/Toast';

interface SettingsViewProps {
  currentProfile: ResumeProfile;
  profiles: ResumeProfile[];
  onUpdateProfile: (updated: Partial<ResumeProfile>) => void;
  onSelectProfile: (profile: ResumeProfile) => void;
  onDeleteProfile: (profileId: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onResetState: () => void;
  aiConfigured: boolean | null;
  apiKeyLabel: string;
  onUpdateApiKeyLabel: (label: string) => void;
  notificationPrefs: NotificationPrefs;
  onUpdateNotificationPrefs: (prefs: NotificationPrefs) => void;
  accountName: string;
  accountEmail: string;
  onUpdateAccount: (name: string, email: string) => void;
}

export default function SettingsView({
  currentProfile,
  profiles,
  onUpdateProfile,
  onSelectProfile,
  onDeleteProfile,
  darkMode,
  setDarkMode,
  onResetState,
  aiConfigured,
  apiKeyLabel,
  onUpdateApiKeyLabel,
  notificationPrefs,
  onUpdateNotificationPrefs,
  accountName,
  accountEmail,
  onUpdateAccount,
}: SettingsViewProps) {
  const [showToast, setShowToast] = useState(false);

  const handleProfileSaved = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div id="view-settings" className="animate-in fade-in duration-300">
      {showToast && <Toast message="Settings updated successfully!" />}

      {/* Intro Header */}
      <section className="mb-8">
        <h2 className="font-sans text-3xl font-extrabold text-on-surface">Configuration &amp; Settings</h2>
        <p className="text-sm text-on-surface-variant mt-1.5">
          Modify active profile credentials, theme behaviors, and sandbox preferences.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left wider settings panel */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileDetailsSection
            key={currentProfile.id}
            currentProfile={currentProfile}
            onUpdateProfile={onUpdateProfile}
            onSaved={handleProfileSaved}
          />
          <AccountSection accountName={accountName} accountEmail={accountEmail} onUpdateAccount={onUpdateAccount} />
          <ResumeManagementSection
            profiles={profiles}
            currentProfile={currentProfile}
            onSelectProfile={onSelectProfile}
            onDeleteProfile={onDeleteProfile}
          />
        </div>

        {/* Right preferences widgets */}
        <div className="space-y-6">
          <UiSettingsSection darkMode={darkMode} setDarkMode={setDarkMode} onResetState={onResetState} />
          <ApiKeysSection aiConfigured={aiConfigured} apiKeyLabel={apiKeyLabel} onUpdateApiKeyLabel={onUpdateApiKeyLabel} />
          <NotificationSettingsSection prefs={notificationPrefs} onUpdatePrefs={onUpdateNotificationPrefs} />
          <SecuritySection />
        </div>
      </div>
    </div>
  );
}
