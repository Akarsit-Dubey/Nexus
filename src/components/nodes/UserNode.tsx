'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NexusNodeData } from '@/types';
import { User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const UserNode = memo(({ data }: NodeProps & { data: NexusNodeData }) => {
  const isSelected = data.isSelected;

  return (
    <div
      className={cn(
        'group relative min-w-[170px] max-w-[210px] rounded-2xl px-4 py-3.5 transition-all duration-200',
        'border backdrop-blur-md shadow-sm dark:shadow-xl cursor-pointer select-none',
        'dark:bg-[#0b1322] bg-white dark:border-sky-500/50 border-sky-200/80 dark:text-slate-100 text-slate-800 hover:border-sky-400',
        isSelected && 'ring-2 ring-sky-400 border-sky-400 dark:bg-[#0d182e] bg-sky-50 shadow-sky-500/20 shadow-2xl'
      )}
    >
      <Handle type="source" position={Position.Top} className="!bg-sky-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-sky-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Left} id="left" className="!bg-sky-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-sky-400 !border-white dark:!border-slate-900 !w-2 !h-2" />

      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300">
          <User className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-bold dark:text-white text-slate-900 tracking-tight">
            {data.label}
          </div>
          <div className="text-[10px] dark:text-sky-400 text-sky-700 font-semibold">
            Developer Core
          </div>
        </div>
      </div>
    </div>
  );
});

UserNode.displayName = 'UserNode';
