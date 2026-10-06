'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/stores/project-store';
import { useUniverseStore } from '@/stores/universe-store';
import { useRouter } from 'next/navigation';
import { ProjectItem } from '@/types';
import {
  Briefcase,
  Star,
  ExternalLink,
  GitFork,
  Plus,
  Search,
  Compass,
  X,
  Target,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ProjectsView = () => {
  const router = useRouter();
  const {
    projects,
    toggleFavorite,
    filterStatus,
    setFilterStatus,
    searchFilter,
    setSearchFilter,
    selectedProject,
    setSelectedProject,
  } = useProjectStore();

  const { enterFocusMode } = useUniverseStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTech, setNewTech] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = filterStatus ? p.status === filterStatus : true;
    const matchesSearch = searchFilter
      ? p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()))
      : true;
    return matchesStatus && matchesSearch;
  });

  const handleFocusInUniverse = (id: string) => {
    enterFocusMode(id);
    router.push('/universe');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    useProjectStore.getState().addProject({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Software application workspace.',
      technologies: newTech.split(',').map((t) => t.trim()).filter(Boolean),
      status: 'in-progress',
      progress: 60,
      isFavorite: false,
    });
    setNewTitle('');
    setNewDesc('');
    setNewTech('');
    setShowCreateModal(false);
  };

  return (
    <div className="relative z-10 min-h-0 flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b dark:border-slate-800 border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight dark:text-white text-slate-900">
            Projects Catalog
          </h1>
          <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 mt-1">
            Software products, open-source libraries, and application systems.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto py-2 px-4 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full rounded-xl dark:bg-slate-900/90 bg-white pl-9 pr-4 py-2 text-xs dark:text-white text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-800 shadow-xs focus:outline-none focus:border-purple-500/60"
          />
        </div>

        <div className="flex items-center gap-1 dark:bg-slate-900/80 bg-slate-100 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {[
            { id: null, label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map((st) => (
            <button
              key={st.label}
              onClick={() => setFilterStatus(st.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors',
                filterStatus === st.id
                  ? 'dark:bg-purple-500/20 bg-white text-purple-700 dark:text-purple-300 font-semibold shadow-xs'
                  : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => setSelectedProject(proj)}
            className="group flex flex-col justify-between rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200/90 dark:border-slate-800 p-5 hover:border-purple-400/60 dark:hover:border-purple-500/40 hover:bg-slate-50/80 dark:hover:bg-[#101322] cursor-pointer transition-all shadow-sm hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-500/30">
                  {proj.status}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(proj.id);
                  }}
                  className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                >
                  <Star
                    className={cn(
                      'h-4 w-4',
                      proj.isFavorite && 'fill-amber-400 text-amber-400'
                    )}
                  />
                </button>
              </div>

              <h3 className="text-base font-bold dark:text-white text-slate-900 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                {proj.title}
              </h3>
              <p className="mt-1.5 text-xs dark:text-slate-300 text-slate-600 line-clamp-2 leading-relaxed">
                {proj.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {proj.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-xs text-purple-600 dark:text-purple-300 font-medium">
                {proj.progress}%
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFocusInUniverse(proj.id);
                  }}
                  className="flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 font-medium transition-colors"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Universe Focus</span>
                </button>

                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <GitFork className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PROJECT DETAIL MODAL WITH MINI-UNIVERSE GRAPH */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200 dark:border-slate-700 p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-500/30">
                  {selectedProject.status}
                </span>
                <h2 className="text-xl font-bold dark:text-white text-slate-900 mt-1">{selectedProject.title}</h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
              {selectedProject.description}
            </p>

            {/* Technologies */}
            <div>
              <div className="text-[11px] font-semibold dark:text-slate-400 text-slate-600 mb-2">Technologies Used</div>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-xs dark:bg-slate-800 bg-slate-100 dark:text-slate-200 text-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Curated Mini-Universe Graph for this Project */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold dark:text-slate-400 text-slate-600 mb-2">
                <span>Related Universe Micro-Graph</span>
                <span className="text-sky-600 dark:text-sky-400 font-mono text-[10px]">Contextual</span>
              </div>
              <div className="p-4 rounded-xl dark:bg-slate-950 bg-slate-50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <span className="font-bold dark:text-white text-slate-900">{selectedProject.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300 font-semibold">{selectedProject.progress}% complete</span>
                </div>

                <div className="pl-4 border-l border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  {selectedProject.technologies.slice(0, 3).map((t) => (
                    <div key={t} className="flex items-center gap-2 dark:text-slate-300 text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{t}</span>
                    </div>
                  ))}
                  {selectedProject.githubUrl && (
                    <div className="flex items-center gap-2 dark:text-slate-300 text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span className="font-mono text-[11px]">Repository linked</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleFocusInUniverse(selectedProject.id)}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors"
              >
                <Compass className="h-4 w-4" />
                <span>Open in Universe Focus Mode</span>
              </button>

              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 transition-colors"
                >
                  <GitFork className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl dark:bg-[#0c101c] bg-white border border-slate-200 dark:border-slate-700 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold dark:text-white text-slate-900">Create New Project</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Orbit Engine"
                className="w-full rounded-xl dark:bg-slate-900 bg-slate-50 px-3 py-2 text-xs dark:text-white text-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-purple-500"
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
                placeholder="Brief summary..."
                className="w-full rounded-xl dark:bg-slate-900 bg-slate-50 px-3 py-2 text-xs dark:text-white text-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">
                Technologies (comma separated)
              </label>
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="e.g. Next.js, React, Tailwind"
                className="w-full rounded-xl dark:bg-slate-900 bg-slate-50 px-3 py-2 text-xs dark:text-white text-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="py-1.5 px-3 rounded-lg text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 rounded-lg text-xs font-bold bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-md shadow-purple-500/20"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
