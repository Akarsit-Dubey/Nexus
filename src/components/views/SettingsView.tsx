'use client';

import React from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { useUniverseStore } from '@/stores/universe-store';
import { useGithubStore } from '@/stores/github-store';
import {
  Palette,
  GitFork,
  RotateCcw,
  Moon,
  Sun,
  Monitor,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const SettingsView = () => {
  const { settings, updateSetting, resetSettings } = useSettingsStore();
  const { resetUniverse } = useUniverseStore();
  const { username, fetchUserData, reconnectDefault } = useGithubStore();

  const accents = [
    { id: 'cyan', label: 'Cyan', color: '#06b6d4' },
    { id: 'purple', label: 'Purple', color: '#a855f7' },
    { id: 'emerald', label: 'Emerald', color: '#10b981' },
    { id: 'amber', label: 'Amber', color: '#f59e0b' },
    { id: 'blue', label: 'Blue', color: '#3b82f6' },
  ];

  return (
    <div className="relative z-10 min-h-0 flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight dark:text-white text-slate-900">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 mt-1">
          Customize themes, GitHub connectivity, and universe behavior.
        </p>
      </div>

      {/* 1. Appearance */}
      <div className="rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200/90 dark:border-slate-800 p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white text-slate-900">
          <Palette className="h-4 w-4 text-sky-500 dark:text-sky-400" />
          <span>Appearance</span>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-2">
            Theme Mode
          </label>
          <div className="grid grid-cols-3 gap-3 max-w-sm">
            {[
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'system', label: 'System', icon: Monitor },
            ].map((th) => {
              const Icon = th.icon;
              const isSelected = settings.theme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => updateSetting('theme', th.id as any)}
                  className={cn(
                    'flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all gap-1.5 cursor-pointer',
                    isSelected
                      ? 'dark:bg-sky-500/20 bg-sky-50 dark:text-sky-200 text-sky-800 border-sky-400 shadow-xs font-semibold'
                      : 'dark:bg-slate-900 bg-slate-50 dark:text-slate-400 text-slate-600 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent */}
        <div>
          <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-2">
            Accent Color
          </label>
          <div className="flex items-center gap-3">
            {accents.map((acc) => (
              <button
                key={acc.id}
                onClick={() => updateSetting('accent', acc.id as any)}
                className="group relative flex items-center justify-center h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: acc.color,
                  borderColor: settings.accent === acc.id ? '#ffffff' : 'transparent',
                }}
              >
                {settings.accent === acc.id && (
                  <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Reduced motion */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold dark:text-slate-200 text-slate-800">Reduce Motion</div>
            <div className="text-[11px] dark:text-slate-400 text-slate-500">
              Minimize animations and transitions for performance.
            </div>
          </div>
          <button
            onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
            className={cn(
              'h-6 w-11 rounded-full p-1 transition-colors cursor-pointer',
              settings.reducedMotion ? 'bg-sky-500' : 'dark:bg-slate-800 bg-slate-300'
            )}
          >
            <div
              className={cn(
                'h-4 w-4 rounded-full bg-white transition-transform shadow-xs',
                settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>
      </div>

      {/* 2. GitHub Connection */}
      <div className="rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white text-slate-900">
          <GitFork className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          <span>Connected GitHub Account</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold dark:text-white text-slate-900">
              @{username}
            </div>
            <div className="text-[11px] dark:text-slate-400 text-slate-500">
              Repositories and contribution activities are synchronized.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchUserData(username)}
              className="py-1.5 px-3 rounded-lg dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Refresh Data
            </button>
            <button
              onClick={reconnectDefault}
              className="py-1.5 px-3 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Reset to @Akarsit-Dubey
            </button>
          </div>
        </div>
      </div>

      {/* 3. Reset Workspace */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={resetSettings}
          className="dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          Restore Defaults
        </button>

        <button
          onClick={resetUniverse}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Universe Layout</span>
        </button>
      </div>
    </div>
  );
};
