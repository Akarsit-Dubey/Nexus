import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NodeType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNodeColor(type: NodeType, isDark: boolean = true) {
  switch (type) {
    case 'user':
      return {
        bg: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.15)',
        border: 'rgba(56, 189, 248, 0.6)',
        glow: 'rgba(56, 189, 248, 0.25)',
        text: '#38bdf8',
        solid: '#0284c7',
      };
    case 'project':
      return {
        bg: isDark ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.15)',
        border: 'rgba(168, 85, 247, 0.6)',
        glow: 'rgba(168, 85, 247, 0.25)',
        text: '#c084fc',
        solid: '#9333ea',
      };
    case 'technology':
      return {
        bg: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.6)',
        glow: 'rgba(16, 185, 129, 0.25)',
        text: '#34d399',
        solid: '#059669',
      };
    case 'repository':
      return {
        bg: isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.6)',
        glow: 'rgba(245, 158, 11, 0.25)',
        text: '#fbbf24',
        solid: '#d97706',
      };
    case 'goal':
      return {
        bg: isDark ? 'rgba(244, 63, 94, 0.12)' : 'rgba(244, 63, 94, 0.15)',
        border: 'rgba(244, 63, 94, 0.6)',
        glow: 'rgba(244, 63, 94, 0.25)',
        text: '#fb7185',
        solid: '#e11d48',
      };
    case 'cluster':
      return {
        bg: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.15)',
        border: 'rgba(99, 102, 241, 0.6)',
        glow: 'rgba(99, 102, 241, 0.25)',
        text: '#818cf8',
        solid: '#4f46e5',
      };
    default:
      return {
        bg: 'rgba(148, 163, 184, 0.12)',
        border: 'rgba(148, 163, 184, 0.4)',
        glow: 'rgba(148, 163, 184, 0.2)',
        text: '#94a3b8',
        solid: '#64748b',
      };
  }
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
