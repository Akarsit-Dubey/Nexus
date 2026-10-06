'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NexusNodeData } from '@/types';
import { Target, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GoalNode = memo(({ data }: NodeProps & { data: NexusNodeData }) => {
  const isCompleted = data.status === 'completed' || (data.progress ?? 0) >= 100;
  const isSelected = data.isSelected;
  const isDimmed = data.isDimmed;

  return (
    <div
      className={cn(
        'group relative min-w-[150px] max-w-[190px] rounded-xl px-3 py-2.5 transition-all duration-200',
        'border backdrop-blur-md shadow-xs dark:shadow-md cursor-pointer select-none',
        'dark:bg-[#180e14] bg-white dark:border-rose-500/40 border-rose-200/80 dark:text-slate-100 text-slate-800 hover:border-rose-400 dark:hover:bg-[#1e1119] hover:bg-rose-50/40',
        isSelected && 'ring-2 ring-rose-400 border-rose-400 shadow-rose-500/20 shadow-lg',
        isDimmed && 'opacity-20'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-rose-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-rose-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-rose-400 !border-white dark:!border-slate-900 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-rose-400 !border-white dark:!border-slate-900 !w-2 !h-2" />

      <div className="flex items-center gap-2">
        <div
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded',
            isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          )}
        >
          {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : <Target className="h-3 w-3" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold dark:text-slate-100 text-slate-900 group-hover:text-rose-600 dark:group-hover:text-rose-300">
            {data.label}
          </div>
          <div className="text-[10px] font-mono dark:text-rose-400 text-rose-700 font-semibold">
            {data.progress ?? 50}%
          </div>
        </div>
      </div>
    </div>
  );
});

GoalNode.displayName = 'GoalNode';
