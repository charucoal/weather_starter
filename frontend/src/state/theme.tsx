import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface ThemeDefinition {
  id: string;
  label: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'nordic', label: 'Nordic Minimal' },
];

const STORAGE_KEY = 'weather-starter:theme';
const DEFAULT_THEME_ID = 'apple';

interface ThemeContextValue {
  themeId: string;
  themes: ThemeDefinition[];
  setThemeId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isKnownThemeId(id: string | null): id is string {
  return THEMES.some((theme) => theme.id === id);
}

function readStoredThemeId(): string {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isKnownThemeId(stored) ? stored : DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>(() => readStoredThemeId());

  useEffect(() => {
    document.documentElement.dataset.theme = themeId;
    try {
      window.localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      // localStorage unavailable (e.g. private mode) - theme still applies for this session
    }
  }, [themeId]);

  const setThemeId = (id: string) => {
    if (isKnownThemeId(id)) setThemeIdState(id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, themes: THEMES, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
