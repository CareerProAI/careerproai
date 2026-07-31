import React from 'react';
import { ResumeProfile } from '../types';

const profileAvatars: Record<string, string> = {
  'profile-sarah': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzldhp0wg1TjFAOvY6sqW1zLIXcLp8OiH-oueIPrdpdp0HsfgxrHuO2QGaDE1HxOATT5dtNe7j6MYe8pGUAKblCQgcSuplaidFxi7osQDwg_HufSb2KdqS-T1-YVzn1TZIRCV33-AjhsvaLU2gW2d6S1gk0fZFc0e92YJjTtawXQLNWFM_0_xGwKl6cy6udyxLt4YWEhSmuQcvqta5irIvqdTKggknD2NYnTcbxDUaKLtSqE9MEJZGJYjcsJsMI0cp_T9nbv3apuFV',
  'profile-alex': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwPV-c_BQSan6Z2Ps5GsMwcb1hzG7sAn90K2NozKKyfkX-DY-w5EPjjg5UV8TQ0ybddJvdXQ_JIFAyiH5t_fGdUmzEy56AoFlpmuWRFg_0ncMq3tb4avqAkolBthklaeWkktzoxj1raKuEECyHZK3ikMTsFsADjHPP3LjHhqp07M0ao4Sh7d44_nxiUSyMwK-lfXmSeohxykvfrduKpI3pncrkZE1HtWTT1hTwPlA7Be41Dltr57qZraPonL9sztteuujAlqWWMcvF',
  'profile-john': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHLao3EcZUcM5OuPq4rwAifRA7cgIssgYE0HqN35AdCxHGlvHsz8VZGul3XfaDxodu7F6WSvB3wVyhJSpPz24-IBl6yq2pKlA1PP3fGjT_-BBW1maz2z2kZUwcWZtVzXtvDs6diM5FI-o3FwR9fZB51bCX2GHy7-strW_ZiAvy6SoNk8-RiA8hIemErWCVBpqnghryseQwQkGtJQBHHRWBxeg-Tq8gg1Me5rJqP3oN4JsSinfn-u-OzxqmuNvDErZmfNvXITaa6kMH'
};

function getProfileNameAbbr(name: string) {
  return name.split(' ').map((n) => n[0]).join('');
}

interface ProfileSwitcherDropdownProps {
  profiles: ResumeProfile[];
  currentProfile: ResumeProfile;
  onSelectProfile: (profile: ResumeProfile) => void;
  showDropdown: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function ProfileSwitcherDropdown({
  profiles,
  currentProfile,
  onSelectProfile,
  showDropdown,
  onToggle,
  onClose,
}: ProfileSwitcherDropdownProps) {
  return (
    <div className="relative ml-2">
      <button
        id="btn-profile-avatar"
        onClick={onToggle}
        className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary cursor-pointer transition-all flex items-center justify-center bg-primary/10"
      >
        {profileAvatars[currentProfile.id] ? (
          <img
            src={profileAvatars[currentProfile.id]}
            alt={currentProfile.candidateName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-xs font-bold text-primary">{getProfileNameAbbr(currentProfile.candidateName)}</span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-surface-container border border-outline-variant rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 border-b border-outline-variant/60">
            <p className="font-semibold text-xs text-on-surface-variant uppercase tracking-wider">Switch Profile</p>
          </div>
          <div className="py-1">
            {profiles.map((p) => (
              <button
                key={p.id}
                id={`btn-switch-to-${p.id}`}
                onClick={() => {
                  onSelectProfile(p);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs transition-colors hover:bg-surface-container-low ${
                  p.id === currentProfile.id ? 'bg-primary/5 font-semibold text-primary' : 'text-on-surface'
                }`}
              >
                <div className="h-7 w-7 rounded-full overflow-hidden flex items-center justify-center bg-primary/10 border border-primary/10">
                  {profileAvatars[p.id] ? (
                    <img src={profileAvatars[p.id]} alt={p.candidateName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[10px] font-bold text-primary">{getProfileNameAbbr(p.candidateName)}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-on-surface">{p.candidateName}</p>
                  <p className="text-[10px] text-on-surface-variant">{p.currentRole}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
