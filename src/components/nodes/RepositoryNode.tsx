'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NexusNodeData } from '@/types';
import { GitFork, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export const RepositoryNode = memo(({ data }: NodeProps & { data: NexusNodeData }) => {
  const isSelected = data.isSelected;
  const isDimmed = data.isDimmed;

  return (
    <div
      className={cn(
        'group relative min-w-[150px] max-w-[190px] rounded-xl px-3 py-2 transition-all duration-200',
        'border backdrop-blur-md shadow-xs dark:shadow-md cursor-pointer select-none',
        'dark:bg-[#181308] bg-white dark:border-amber-500/40 border-amber-200/80 dark:text-slate-100 text-slate-800 hover:border-amber-400 dark:hover:bg-[#1f180a] hover:bg-amber-50/40',
        isSelected && 'ring-2 ring-amber-400 border-amber-400 shadow-amber-500/20 shadow-lg',
        isDimmed && 'opacity-20'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-amber-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-amber-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-amber-400 !border-white dark:!border-slate-900 !w-2 !h-2" />

      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-500/20 text-amber-400">
          <GitFork className="h-3 w-3" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold dark:text-slate-100 text-slate-900 group-hover:text-amber-600 dark:group-hover:text-amber-300">
            {data.label.includes('/') ? data.label.split('/')[1] : data.label}
          </div>
          {data.metrics?.stars !== undefined && (
            <div className="flex items-center gap-1 text-[10px] dark:text-amber-400 text-amber-700 font-mono font-semibold">
              <Star className="h-2.5 w-2.5 fill-amber-500 dark:fill-amber-400" />
              <span>{data.metrics.stars}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

RepositoryNode.displayName = 'RepositoryNode';
