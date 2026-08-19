import { useState, useEffect } from 'react';
import { fetchAllProfiles, deleteResume } from '../api';
import { ResumeProfile } from '../types';
import { addSkillToProfile, mergeProfileUpdate } from '../utils/resumeProfileUpdates';

export function useResumeProfiles(triggerToast: (msg: string) => void, addLog: (text: string) => void) {
  const [profiles, setProfiles] = useState<ResumeProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<ResumeProfile | null>(null);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Bootstrap resume profiles from the server-persisted backend (talentai.db).
  useEffect(() => {
    let cancelled = false;

    const loadProfiles = async () => {
      setIsLoadingProfiles(true);
      setLoadError(null);
      try {
        // Single batch request replaces the previous 1+N pattern
        // (list fetch + N individual detail fetches).
        const fullProfiles = await fetchAllProfiles();
        if (cancelled) return;
        setProfiles(fullProfiles);
        setCurrentProfile(fullProfiles[0] ?? null);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load CVs from the server.');
        }
      } finally {
        if (!cancelled) setIsLoadingProfiles(false);
      }
    };

    loadProfiles();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retryLoad = () => setReloadKey((k) => k + 1);

  const onSelectProfile = (profile: ResumeProfile) => {
    setCurrentProfile(profile);
    triggerToast(`Switched active profile to ${profile.candidateName}`);
  };

  const onDeleteProfile = async (profileId: string) => {
    try {
      await deleteResume(profileId);
      const updated = profiles.filter((p) => p.id !== profileId);
      setProfiles(updated);
      if (currentProfile?.id === profileId) {
        setCurrentProfile(updated[0] ?? null);
      }
      triggerToast('CV deleted');
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Failed to delete CV.');
    }
  };

  const onUploadNewProfile = (newProfile: ResumeProfile) => {
    setProfiles((prev) => [newProfile, ...prev]);
    setCurrentProfile(newProfile);
    addLog(`Analyzed CV "${newProfile.fileName}"`);
  };

  const onAddSkill = (skill: string) => {
    if (!currentProfile) return;
    const updatedProfile = addSkillToProfile(currentProfile, skill);
    setProfiles((prev) => prev.map((p) => (p.id === currentProfile.id ? updatedProfile : p)));
    setCurrentProfile(updatedProfile);
    addLog(`Studied and mastered skill "${skill}" (+3 Pts)`);
  };

  const onUpdateProfile = (updated: Partial<ResumeProfile>) => {
    if (!currentProfile) return;
    const updatedProfile = mergeProfileUpdate(currentProfile, updated);
    setProfiles((prev) => prev.map((p) => (p.id === currentProfile.id ? updatedProfile : p)));
    setCurrentProfile(updatedProfile);
  };

  return {
    profiles, currentProfile, isLoadingProfiles, loadError, retryLoad,
    onSelectProfile, onDeleteProfile, onUploadNewProfile, onAddSkill, onUpdateProfile,
  };
}
