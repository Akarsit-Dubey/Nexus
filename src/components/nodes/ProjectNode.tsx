'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NexusNodeData } from '@/types';
import { Briefcase, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ProjectNode = memo(({ data }: NodeProps & { data: NexusNodeData }) => {
  const isSelected = data.isSelected;
  const isNeighbor = data.isDirectNeighbor;
  const isDimmed = data.isDimmed;

  return (
    <div
      className={cn(
        'group relative min-w-[170px] max-w-[210px] rounded-xl px-3.5 py-3 transition-all duration-200',
        'border backdrop-blur-md shadow-xs dark:shadow-lg cursor-pointer select-none',
        'dark:bg-[#101020] bg-white dark:border-purple-500/40 border-purple-200/80 dark:text-slate-100 text-slate-800 hover:border-purple-400 dark:hover:bg-[#141228] hover:bg-purple-50/40',
        isSelected && 'ring-2 ring-purple-400 border-purple-400 dark:bg-[#161230] bg-purple-50 shadow-purple-500/20 shadow-xl',
        isNeighbor && 'border-purple-400/80 dark:bg-[#121128] bg-purple-50/30',
        isDimmed && 'opacity-20'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-purple-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-purple-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-purple-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-purple-400 !border-white dark:!border-slate-900 !w-2 !h-2" />

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
            <Briefcase className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold dark:text-slate-100 text-slate-900 group-hover:text-purple-600 dark:group-hover:text-purple-300">
              {data.label}
            </div>
            <div className="text-[10px] dark:text-purple-400 text-purple-700 font-medium capitalize">
              {data.status || 'Project'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress meter */}
      <div className="mt-2.5">
        <div className="flex justify-between items-center text-[10px] dark:text-slate-400 text-slate-500 mb-1">
          <span>Progress</span>
          <span className="font-mono dark:text-purple-300 text-purple-700 font-semibold">{data.progress ?? 80}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full dark:bg-slate-800 bg-slate-200">
          <div
            className="h-full rounded-full bg-purple-500"
            style={{ width: `${data.progress ?? 80}%` }}
          />
        </div>
      </div>
    </div>
  );
});

ProjectNode.displayName = 'ProjectNode';
