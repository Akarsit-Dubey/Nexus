'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettingsStore } from '@/stores/settings-store';
import { useGithubStore } from '@/stores/github-store';
import { NexusLogo } from '@/components/brand/NexusLogo';
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  GitFork,
  Target,
  Settings,
  Search,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header = () => {
  const pathname = usePathname();
  const { settings, updateSetting, initializeSettings } = useSettingsStore();
  const user = useGithubStore((s) => s.user);

  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  const navLinks = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/universe', label: 'Universe', icon: Compass },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/github', label: 'GitHub', icon: GitFork },
    { href: '/goals', label: 'Goals', icon: Target },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="shrink-0 sticky top-0 z-40 w-full border-b dark:border-slate-800/80 border-slate-200/90 dark:bg-[#07090e]/95 bg-white/95 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <NexusLogo className="h-7 w-7 group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(56,189,248,0.35)]" />
            <span className="font-extrabold tracking-wider text-sm dark:text-white text-slate-900">
              NEXUS
            </span>
          </Link>

          {/* Primary Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    isActive
                      ? 'dark:bg-slate-800 dark:text-sky-300 bg-slate-100 text-slate-900 font-semibold shadow-xs'
                      : 'dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Quick Search trigger */}
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                ctrlKey: true,
                bubbles: true,
              });
              window.dispatchEvent(event);
            }}
            className="flex items-center gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg dark:bg-slate-900/90 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 border border-slate-200/90 text-xs transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[11px]">Command Palette</span>
            <kbd className="hidden sm:inline-flex items-center rounded dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 bg-white text-slate-500 border border-slate-200 px-1.5 py-0.5 text-[10px] font-mono shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() =>
              updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')
            }
            title={settings.theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-1.5 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {settings.theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* User Profile Mini Badge */}
          {user && (
            <Link
              href="/github"
              className="flex items-center gap-2 pl-2 border-l dark:border-slate-800 border-slate-200 text-xs dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-950 transition-colors"
            >
              <img
                src={user.avatarUrl}
                alt={user.name || user.login}
                className="h-6 w-6 rounded-full dark:border-slate-700 border-slate-300 border object-cover"
              />
              <span className="hidden lg:inline text-xs font-medium dark:text-slate-300 text-slate-700">
                {user.name || user.login}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Row */}
      <div className="flex md:hidden overflow-x-auto px-3 py-1.5 border-t dark:border-slate-800/80 border-slate-200/80 gap-1 scrollbar-none">
        {navLinks.map((link) => {
          const isActive =
            link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors',
                isActive
                  ? 'dark:bg-slate-800 dark:text-sky-300 bg-slate-100 text-slate-900 font-semibold shadow-xs'
                  : 'dark:text-slate-400 dark:hover:text-slate-200 text-slate-600 hover:text-slate-900'
              )}
            >
              <Icon className="h-3 w-3" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
