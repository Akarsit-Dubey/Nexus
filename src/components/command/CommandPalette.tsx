'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUniverseStore } from '@/stores/universe-store';
import { useProjectStore } from '@/stores/project-store';
import { useGithubStore } from '@/stores/github-store';
import { useGoalStore } from '@/stores/goal-store';
import { useSettingsStore } from '@/stores/settings-store';
import {
  Search,
  X,
  Command,
  LayoutDashboard,
  Compass,
  Briefcase,
  GitFork,
  Target,
  Settings,
  ArrowRight,
  Sun,
  Moon,
  RotateCcw,
} from 'lucide-react';
import { NexusLogo } from '@/components/brand/NexusLogo';
import { cn } from '@/lib/utils';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const projects = useProjectStore((s) => s.projects);
  const repos = useGithubStore((s) => s.repos);
  const goals = useGoalStore((s) => s.goals);
  const { enterFocusMode, resetUniverse } = useUniverseStore();
  const { settings, updateSetting, resolvedTheme } = useSettingsStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // System items & search results
  const navActions = [
    {
      id: 'nav-overview',
      label: 'Go to Overview Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      perform: () => router.push('/'),
    },
    {
      id: 'nav-universe',
      label: 'Go to Universe Graph',
      category: 'Navigation',
      icon: Compass,
      perform: () => router.push('/universe'),
    },
    {
      id: 'nav-projects',
      label: 'Go to Projects Catalog',
      category: 'Navigation',
      icon: Briefcase,
      perform: () => router.push('/projects'),
    },
    {
      id: 'nav-github',
      label: 'Go to GitHub Dashboard',
      category: 'Navigation',
      icon: GitFork,
      perform: () => router.push('/github'),
    },
    {
      id: 'nav-goals',
      label: 'Go to Engineering Goals',
      category: 'Navigation',
      icon: Target,
      perform: () => router.push('/goals'),
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      category: 'Navigation',
      icon: Settings,
      perform: () => router.push('/settings'),
    },
    {
      id: 'act-theme',
      label: `Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Theme`,
      category: 'Preferences',
      icon: resolvedTheme === 'dark' ? Sun : Moon,
      perform: () => updateSetting('theme', resolvedTheme === 'dark' ? 'light' : 'dark'),
    },
    {
      id: 'act-reset',
      label: 'Reset Universe Graph',
      category: 'Preferences',
      icon: RotateCcw,
      perform: () => resetUniverse(),
    },
  ];

  // Search entities
  const matchedProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  ).map((p) => ({
    id: p.id,
    label: p.title,
    sub: `${p.status} · ${p.progress}%`,
    category: 'Project',
    perform: () => {
      enterFocusMode(p.id);
      router.push('/universe');
    },
  }));

  const matchedRepos = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(query.toLowerCase()))
  ).map((r) => ({
    id: `repo-${r.name}`,
    label: r.name,
    sub: r.language || 'Repository',
    category: 'GitHub Repository',
    perform: () => router.push('/github'),
  }));

  const matchedGoals = goals.filter(
    (g) =>
      g.title.toLowerCase().includes(query.toLowerCase()) ||
      g.category.toLowerCase().includes(query.toLowerCase())
  ).map((g) => ({
    id: g.id,
    label: g.title,
    sub: `${g.progress}% · ${g.category}`,
    category: 'Goal',
    perform: () => router.push('/goals'),
  }));

  const matchedActions = navActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  ).map((a) => ({
    id: a.id,
    label: a.label,
    sub: a.category,
    category: 'Action',
    perform: a.perform,
  }));

  const allResults = query.trim()
    ? [...matchedProjects, ...matchedRepos, ...matchedGoals, ...matchedActions]
    : matchedActions;

  const handleSelect = (idx: number) => {
    if (allResults[idx]) {
      allResults[idx].perform();
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allResults.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % (allResults.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults.length > 0) {
        handleSelect(selectedIndex);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24 px-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl max-h-[85vh] overflow-hidden rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3.5">
          <Search className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search projects, repos, goals..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-xs dark:text-white text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="rounded dark:bg-slate-800 bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono dark:text-slate-400 text-slate-500 border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[50vh] overflow-y-auto p-2 space-y-1">
          {allResults.length === 0 ? (
            <div className="py-8 text-center dark:text-slate-400 text-slate-500 text-xs">
              No results found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            allResults.map((item, idx) => {
              const isItemActive = selectedIndex === idx;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(idx)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-2 cursor-pointer text-xs transition-colors',
                    isItemActive
                      ? 'dark:bg-slate-800 bg-slate-100 dark:text-white text-slate-950 font-semibold shadow-xs'
                      : 'dark:text-slate-300 text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                  )}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="truncate">{item.label}</span>
                    <span className="text-[10px] dark:text-slate-400 text-slate-500 truncate">
                      {item.sub}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono dark:text-slate-400 text-slate-500 uppercase tracking-wider shrink-0">
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 dark:bg-[#090d16] bg-slate-50 px-4 py-2.5 text-[10px] dark:text-slate-400 text-slate-600">
          <div className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-sky-600 dark:text-sky-400">
            <NexusLogo className="h-3.5 w-3.5" />
            <span className="font-bold tracking-wider">NEXUS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
