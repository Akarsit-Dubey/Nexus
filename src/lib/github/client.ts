import { GithubRepoItem, GithubActivityDay } from '@/types';

export interface GitHubUserData {
  login: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  company?: string;
  location?: string;
  blog?: string;
}

export interface GitHubApiResponse {
  user: GitHubUserData;
  repositories: GithubRepoItem[];
  events: Array<{ type: string; createdAt: string; repoName: string }>;
}

export async function fetchGitHubProfile(username: string): Promise<GitHubApiResponse> {
  const res = await fetch(`/api/github?username=${encodeURIComponent(username.trim())}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch GitHub data');
  }
  return data;
}

// Convert GitHub events to activity days heatmap
export function processEventsToActivityDays(
  events: Array<{ type: string; createdAt: string }>
): GithubActivityDay[] {
  const countsByDate = new Map<string, number>();

  events.forEach((ev) => {
    const dateStr = ev.createdAt.split('T')[0];
    countsByDate.set(dateStr, (countsByDate.get(dateStr) || 0) + 1);
  });

  const days: GithubActivityDay[] = [];
  const today = new Date();

  // 52 weeks (364 days)
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = countsByDate.get(dateStr) || 0;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 5) level = 4;
    else if (count >= 3) level = 3;
    else if (count >= 2) level = 2;
    else if (count >= 1) level = 1;

    days.push({ date: dateStr, count, level });
  }

  return days;
}
