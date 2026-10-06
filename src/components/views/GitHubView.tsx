'use client';

import React, { useState } from 'react';
import { useGithubStore } from '@/stores/github-store';
import { useProjectStore } from '@/stores/project-store';
import {
  GitFork,
  Star,
  ExternalLink,
  RefreshCw,
  Activity,
  Users,
  MapPin,
  Calendar,
  AlertCircle,
  Search,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { formatDate, formatCompactNumber, cn } from '@/lib/utils';

export const GitHubView = () => {
  const {
    username,
    user,
    repos,
    activity,
    isLoading,
    error,
    isConnected,
    languageStats,
    fetchUserData,
    disconnect,
    reconnectDefault,
  } = useGithubStore();

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [switchUsername, setSwitchUsername] = useState('');
  const [repoSearch, setRepoSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  // Group activity into 52 weeks
  const weeks: Array<typeof activity> = [];
  for (let i = 0; i < activity.length; i += 7) {
    weeks.push(activity.slice(i, i + 7));
  }

  const totalContributions = activity.reduce((sum, d) => sum + d.count, 0);

  // Filter repositories
  const filteredRepos = repos.filter((r) => {
    const matchesSearch = repoSearch
      ? r.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(repoSearch.toLowerCase()))
      : true;
    const matchesLang = selectedLanguage ? r.language === selectedLanguage : true;
    return matchesSearch && matchesLang;
  });

  const handleSwitchAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (switchUsername.trim()) {
      await fetchUserData(switchUsername.trim());
      setShowSwitchModal(false);
      setSwitchUsername('');
    }
  };

  const totalLangRepos = Object.values(languageStats).reduce((a, b) => a + b, 0) || 1;

  if (!isConnected) {
    return (
      <div className="relative z-10 min-h-0 flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/30">
          <GitFork className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold dark:text-white text-slate-900">GitHub Disconnected</h2>
        <p className="text-xs dark:text-slate-400 text-slate-600">
          Connect your GitHub account to sync your repositories, contribution activity, and primary languages.
        </p>
        <button
          onClick={reconnectDefault}
          className="py-2 px-5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md shadow-amber-500/20"
        >
          Connect @Akarsit-Dubey
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-0 flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* 1. Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://avatars.githubusercontent.com/u/126861101?v=4'}
            alt={user?.name || username}
            className="h-16 w-16 rounded-2xl border-2 border-slate-200 dark:border-slate-700 object-cover shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold dark:text-white text-slate-900">{user?.name || username}</h1>
              <a
                href={user?.htmlUrl || `https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono dark:text-slate-400 text-slate-500 hover:text-amber-500 transition-colors"
              >
                @{username}
              </a>
            </div>

            {user?.bio && <p className="text-xs dark:text-slate-300 text-slate-600 mt-1 max-w-xl">{user.bio}</p>}

            <div className="flex flex-wrap items-center gap-4 text-xs dark:text-slate-400 text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span><strong className="dark:text-slate-200 text-slate-800">{user?.followers ?? 5}</strong> followers</span>
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="h-3.5 w-3.5 text-slate-400" />
                <span><strong className="dark:text-slate-200 text-slate-800">{repos.length}</strong> public repositories</span>
              </span>
              {user?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{user.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Account Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => fetchUserData(username)}
            disabled={isLoading}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowSwitchModal(true)}
            className="py-1.5 px-3 rounded-lg text-xs font-medium dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Switch Account
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Language Distribution Bar */}
      <div className="rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200/90 dark:border-slate-800 p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold dark:text-white text-slate-900">Repository Languages</span>
          <span className="dark:text-slate-400 text-slate-500 font-mono text-[11px]">{Object.keys(languageStats).length} tracked</span>
        </div>

        {/* Multi-segmented bar */}
        <div className="h-2 w-full overflow-hidden rounded-full dark:bg-slate-800 bg-slate-100 flex">
          {Object.entries(languageStats).map(([lang, count], idx) => {
            const pct = Math.round((count / totalLangRepos) * 100);
            const colors = ['#38bdf8', '#fbbf24', '#f43f5e', '#10b981', '#a855f7'];
            const bg = colors[idx % colors.length];

            return (
              <div
                key={lang}
                style={{ width: `${pct}%`, backgroundColor: bg }}
                title={`${lang}: ${pct}%`}
                className="h-full transition-all"
              />
            );
          })}
        </div>

        {/* Language pills */}
        <div className="flex flex-wrap gap-3 pt-1">
          {Object.entries(languageStats).map(([lang, count], idx) => {
            const colors = ['#38bdf8', '#fbbf24', '#f43f5e', '#10b981', '#a855f7'];
            const color = colors[idx % colors.length];
            const isFilterActive = selectedLanguage === lang;

            return (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(isFilterActive ? null : lang)}
                className={cn(
                  'flex items-center gap-1.5 text-xs transition-colors cursor-pointer',
                  isFilterActive
                    ? 'font-bold dark:text-white text-slate-950 underline underline-offset-4'
                    : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                <span>{lang}</span>
                <span className="font-mono text-[10px] dark:text-slate-500 text-slate-400">({count})</span>
              </button>
            );
          })}
          {selectedLanguage && (
            <button
              onClick={() => setSelectedLanguage(null)}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* 3. 52-Week Contribution Activity */}
      <div className="rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold dark:text-white text-slate-900">Verified Activity Timeline</h2>
            <p className="text-xs dark:text-slate-400 text-slate-500">
              {totalContributions} contributions in the last year
            </p>
          </div>

          {hoveredDay && (
            <div className="px-3 py-1 rounded-lg dark:bg-slate-800 bg-amber-50 border border-amber-200 dark:border-slate-700 text-xs font-mono text-amber-800 dark:text-amber-300">
              {hoveredDay.count} activities on {formatDate(hoveredDay.date)}
            </div>
          )}
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          <div className="inline-flex gap-1.5 min-w-[700px]">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => {
                  let bg = 'dark:bg-slate-900 dark:border-slate-800/80 bg-slate-100 border-slate-200/70';
                  if (day.level === 1) bg = 'dark:bg-amber-950/70 dark:border-amber-900 bg-amber-100 border-amber-200';
                  if (day.level === 2) bg = 'dark:bg-amber-700/70 dark:border-amber-600 bg-amber-300 border-amber-400';
                  if (day.level === 3) bg = 'dark:bg-amber-500 dark:border-amber-400 bg-amber-500 border-amber-600';
                  if (day.level === 4) bg = 'dark:bg-amber-400 dark:border-amber-300 bg-amber-600 border-amber-700 shadow-xs shadow-amber-400/30';

                  return (
                    <div
                      key={day.date}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={cn(
                        'h-3 w-3 rounded-[2.5px] border cursor-pointer transition-transform hover:scale-125',
                        bg
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Repository List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold dark:text-white text-slate-900">
            Repositories ({filteredRepos.length})
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={repoSearch}
              onChange={(e) => setRepoSearch(e.target.value)}
              className="w-full rounded-xl dark:bg-slate-900 bg-white pl-9 pr-3 py-1.5 text-xs dark:text-white text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-800 shadow-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="flex flex-col justify-between rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200/90 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold dark:text-white text-slate-900 hover:text-amber-600 dark:hover:text-amber-300 transition-colors truncate">
                    {repo.name}
                  </h3>
                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <p className="mt-1.5 text-xs dark:text-slate-300 text-slate-600 line-clamp-2 leading-relaxed">
                  {repo.description || 'Public software repository.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-mono text-[11px] font-semibold">
                    <Star className="h-3 w-3 fill-amber-500 dark:fill-amber-400" />
                    <span>{formatCompactNumber(repo.stars)}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    <GitFork className="h-3 w-3" />
                    <span>{repo.forks}</span>
                  </span>
                </div>

                {repo.language && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                    {repo.language}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Switch Account Modal (Secondary) */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSwitchAccount}
            className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200 dark:border-slate-700 p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-base font-bold dark:text-white text-slate-900">Switch GitHub Account</h3>
            <p className="text-xs dark:text-slate-400 text-slate-600">
              Enter any public GitHub username to load its repositories and contribution timeline.
            </p>
            <input
              type="text"
              required
              placeholder="e.g. torvalds"
              value={switchUsername}
              onChange={(e) => setSwitchUsername(e.target.value)}
              className="w-full rounded-xl dark:bg-slate-900 bg-slate-50 px-3 py-2 text-xs dark:text-white text-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSwitchModal(false)}
                className="py-1.5 px-3 rounded-lg text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Load Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
