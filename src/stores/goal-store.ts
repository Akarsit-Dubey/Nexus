import { create } from 'zustand';
import { GoalItem } from '@/types';
import { INITIAL_GOALS } from '@/data/demo-data';

interface GoalState {
  goals: GoalItem[];
  addGoal: (goal: Omit<GoalItem, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<GoalItem>) => void;
  deleteGoal: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  toggleStatus: (id: string) => void;
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: INITIAL_GOALS,

  addGoal: (newGoal) => {
    const goal: GoalItem = {
      ...newGoal,
      id: `goal-${Date.now()}`,
    };
    set((state) => ({ goals: [goal, ...state.goals] }));
  },

  updateGoal: (id, updates) => {
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  },

  deleteGoal: (id) => {
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    }));
  },

  updateProgress: (id, progress) => {
    const clamped = Math.min(100, Math.max(0, progress));
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id
          ? {
              ...g,
              progress: clamped,
              status: clamped === 100 ? 'completed' : g.status === 'completed' ? 'active' : g.status,
            }
          : g
      ),
    }));
  },

  toggleStatus: (id) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id
          ? {
              ...g,
              status: g.status === 'completed' ? 'active' : 'completed',
              progress: g.status === 'completed' ? 75 : 100,
            }
          : g
      ),
    }));
  },
}));
