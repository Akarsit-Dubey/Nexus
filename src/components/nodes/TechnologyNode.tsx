'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NexusNodeData } from '@/types';
import { Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TechnologyNode = memo(({ data }: NodeProps & { data: NexusNodeData }) => {
  const isSelected = data.isSelected;
  const isNeighbor = data.isDirectNeighbor;
  const isDimmed = data.isDimmed;

  return (
    <div
      className={cn(
        'group relative min-w-[140px] max-w-[180px] rounded-xl px-3 py-2 transition-all duration-200',
        'border backdrop-blur-md shadow-xs dark:shadow-md cursor-pointer select-none',
        'dark:bg-[#0a1518] bg-white dark:border-emerald-500/40 border-emerald-200/80 dark:text-slate-100 text-slate-800 hover:border-emerald-400 dark:hover:bg-[#0d1c20] hover:bg-emerald-50/40',
        isSelected && 'ring-2 ring-emerald-400 border-emerald-400 shadow-emerald-500/20 shadow-lg',
        isNeighbor && 'border-emerald-400/80',
        isDimmed && 'opacity-20'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-emerald-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-emerald-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-emerald-400 !border-white dark:!border-slate-900 !w-2 !h-2" />

      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/20 text-emerald-400">
          <Code2 className="h-3 w-3" />
        </div>
        <div className="min-w-0 flex-1 truncate text-xs font-semibold dark:text-slate-100 text-slate-900 group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
          {data.label}
        </div>
      </div>
    </div>
  );
});

TechnologyNode.displayName = 'TechnologyNode';
