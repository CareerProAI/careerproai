import React from 'react';
import SideNavItem from './SideNavItem';
import { navMenuItems } from '../data/navMenuItems';

interface SideNavBarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  isOpenMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  onTriggerAnalyze: () => void;
}

export default function SideNavBar({
  currentTab,
  setTab,
  isOpenMobile,
  setOpenMobile,
  onTriggerAnalyze,
}: SideNavBarProps) {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpenMobile && (
        <button
          id="sidebar-overlay"
          aria-label="Close menu"
          className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-default"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* Sidebar container */}
      <nav
        id="side-nav"
        className={`fixed h-full w-[280px] left-0 top-0 bg-surface-container border-r border-outline-variant shadow-sm flex flex-col py-6 z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight">TalentAI</h1>
            <p className="text-xs text-on-surface-variant font-medium tracking-wider uppercase mt-1">Enterprise Suite</p>
          </div>
          {/* Close button for mobile */}
          <button
            id="close-sidebar-mobile"
            className="md:hidden p-1 rounded-full hover:bg-surface-variant text-on-surface-variant"
            onClick={() => setOpenMobile(false)}
            aria-label="Close menu"
          >
            <span aria-hidden="true" className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto px-2">
          {navMenuItems.map((item) => (
            <SideNavItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              isActive={currentTab === item.id}
              onClick={() => {
                setTab(item.id);
                setOpenMobile(false);
              }}
            />
          ))}
        </div>

        {/* CTA Button at Bottom */}
        <div className="px-4 mt-auto">
          <button
            id="cta-analyze-resume"
            onClick={() => {
              onTriggerAnalyze();
              setOpenMobile(false);
            }}
            className="w-full bg-primary text-on-primary py-3 rounded-full font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-primary/95 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">psychology</span>
            Analyze Resume
          </button>
        </div>
      </nav>
    </>
  );
}
