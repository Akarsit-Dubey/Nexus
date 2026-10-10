import { create } from 'zustand';
import { UserSettings } from '@/types';

interface SettingsState {
  settings: UserSettings;
  resolvedTheme: 'dark' | 'light';
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  resetSettings: () => void;
  initializeSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  accent: 'cyan',
  githubUsername: 'Akarsit-Dubey',
  reducedMotion: false,
};

export function isThemeLight(theme: 'dark' | 'light' | 'system'): boolean {
  if (typeof window === 'undefined') return false;
  const isSystemLight =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches;
  return theme === 'light' || (theme === 'system' && isSystemLight);
}

export function applyTheme(theme: 'dark' | 'light' | 'system') {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const shouldBeLight = isThemeLight(theme);

  if (shouldBeLight) {
    root.classList.add('light-theme');
    root.classList.remove('dark');
  } else {
    root.classList.remove('light-theme');
    root.classList.add('dark');
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  resolvedTheme: 'dark',

  initializeSettings: () => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('nexus-settings');
      let currentTheme = get().settings.theme;
      if (saved) {
        const parsed = JSON.parse(saved);
        set((s) => ({ settings: { ...s.settings, ...parsed } }));
        if (parsed.theme) currentTheme = parsed.theme;
      }
      applyTheme(currentTheme);
      set({ resolvedTheme: isThemeLight(currentTheme) ? 'light' : 'dark' });

      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        const handleSystemChange = (e: MediaQueryListEvent) => {
          if (get().settings.theme === 'system') {
            applyTheme('system');
            set({ resolvedTheme: e.matches ? 'light' : 'dark' });
          }
        };
        mediaQuery.removeEventListener('change', handleSystemChange);
        mediaQuery.addEventListener('change', handleSystemChange);
      }
    } catch {
      // ignore
    }
  },

  updateSetting: (key, value) => {
    set((state) => {
      const newSettings = { ...state.settings, [key]: value };
      let newResolved = state.resolvedTheme;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('nexus-settings', JSON.stringify(newSettings));
          if (key === 'theme') {
            const th = value as 'dark' | 'light' | 'system';
            applyTheme(th);
            newResolved = isThemeLight(th) ? 'light' : 'dark';
          }
        } catch {
          // ignore
        }
      }
      return { settings: newSettings, resolvedTheme: newResolved };
    });
  },

  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS, resolvedTheme: 'dark' });
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('nexus-settings');
        applyTheme(DEFAULT_SETTINGS.theme);
      } catch {
        // ignore
      }
    }
  },
}));
