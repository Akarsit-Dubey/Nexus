'use client';

import React from 'react';
import { useUniverseStore } from '@/stores/universe-store';
import { useReactFlow } from '@xyflow/react';
import {
  Search,
  Filter,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const UniverseToolbar = ({ onToggleFilters }: { onToggleFilters: () => void }) => {
  const { fitView } = useReactFlow();
  const {
    focusedProjectId,
    exitFocusMode,
    enterFocusMode,
    selectedNodeId,
    nodes,
    resetUniverse,
  } = useUniverseStore();

  const handleToggleFocus = () => {
    if (focusedProjectId) {
      exitFocusMode();
    } else if (selectedNodeId) {
      enterFocusMode(selectedNodeId);
    } else {
      // Pick first project if nothing selected
      const firstProject = nodes.find((n) => n.data.type === 'project');
      if (firstProject) {
        enterFocusMode(firstProject.id);
      }
    }
  };

  const handleReset = () => {
    resetUniverse();
    fitView({ duration: 600, padding: 0.25 });
  };

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl dark:bg-[#090d18]/95 bg-white/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl max-w-[calc(100vw-24px)] overflow-x-auto scrollbar-none">
      {/* Search ⌘K */}
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
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium dark:text-slate-300 text-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
      >
        <Search className="h-3.5 w-3.5 text-slate-400" />
        <span>Search</span>
        <kbd className="hidden sm:inline-block rounded dark:bg-slate-800 bg-slate-100 px-1.5 py-0.2 text-[10px] font-mono dark:text-slate-400 text-slate-500 border border-slate-200 dark:border-slate-700">
          ⌘K
        </kbd>
      </button>

      <div className="h-4 w-px dark:bg-slate-800 bg-slate-200" />

      {/* Filter toggle */}
      <button
        onClick={onToggleFilters}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium dark:text-slate-300 text-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
      >
        <Filter className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
        <span>Filters</span>
      </button>

      <div className="h-4 w-px dark:bg-slate-800 bg-slate-200" />

      {/* Focus Mode / Exit Focus */}
      <button
        onClick={handleToggleFocus}
        className={cn(
          'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
          focusedProjectId
            ? 'bg-purple-500 text-slate-950 hover:bg-purple-400 shadow-md font-bold'
            : 'dark:text-slate-300 text-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
        )}
      >
        {focusedProjectId ? (
          <>
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Exit Focus</span>
          </>
        ) : (
          <>
            <Maximize2 className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
            <span>Focus Mode</span>
          </>
        )}
      </button>

      <div className="h-4 w-px dark:bg-slate-800 bg-slate-200" />

      {/* Reset View */}
      <button
        onClick={handleReset}
        title="Reset & Fit View"
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium dark:text-slate-300 text-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
        <span>Reset View</span>
      </button>
    </div>
  );
};
