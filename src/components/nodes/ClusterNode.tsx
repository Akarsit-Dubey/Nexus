'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NexusNodeData } from '@/types';
import { useUniverseStore } from '@/stores/universe-store';
import { ChevronDown, ChevronUp, Layers, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ClusterNode = memo(({ id, data }: NodeProps & { data: NexusNodeData }) => {
  const toggleCluster = useUniverseStore((s) => s.toggleCluster);
  const isExpanded = data.isExpanded;
  const isSelected = data.isSelected;
  const isDimmed = data.isDimmed;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        toggleCluster(id);
      }}
      className={cn(
        'group relative min-w-[160px] max-w-[200px] rounded-xl px-3.5 py-2.5 transition-all duration-200',
        'border backdrop-blur-md shadow-xs dark:shadow-lg cursor-pointer select-none',
        'dark:bg-[#121324] bg-white dark:border-indigo-500/40 border-indigo-200/80 dark:text-slate-100 text-slate-800 hover:border-indigo-400 dark:hover:bg-[#161830] hover:bg-indigo-50/40',
        isSelected && 'ring-2 ring-indigo-400 border-indigo-400 shadow-indigo-500/20 shadow-xl',
        isDimmed && 'opacity-25'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-indigo-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-indigo-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-indigo-400 !border-white dark:!border-slate-900 !w-2 !h-2" />

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold dark:text-slate-100 text-slate-900 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
              {data.label}
            </div>
            <div className="text-[9px] uppercase tracking-wider dark:text-indigo-400 text-indigo-700 font-mono font-semibold">
              Cluster Node
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center h-5 w-5 rounded bg-indigo-500/10 dark:text-indigo-300 text-indigo-700 group-hover:bg-indigo-500/20 transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </div>
      </div>
    </div>
  );
});

ClusterNode.displayName = 'ClusterNode';
