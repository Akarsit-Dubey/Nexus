import { create } from 'zustand';
import { GithubRepoItem, GithubActivityDay } from '@/types';
import { CURRENT_USER, INITIAL_REPOS, generateUserActivity } from '@/data/demo-data';
import { fetchGitHubProfile, processEventsToActivityDays, GitHubUserData } from '@/lib/github/client';

interface GithubState {
  username: string;
  user: GitHubUserData | null;
  repos: GithubRepoItem[];
  activity: GithubActivityDay[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  languageStats: Record<string, number>;

  fetchUserData: (username: string) => Promise<void>;
  disconnect: () => void;
  reconnectDefault: () => void;
}

function calculateLanguages(repos: GithubRepoItem[]): Record<string, number> {
  const stats: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      stats[repo.language] = (stats[repo.language] || 0) + 1;
    }
  });
  return stats;
}

export const useGithubStore = create<GithubState>((set, get) => ({
  username: CURRENT_USER.login,
  user: CURRENT_USER,
  repos: INITIAL_REPOS,
  activity: generateUserActivity(),
  isLoading: false,
  error: null,
  isConnected: true,
  languageStats: calculateLanguages(INITIAL_REPOS),

  fetchUserData: async (username: string) => {
    if (!username.trim()) return;
    set({ isLoading: true, error: null });

    try {
      const data = await fetchGitHubProfile(username);
      const activityDays =
        data.events && data.events.length > 0
          ? processEventsToActivityDays(data.events)
          : generateUserActivity();

      const langStats = calculateLanguages(data.repositories);

      set({
        username: data.user.login,
        user: data.user,
        repos: data.repositories.length > 0 ? data.repositories : INITIAL_REPOS,
        activity: activityDays,
        languageStats: Object.keys(langStats).length > 0 ? langStats : calculateLanguages(INITIAL_REPOS),
        isLoading: false,
        isConnected: true,
        error: null,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch GitHub data';
      set({
        isLoading: false,
        error: msg,
      });
    }
  },

  disconnect: () => {
    set({
      username: '',
      user: null,
      repos: [],
      activity: [],
      isConnected: false,
      error: null,
      languageStats: {},
    });
  },

  reconnectDefault: () => {
    set({
      username: CURRENT_USER.login,
      user: CURRENT_USER,
      repos: INITIAL_REPOS,
      activity: generateUserActivity(),
      isConnected: true,
      error: null,
      languageStats: calculateLanguages(INITIAL_REPOS),
    });
  },
}));
