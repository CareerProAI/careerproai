import React from 'react';
import ApplicationPackageModal from './ApplicationPackageModal';
import { useApplicationPackage } from '../hooks/useApplicationPackage';

interface AppApplicationPackageOverlayProps {
  applicationPackage: ReturnType<typeof useApplicationPackage>;
  setTab: (tab: string) => void;
}

export default function AppApplicationPackageOverlay({ applicationPackage, setTab }: AppApplicationPackageOverlayProps) {
  if (!applicationPackage.activeJob) return null;

  return (
    <ApplicationPackageModal
      job={applicationPackage.activeJob}
      data={applicationPackage.data}
      loading={applicationPackage.loading}
      error={applicationPackage.error}
      profileIncomplete={applicationPackage.profileIncomplete}
      onClose={applicationPackage.close}
      onRetry={applicationPackage.retry}
      onGoToProfile={() => {
        applicationPackage.close();
        setTab('resume');
      }}
    />
  );
}
