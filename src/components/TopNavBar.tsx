import React, { useState } from 'react';
import { ResumeProfile } from '../types';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileSwitcherDropdown from './ProfileSwitcherDropdown';
import TopNavSearchBar from './TopNavSearchBar';

interface TopNavBarProps {
  onMenuClick: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  profiles: ResumeProfile[];
  currentProfile: ResumeProfile | null;
  onSelectProfile: (profile: ResumeProfile) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function TopNavBar({
  onMenuClick,
  darkMode,
  setDarkMode,
  profiles,
  currentProfile,
  onSelectProfile,
  searchQuery,
  setSearchQuery,
}: TopNavBarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
  };

  return (
    <header
      id="top-nav"
      className="fixed top-0 right-0 left-0 md:left-[280px] h-16 bg-surface/80 dark:bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-6 z-40 transition-all duration-200"
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          id="btn-hamburger-mobile"
          className="md:hidden text-on-surface-variant p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <span aria-hidden="true" className="material-symbols-outlined">menu</span>
        </button>

        <TopNavSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <div className="flex items-center gap-2">
        <NotificationsDropdown
          showNotifications={showNotifications}
          onToggle={() => {
            setShowNotifications(!showNotifications);
            setShowDropdown(false);
          }}
        />

        <button
          id="btn-toggle-dark-mode"
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span aria-hidden="true" className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
        </button>

        {currentProfile && (
          <ProfileSwitcherDropdown
            profiles={profiles}
            currentProfile={currentProfile}
            onSelectProfile={onSelectProfile}
            showDropdown={showDropdown}
            onToggle={() => {
              setShowDropdown(!showDropdown);
              setShowNotifications(false);
            }}
            onClose={() => setShowDropdown(false)}
          />
        )}
      </div>
    </header>
  );
}
