import { useState, useEffect } from 'react';
import { fetchUsers, fetchConfigStatus, updateUserApiKeyLabel, updateNotificationPreferences, updateAccountDetails } from '../api';
import { NotificationPrefs } from '../types';

export function useAccountSettings(triggerToast: (msg: string) => void) {
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [apiKeyLabel, setApiKeyLabel] = useState('');
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    notifyJobMatches: true,
    notifyResumeAnalysis: true,
    notifyWeeklySummary: false,
  });
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');

  // Config status is safe to fetch on mount — it's a boolean, never the actual key
  useEffect(() => {
    let cancelled = false;

    const loadConfig = async () => {
      try {
        const [status, users] = await Promise.all([fetchConfigStatus(), fetchUsers()]);
        if (cancelled) return;
        setAiConfigured(status.aiConfigured);
        const defaultUser = users.find((u: { id: string }) => u.id === 'user-default');
        setApiKeyLabel(defaultUser?.api_key_label || '');
        setAccountName(defaultUser?.name || '');
        setAccountEmail(defaultUser?.email || '');
        if (defaultUser) {
          setNotificationPrefs({
            notifyJobMatches: Boolean(defaultUser.notify_job_matches),
            notifyResumeAnalysis: Boolean(defaultUser.notify_resume_analysis),
            notifyWeeklySummary: Boolean(defaultUser.notify_weekly_summary),
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load config status:', err);
          triggerToast(err instanceof Error ? err.message : 'Failed to load account settings.');
        }
      }
    };

    loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  const onUpdateApiKeyLabel = async (label: string) => {
    try {
      await updateUserApiKeyLabel('user-default', label);
      setApiKeyLabel(label);
      triggerToast('API key label updated');
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Failed to update API key label.');
    }
  };

  const onUpdateNotificationPrefs = async (prefs: NotificationPrefs) => {
    try {
      await updateNotificationPreferences('user-default', prefs);
      setNotificationPrefs(prefs);
      triggerToast('Notification settings updated');
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Failed to update notification settings.');
    }
  };

  const onUpdateAccount = async (name: string, email: string) => {
    try {
      await updateAccountDetails('user-default', name, email);
      setAccountName(name);
      setAccountEmail(email);
      triggerToast('Account details updated');
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Failed to update account details.');
    }
  };

  return {
    aiConfigured, apiKeyLabel, notificationPrefs, accountName, accountEmail,
    onUpdateApiKeyLabel, onUpdateNotificationPrefs, onUpdateAccount,
  };
}
