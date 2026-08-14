import React, { useState } from 'react';
import { useAppToast } from './hooks/useAppToast';
import { useDarkMode } from './hooks/useDarkMode';
import { useActivityLog } from './hooks/useActivityLog';
import { useResumeProfiles } from './hooks/useResumeProfiles';
import { useSavedJobs } from './hooks/useSavedJobs';
import { useApplications } from './hooks/useApplications';
import { useAccountSettings } from './hooks/useAccountSettings';
import { useJobListings } from './hooks/useJobListings';
import { useApplicationPackage } from './hooks/useApplicationPackage';
import SideNavBar from './components/SideNavBar';
import TopNavBar from './components/TopNavBar';
import ResumeBootstrapGate from './components/ResumeBootstrapGate';
import ActiveViewRouter from './ActiveViewRouter';
import AppApplicationPackageOverlay from './components/AppApplicationPackageOverlay';
import Toast from './components/ui/Toast';
import SkipToContent from './components/SkipToContent';

export default function App() {
  const [tab, setTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const { toast: appToast, triggerToast } = useAppToast();
  const { darkMode, setDarkMode } = useDarkMode();
  const { activityLogs, addLog, resetLogs } = useActivityLog();
  const resumeProfiles = useResumeProfiles(triggerToast, addLog);
  const savedJobs = useSavedJobs(resumeProfiles.currentProfile?.id, triggerToast);
  const applicationsState = useApplications(triggerToast);
  const accountSettings = useAccountSettings(triggerToast);
  const jobsState = useJobListings(resumeProfiles.currentProfile, accountSettings.aiConfigured);
  const applicationPackage = useApplicationPackage(resumeProfiles.currentProfile);

  const handleResetState = () => {
    applicationsState.resetApplications();
    resetLogs();
    triggerToast('Sandbox reset successfully');
  };

  return (
    <div id="app-layout" className="min-h-screen bg-background text-on-background font-sans">
      <SkipToContent />
      <SideNavBar
        currentTab={tab}
        setTab={setTab}
        isOpenMobile={isOpenMobile}
        setOpenMobile={setIsOpenMobile}
        onTriggerAnalyze={() => setTab('resume')}
      />

      <div id="main-workspace" className="md:pl-[280px] min-h-screen flex flex-col">
        <TopNavBar
          onMenuClick={() => setIsOpenMobile(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          profiles={resumeProfiles.profiles}
          currentProfile={resumeProfiles.currentProfile}
          onSelectProfile={resumeProfiles.onSelectProfile}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main id="content-container" tabIndex={-1} className="flex-1 px-6 py-8 mt-16 max-w-7xl mx-auto w-full">
          <ResumeBootstrapGate {...resumeProfiles} tab={tab} setTab={setTab} onRetryLoad={resumeProfiles.retryLoad}>
            {(currentProfile) => (
              <ActiveViewRouter
                {...resumeProfiles}
                {...savedJobs}
                {...applicationsState}
                {...accountSettings}
                tab={tab}
                setTab={setTab}
                currentProfile={currentProfile}
                onApplyJob={applicationPackage.openFor}
                jobs={jobsState.jobs}
                jobsLoading={jobsState.jobsLoading}
                jobsError={jobsState.jobsError}
                onRetryJobs={jobsState.retryJobs}
                searchQuery={searchQuery}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                activityLogs={activityLogs}
                onResetState={handleResetState}
              />
            )}
          </ResumeBootstrapGate>
        </main>
      </div>

      {appToast && <Toast message={appToast} />}

      <AppApplicationPackageOverlay applicationPackage={applicationPackage} setTab={setTab} />
    </div>
  );
}
