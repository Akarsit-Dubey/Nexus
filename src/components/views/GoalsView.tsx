'use client';

import React, { useState } from 'react';
import { useGoalStore } from '@/stores/goal-store';
import { useProjectStore } from '@/stores/project-store';
import {
  Target,
  CheckCircle2,
  Clock,
  Plus,
  X,
  Briefcase,
  Code2,
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';

export const GoalsView = () => {
  const { goals, updateProgress, toggleStatus, addGoal } = useGoalStore();
  const projects = useProjectStore((s) => s.projects);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newProgress, setNewProgress] = useState(50);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addGoal({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Engineering milestone target.',
      progress: newProgress,
      deadline: newDeadline || '2026-12-31',
      status: 'active',
      category: newCategory.trim() || 'Milestone',
      relatedProjects: ['proj-nexus'],
      relatedTechnologies: ['TypeScript'],
    });

    setNewTitle('');
    setNewDesc('');
    setNewDeadline('');
    setNewCategory('');
    setNewProgress(50);
    setShowCreateModal(false);
  };

  return (
    <div className="relative z-10 min-h-0 flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight dark:text-white text-slate-900">
            Engineering Goals
          </h1>
          <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 mt-1">
            Active milestones, architectural targets, and delivery deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto py-2 px-4 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-md shadow-rose-500/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {goals.map((goal) => {
          const isCompleted = goal.status === 'completed' || goal.progress === 100;

          return (
            <div
              key={goal.id}
              className="flex flex-col justify-between rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200/90 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider',
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                        : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                    )}
                  >
                    {goal.category}
                  </span>

                  <button
                    onClick={() => toggleStatus(goal.id)}
                    className={cn(
                      'flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer',
                      isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-500'
                        : 'text-slate-400 hover:text-rose-500'
                    )}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>

                <h3 className="text-base font-bold dark:text-white text-slate-900 mb-1.5">{goal.title}</h3>
                <p className="text-xs dark:text-slate-300 text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {goal.description}
                </p>

                {/* Related Technologies / Projects */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {goal.relatedTechnologies?.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] dark:bg-slate-800/80 bg-slate-100 dark:text-slate-300 text-slate-700"
                    >
                      <Code2 className="h-2.5 w-2.5 text-emerald-500 dark:text-emerald-400" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Slider & Date */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="dark:text-slate-400 text-slate-500 text-[11px]">Progress</span>
                    <span
                      className={cn(
                        'font-mono font-bold text-xs',
                        isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      )}
                    >
                      {goal.progress}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                    className={cn(
                      'w-full cursor-pointer h-1.5',
                      isCompleted ? 'accent-emerald-500' : 'accent-rose-500'
                    )}
                  />
                </div>

                <div className="flex items-center justify-between text-xs dark:text-slate-400 text-slate-500 font-mono text-[11px] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>Deadline: {formatDate(goal.deadline)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE GOAL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200 dark:border-slate-700 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold dark:text-white text-slate-900">Create Target Goal</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">
                Goal Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Deliver Real-Time Web Telemetry"
                className="w-full rounded-xl dark:bg-slate-900 bg-slate-50 px-3 py-2 text-xs dark:text-white text-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Objective milestones..."
                className="w-full rounded-xl dark:bg-slate-900 bg-slate-50 px-3 py-2 text-xs dark:text-white text-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full rounded-xl dark:bg-slate-900 bg-slate-50 px-3 py-2 text-xs dark:text-white text-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Systems"
                  className="w-full rounded-xl dark:bg-slate-900 bg-slate-50 px-3 py-2 text-xs dark:text-white text-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="dark:text-slate-300 text-slate-700">Initial Progress</span>
                <span className="font-mono text-rose-500 font-semibold">{newProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={newProgress}
                onChange={(e) => setNewProgress(parseInt(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="py-1.5 px-3 rounded-lg text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 rounded-lg text-xs font-bold bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Add Goal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
