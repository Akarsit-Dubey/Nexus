'use client';

import React from 'react';
import { useUniverseStore } from '@/stores/universe-store';
import { getNodeColor, formatDate, formatCompactNumber, cn } from '@/lib/utils';
import {
  X,
  ExternalLink,
  GitFork,
  Star,
  Target,
  Maximize2,
  Minimize2,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const NodeInspector = () => {
  const {
    nodes,
    selectedNodeId,
    isInspectorOpen,
    closeInspector,
    focusedProjectId,
    enterFocusMode,
    exitFocusMode,
    toggleCluster,
    setSelectedNodeId,
  } = useUniverseStore();

  if (!isInspectorOpen || !selectedNodeId) return null;

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const { data } = node;
  const color = getNodeColor(data.type);
  const isCurrentlyFocused = focusedProjectId === node.id;

  const relatedNodes = (data.relatedIds || [])
    .map((id) => nodes.find((n) => n.id === id))
    .filter(Boolean);

  return (
    <div
      className={cn(
        'fixed inset-y-0 right-0 z-40 w-full sm:w-[360px]',
        'dark:bg-[#0a0e1a]/95 bg-white/95 backdrop-blur-md border-l border-slate-200 dark:border-slate-800',
        'flex flex-col shadow-2xl transition-all duration-200'
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: color.solid }}
          />
          <span className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400 text-slate-500">
            {data.type} details
          </span>
        </div>

        <button
          onClick={closeInspector}
          className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        <div>
          <h2 className="text-lg font-bold dark:text-white text-slate-900 tracking-tight">{data.label}</h2>
          {data.category && (
            <span
              className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded"
              style={{ backgroundColor: color.bg, color: color.text }}
            >
              {data.category}
            </span>
          )}
          {data.description && (
            <p className="mt-2 text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Project Context & Focus Button */}
        {data.type === 'project' && (
          <div className="space-y-4 rounded-xl dark:bg-slate-900/60 bg-slate-50 p-4 border border-slate-200 dark:border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="dark:text-slate-400 text-slate-500">Progress</span>
              <span className="font-mono text-purple-600 dark:text-purple-300 font-bold">{data.progress ?? 80}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full dark:bg-slate-800 bg-slate-200">
              <div
                className="h-full rounded-full bg-purple-500"
                style={{ width: `${data.progress ?? 80}%` }}
              />
            </div>

            {/* Focus Action */}
            <button
              onClick={() => {
                if (isCurrentlyFocused) {
                  exitFocusMode();
                } else {
                  enterFocusMode(node.id);
                }
              }}
              className={cn(
                'w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                isCurrentlyFocused
                  ? 'dark:bg-slate-800 bg-slate-200 dark:text-slate-200 text-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
                  : 'bg-purple-600 text-white hover:bg-purple-500 shadow-md font-bold'
              )}
            >
              {isCurrentlyFocused ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span>Exit Focus Mode</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Enter Project Focus Mode</span>
                </>
              )}
            </button>

            {data.metrics?.githubUrl && (
              <a
                href={data.metrics.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium dark:bg-slate-800 bg-white hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300 text-slate-700 border border-slate-200 dark:border-transparent transition-colors"
              >
                <GitFork className="h-3.5 w-3.5" />
                <span>Open Repository</span>
                <ExternalLink className="h-3 w-3 ml-auto text-slate-400" />
              </a>
            )}
          </div>
        )}

        {/* Cluster Context */}
        {data.type === 'cluster' && (
          <div className="space-y-3 rounded-xl dark:bg-slate-900/60 bg-slate-50 p-4 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="dark:text-slate-400 text-slate-500">Contained Items</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-300 font-bold">{data.childCount || 4}</span>
            </div>

            <button
              onClick={() => toggleCluster(node.id)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{data.isExpanded ? 'Collapse Cluster' : 'Expand Cluster Nodes'}</span>
            </button>
          </div>
        )}

        {/* Repository Context */}
        {data.type === 'repository' && data.metrics && (
          <div className="space-y-3 rounded-xl dark:bg-slate-900/60 bg-slate-50 p-4 border border-slate-200 dark:border-slate-800/80 text-xs">
            <div className="flex justify-between">
              <span className="dark:text-slate-400 text-slate-500">Stars</span>
              <span className="font-mono text-amber-500 dark:text-amber-400 font-bold">{data.metrics.stars || 0}</span>
            </div>
            {data.metrics.githubUrl && (
              <a
                href={data.metrics.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-200 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 border border-amber-200 dark:border-transparent transition-colors"
              >
                <GitFork className="h-3.5 w-3.5" />
                <span>View on GitHub</span>
              </a>
            )}
          </div>
        )}

        {/* Related Nodes */}
        {relatedNodes.length > 0 && (
          <div>
            <div className="text-xs font-semibold dark:text-slate-400 text-slate-500 mb-2">
              Connected Nodes ({relatedNodes.length})
            </div>
            <div className="space-y-1.5">
              {relatedNodes.map((rel) => {
                if (!rel) return null;
                const relColor = getNodeColor(rel.data.type);
                return (
                  <button
                    key={rel.id}
                    onClick={() => setSelectedNodeId(rel.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg dark:bg-slate-900/80 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/60 text-xs transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: relColor.solid }}
                      />
                      <span className="dark:text-slate-200 text-slate-800 truncate">{rel.data.label}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
