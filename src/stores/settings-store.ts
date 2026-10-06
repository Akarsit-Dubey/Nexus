import { create } from 'zustand';
import { UserSettings } from '@/types';

interface SettingsState {
  settings: UserSettings;
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

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,

  initializeSettings: () => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('nexus-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        set((s) => ({ settings: { ...s.settings, ...parsed } }));
        const root = document.documentElement;
        if (parsed.theme === 'light') {
          root.classList.add('light-theme');
          root.classList.remove('dark');
        } else {
          root.classList.remove('light-theme');
          root.classList.add('dark');
        }
      }
    } catch {
      // ignore
    }
  },

  updateSetting: (key, value) => {
    set((state) => {
      const newSettings = { ...state.settings, [key]: value };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('nexus-settings', JSON.stringify(newSettings));
          if (key === 'theme') {
            const root = document.documentElement;
            if (value === 'light') {
              root.classList.add('light-theme');
              root.classList.remove('dark');
            } else {
              root.classList.remove('light-theme');
              root.classList.add('dark');
            }
          }
        } catch {
          // ignore
        }
      }
      return { settings: newSettings };
    });
  },

  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS });
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('nexus-settings');
        document.documentElement.classList.remove('light-theme');
        document.documentElement.classList.add('dark');
      } catch {
        // ignore
      }
    }
  },
}));
