export type ColorSchemePreference = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'talentai-color-scheme';

export function preferenceFromStorage(raw: string | null): ColorSchemePreference {
  if (raw === 'light' || raw === 'dark') return raw;
  return 'system';
}

export function isDarkFromPreference(pref: ColorSchemePreference, systemDark: boolean): boolean {
  if (pref === 'system') return systemDark;
  return pref === 'dark';
}

export function metaContentForPreference(pref: ColorSchemePreference): string {
  return pref === 'system' ? 'light dark' : pref;
}
