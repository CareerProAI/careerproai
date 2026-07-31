import { ResumeProfile, Job, Application, ActivityLog, NotificationPrefs } from './types';

export interface ActiveViewRouterProps {
  tab: string;
  setTab: (tab: string) => void;
  currentProfile: ResumeProfile;
  profiles: ResumeProfile[];
  jobs: Job[];
  jobsLoading: boolean;
  jobsError: string | null;
  onRetryJobs: () => void;
  applications: Application[];
  activityLogs: ActivityLog[];
  savedJobIds: string[];
  searchQuery: string;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  aiConfigured: boolean | null;
  apiKeyLabel: string;
  notificationPrefs: NotificationPrefs;
  accountName: string;
  accountEmail: string;
  onSelectProfile: (profile: ResumeProfile) => void;
  onDeleteProfile: (profileId: string) => void;
  onUploadNewProfile: (newProfile: ResumeProfile) => void;
  onAddSkill: (skill: string) => void;
  onUpdateProfile: (updated: Partial<ResumeProfile>) => void;
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  onUpdateStatus: (id: string, newStatus: Application['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onResetState: () => void;
  onUpdateApiKeyLabel: (label: string) => void;
  onUpdateNotificationPrefs: (prefs: NotificationPrefs) => void;
  onUpdateAccount: (name: string, email: string) => void;
}
