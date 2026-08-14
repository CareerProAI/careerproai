import { useCallback, useEffect, useState } from 'react';
import {
  THEME_STORAGE_KEY,
  isDarkFromPreference,
  metaContentForPreference,
  preferenceFromStorage,
  type ColorSchemePreference,
} from '../utils/colorScheme';

function systemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyPreference(pref: ColorSchemePreference): boolean {
  const dark = isDarkFromPreference(pref, systemDark());
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.classList.toggle('light', !dark);
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.setAttribute('content', metaContentForPreference(pref));
  return dark;
}

export function useDarkMode() {
  const [pref, setPref] = useState<ColorSchemePreference>(() =>
    preferenceFromStorage(localStorage.getItem(THEME_STORAGE_KEY)),
  );
  const [darkMode, setDarkModeState] = useState(() => isDarkFromPreference(pref, systemDark()));

  useEffect(() => {
    setDarkModeState(applyPreference(pref));
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setDarkModeState(applyPreference(pref));
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [pref]);

  const setDarkMode = useCallback((nextDark: boolean) => {
    const next: ColorSchemePreference = nextDark ? 'dark' : 'light';
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setPref(next);
  }, []);

  return { darkMode, setDarkMode };
}
