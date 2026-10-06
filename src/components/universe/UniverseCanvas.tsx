'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  MiniMap,
  Node,
} from '@xyflow/react';
import { useUniverseStore } from '@/stores/universe-store';
import { useSettingsStore } from '@/stores/settings-store';
import { nodeTypes } from '@/components/nodes';
import { UniverseToolbar } from './UniverseToolbar';
import { NodeInspector } from '@/components/panels/NodeInspector';
import { UniverseBackground } from './UniverseBackground';
import { NodeType, NexusNodeData } from '@/types';
import { getNodeColor, cn } from '@/lib/utils';
import { Minimize2, X, Check } from 'lucide-react';

const FILTER_TYPES: { type: NodeType; label: string }[] = [
  { type: 'project', label: 'Projects' },
  { type: 'cluster', label: 'Clusters' },
  { type: 'technology', label: 'Technologies' },
  { type: 'goal', label: 'Goals' },
  { type: 'repository', label: 'Repositories' },
];

const CanvasInner = () => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const theme = useSettingsStore((s) => s.settings.theme);
  const isLight = theme === 'light';
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setSelectedNodeId,
    focusedProjectId,
    exitFocusMode,
    activeFilters,
    toggleFilter,
    resetFilters,
  } = useUniverseStore();

  const { fitView } = useReactFlow();

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ duration: 500, padding: 0.3 });
    }, 150);
    return () => clearTimeout(timer);
  }, [fitView]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (focusedProjectId) {
          exitFocusMode();
        } else {
          setSelectedNodeId(null);
        }
      }
      if (e.key === '0') {
        fitView({ duration: 500, padding: 0.25 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedProjectId, exitFocusMode, setSelectedNodeId, fitView]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const focusedProjectNode = nodes.find((n) => n.id === focusedProjectId);

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] w-full overflow-hidden dark:bg-[#07090e] bg-slate-50">
      <UniverseBackground />

      {/* Focus Mode Banner (Section 5) */}
      {focusedProjectId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-xl dark:bg-purple-950/90 bg-purple-50 border border-purple-200 dark:border-purple-500/50 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-semibold dark:text-white text-slate-900">
              Focus Mode: <span className="dark:text-purple-300 text-purple-700 font-bold">{focusedProjectNode?.data.label || 'Project'}</span>
            </span>
          </div>
          <button
            onClick={exitFocusMode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Minimize2 className="h-3 w-3" />
            <span>Exit Focus</span>
          </button>
        </div>
      )}

      {/* Filters Overlay Dialog */}
      {showFiltersModal && (
        <div className="absolute top-4 left-4 z-30 w-64 rounded-xl dark:bg-[#0b0f19]/95 bg-white/95 border border-slate-200 dark:border-slate-800 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold dark:text-white text-slate-900 uppercase tracking-wider">
              Filter Node Types
            </span>
            <button
              onClick={() => setShowFiltersModal(false)}
              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 space-y-1">
            {FILTER_TYPES.map((f) => {
              const isActive = activeFilters.includes(f.type);
              const color = getNodeColor(f.type);
              return (
                <button
                  key={f.type}
                  onClick={() => toggleFilter(f.type)}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer',
                    isActive
                      ? 'dark:bg-slate-800 bg-slate-100 dark:text-white text-slate-900 font-semibold shadow-xs'
                      : 'dark:text-slate-400 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: color.solid }}
                    />
                    <span>{f.label}</span>
                  </div>
                  {isActive && <Check className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />}
                </button>
              );
            })}
          </div>

          {activeFilters.length > 0 && (
            <button
              onClick={resetFilters}
              className="mt-3 w-full py-1 text-[11px] text-sky-600 dark:text-sky-400 hover:underline text-center cursor-pointer font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* React Flow Canvas */}
      <div className="relative flex-1 h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          minZoom={0.3}
          maxZoom={2.0}
          proOptions={{ hideAttribution: true }}
        >
          <Background color={isLight ? '#cbd5e1' : '#1e293b'} gap={32} size={1} />
          <MiniMap
            nodeColor={(n) => {
              const nodeData = n.data as unknown as NexusNodeData;
              return getNodeColor(nodeData?.type || 'project').solid;
            }}
            maskColor={isLight ? 'rgba(241, 245, 249, 0.85)' : 'rgba(7, 9, 14, 0.8)'}
            className={cn(
              '!bottom-20 !right-4 !rounded-xl hidden md:block',
              isLight ? '!bg-white/95 !border !border-slate-200 shadow-lg' : '!bg-[#0b0f19]/90 !border !border-slate-800'
            )}
          />
        </ReactFlow>

        {/* Streamlined Toolbar */}
        <UniverseToolbar onToggleFilters={() => setShowFiltersModal(!showFiltersModal)} />
      </div>

      {/* Context Inspector */}
      <NodeInspector />
    </div>
  );
};

export const UniverseCanvas = () => {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
};
