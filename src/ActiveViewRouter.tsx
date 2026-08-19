import React from 'react';
import { ActiveViewRouterProps } from './ActiveViewRouterProps';
import DashboardView from './components/DashboardView';
import ResumeView from './components/ResumeView';
import JobSearchView from './components/JobSearchView';
import ApplicationsView from './components/ApplicationsView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import CustomizedResumeView from './components/CustomizedResumeView';

export default function ActiveViewRouter(props: ActiveViewRouterProps) {
  const { tab } = props;

  // Note: components below are spread `{...props}` where their prop names happen to
  // match ActiveViewRouterProps field names exactly (verified against each component's
  // own props interface) — excess unrelated props are harmless via spread.
  switch (tab) {
    case 'dashboard':
      return <DashboardView {...props} />;
    case 'resume':
      return <ResumeView {...props} />;
    case 'customized-cv':
      return <CustomizedResumeView currentProfile={props.currentProfile} onUploadNewProfile={props.onUploadNewProfile} />;
    case 'jobs':
    case 'ai-matching':
      return <JobSearchView key={tab} {...props} initialTabFilter={tab === 'ai-matching' ? 'recommended' : 'all'} />;
    case 'applications':
      return <ApplicationsView {...props} />;
    case 'analytics':
      return <AnalyticsView {...props} />;
    case 'settings':
      return <SettingsView {...props} />;
    default:
      return null;
  }
}
