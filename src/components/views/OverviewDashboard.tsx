'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGithubStore } from '@/stores/github-store';
import { useProjectStore } from '@/stores/project-store';
import { useGoalStore } from '@/stores/goal-store';
import { useUniverseStore } from '@/stores/universe-store';
import { getTimeGreeting, formatDate, formatCompactNumber, cn } from '@/lib/utils';
import {
  Compass,
  Briefcase,
  GitFork,
  Target,
  ArrowRight,
  Star,
  Activity,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { NexusLogo } from '@/components/brand/NexusLogo';

export const OverviewDashboard = () => {
  const router = useRouter();
  const user = useGithubStore((s) => s.user);
  const repos = useGithubStore((s) => s.repos);
  const activity = useGithubStore((s) => s.activity);
  const projects = useProjectStore((s) => s.projects);
  const goals = useGoalStore((s) => s.goals);
  const { enterFocusMode } = useUniverseStore();

  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  const greeting = getTimeGreeting();
  const displayName = user?.name || user?.login || 'Akarsit Dubey';
  const totalContributions = activity.reduce((sum, d) => sum + d.count, 0);
  const activeGoalsCount = goals.filter((g) => g.status === 'active').length;

  // 52 weeks grouped
  const weeks: Array<typeof activity> = [];
  for (let i = 0; i < activity.length; i += 7) {
    weeks.push(activity.slice(i, i + 7));
  }

  const handleFocusProject = (projectId: string) => {
    enterFocusMode(projectId);
    router.push('/universe');
  };

  return (
    <div className="relative z-10 min-h-0 flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* 1. HEADER: Personalized Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b dark:border-slate-800/80 border-slate-200">
        <div className="flex items-center gap-3.5 sm:gap-4">
          {user?.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={displayName}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border-2 dark:border-slate-700/80 border-slate-300 object-cover shadow-md"
            />
          )}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight dark:text-white text-slate-900">
              {greeting}, {displayName}
            </h1>
            <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 mt-0.5 sm:mt-1">
              Your personal developer command center at a glance.
            </p>
          </div>
        </div>

        <Link
          href="/universe"
          className="flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20 transition-all shrink-0"
        >
          <Compass className="h-4 w-4" />
          <span>Explore Universe Graph</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2. STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Stat */}
        <Link
          href="/projects"
          className="group rounded-2xl dark:bg-[#0c101c] bg-white border dark:border-slate-800 border-slate-200/90 p-5 hover:border-purple-500/50 dark:hover:bg-[#101222] hover:bg-purple-50/30 transition-all shadow-xs dark:shadow-md"
        >
          <div className="flex items-center justify-between dark:text-slate-400 text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Projects</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg dark:bg-purple-500/10 dark:text-purple-400 bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold dark:text-white text-slate-900 font-mono">{projects.length}</div>
          <div className="mt-1 text-[11px] dark:text-slate-400 text-slate-500">Active software workspaces</div>
        </Link>

        {/* Repositories Stat */}
        <Link
          href="/github"
          className="group rounded-2xl dark:bg-[#0c101c] bg-white border dark:border-slate-800 border-slate-200/90 p-5 hover:border-amber-500/50 dark:hover:bg-[#141208] hover:bg-amber-50/30 transition-all shadow-xs dark:shadow-md"
        >
          <div className="flex items-center justify-between dark:text-slate-400 text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Repositories</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg dark:bg-amber-500/10 dark:text-amber-400 bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <GitFork className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold dark:text-white text-slate-900 font-mono">{repos.length}</div>
          <div className="mt-1 text-[11px] dark:text-slate-400 text-slate-500">Public GitHub repositories</div>
        </Link>

        {/* Contributions Stat */}
        <div className="rounded-2xl dark:bg-[#0c101c] bg-white border dark:border-slate-800 border-slate-200/90 p-5 shadow-xs dark:shadow-md">
          <div className="flex items-center justify-between dark:text-slate-400 text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Contributions</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg dark:bg-emerald-500/10 dark:text-emerald-400 bg-emerald-50 text-emerald-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold dark:text-white text-slate-900 font-mono">{totalContributions}</div>
          <div className="mt-1 text-[11px] dark:text-slate-400 text-slate-500">Past 52 weeks activity</div>
        </div>

        {/* Active Goals Stat */}
        <Link
          href="/goals"
          className="group rounded-2xl dark:bg-[#0c101c] bg-white border dark:border-slate-800 border-slate-200/90 p-5 hover:border-rose-500/50 dark:hover:bg-[#160c12] hover:bg-rose-50/30 transition-all shadow-xs dark:shadow-md"
        >
          <div className="flex items-center justify-between dark:text-slate-400 text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Goals</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg dark:bg-rose-500/10 dark:text-rose-400 bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold dark:text-white text-slate-900 font-mono">{activeGoalsCount}</div>
          <div className="mt-1 text-[11px] dark:text-slate-400 text-slate-500">Target milestones tracked</div>
        </Link>
      </div>

      {/* 3. GITHUB CONTRIBUTION ACTIVITY */}
      <div className="rounded-2xl dark:bg-[#0c101c] bg-white border dark:border-slate-800 border-slate-200/90 p-5 sm:p-6 shadow-xs dark:shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold dark:text-white text-slate-900">GitHub Contribution Activity</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30 text-emerald-700 bg-emerald-50 border border-emerald-200">
                Connected
              </span>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
              Verified commit activity for @{user?.login || 'Akarsit-Dubey'} across the year.
            </p>
          </div>

          {hoveredDay ? (
            <div className="px-3 py-1 rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-emerald-300 bg-slate-100 border border-slate-200 text-xs font-mono text-emerald-700 shadow-xs">
              {hoveredDay.count} contributions on {formatDate(hoveredDay.date)}
            </div>
          ) : (
            <div className="text-xs dark:text-slate-500 text-slate-400 font-mono">
              Hover over days to inspect
            </div>
          )}
        </div>

        {/* Heatmap Matrix */}
        <div className="overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          <div className="inline-flex gap-1.5 min-w-[700px]">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => {
                  let bg = 'dark:bg-slate-900 bg-slate-100 dark:border-slate-800/80 border-slate-200/90';
                  if (day.level === 1) bg = 'dark:bg-emerald-950/80 bg-emerald-200 dark:border-emerald-900 border-emerald-300';
                  if (day.level === 2) bg = 'dark:bg-emerald-800/80 bg-emerald-400 dark:border-emerald-700 border-emerald-500';
                  if (day.level === 3) bg = 'dark:bg-emerald-600 bg-emerald-600 dark:border-emerald-500 border-emerald-700';
                  if (day.level === 4) bg = 'dark:bg-emerald-400 bg-emerald-700 dark:border-emerald-300 border-emerald-800 shadow-xs';

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

      {/* 4. RECENT PROJECTS & UNIVERSE PREVIEW (Side by side) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold dark:text-white text-slate-900">Active Software Projects</h2>
            <Link
              href="/projects"
              className="text-xs text-sky-500 hover:text-sky-400 font-semibold flex items-center gap-1"
            >
              <span>View all projects</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((proj) => (
              <div
                key={proj.id}
                className="group flex flex-col justify-between rounded-2xl dark:bg-[#0c101c] bg-white border dark:border-slate-800 border-slate-200/90 p-5 hover:border-purple-500/40 dark:hover:bg-[#0f1422] hover:bg-purple-50/20 transition-all shadow-xs dark:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/30 text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {proj.status}
                    </span>
                    <span className="font-mono text-xs dark:text-slate-300 text-slate-600 font-medium">
                      {proj.progress}%
                    </span>
                  </div>

                  <h3 className="text-base font-bold dark:text-white text-slate-900 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="mt-1 text-xs dark:text-slate-300 text-slate-600 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {proj.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] dark:bg-slate-800/80 dark:text-slate-300 bg-slate-100 text-slate-700 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleFocusProject(proj.id)}
                    className="flex items-center gap-1 text-[11px] text-sky-500 hover:text-sky-400 font-semibold transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>Focus in Universe</span>
                  </button>

                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="dark:text-slate-400 dark:hover:text-white text-slate-500 hover:text-slate-900"
                    >
                      <GitFork className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Small Curated Universe Preview (1 col) */}
        <div className="rounded-2xl dark:bg-[#0c101c] bg-white border dark:border-slate-800 border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between shadow-xs dark:shadow-md">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-2">
              <NexusLogo className="h-4 w-4" />
              <span>Universe Snapshot</span>
            </div>
            <h2 className="text-lg font-bold dark:text-white text-slate-900">Interactive Graph Preview</h2>
            <p className="text-xs dark:text-slate-300 text-slate-600 mt-1 leading-relaxed">
              Explore how your core projects connect to tech clusters and target milestones.
            </p>

            {/* Curated Mini Visual Graph Preview */}
            <div className="mt-5 p-4 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  <span className="font-semibold dark:text-white text-slate-900">Akarsit Dubey</span>
                </div>
                <span className="text-[10px] font-mono dark:text-slate-500 text-slate-400">Core</span>
              </div>

              <div className="pl-4 border-l dark:border-slate-800 border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 px-2 rounded dark:bg-slate-900/60 bg-white border dark:border-transparent border-slate-200/60 shadow-2xs">
                  <span className="flex items-center gap-1.5 dark:text-purple-300 text-purple-700 font-medium">
                    <NexusLogo className="h-3 w-3" />
                    NEXUS
                  </span>
                  <span className="text-[10px] dark:text-slate-500 text-slate-400">Project · 92%</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded dark:bg-slate-900/60 bg-white border dark:border-transparent border-slate-200/60 shadow-2xs">
                  <span className="dark:text-purple-300 text-purple-700 font-medium">Forge-UI</span>
                  <span className="text-[10px] dark:text-slate-500 text-slate-400">Project · 84%</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded dark:bg-slate-900/60 bg-white border dark:border-transparent border-slate-200/60 shadow-2xs">
                  <span className="dark:text-indigo-300 text-indigo-700 font-medium">Frontend Stack</span>
                  <span className="text-[10px] dark:text-slate-500 text-slate-400">Cluster · 4</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/universe"
            className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-sky-300 dark:border-slate-700 bg-sky-500 hover:bg-sky-400 text-slate-950 border border-sky-400 shadow-sm transition-colors"
          >
            <Compass className="h-4 w-4" />
            <span>Launch Full Universe</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
