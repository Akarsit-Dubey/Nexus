import { create } from 'zustand';
import { ProjectItem } from '@/types';
import { INITIAL_PROJECTS } from '@/data/demo-data';

interface ProjectState {
  projects: ProjectItem[];
  selectedProject: ProjectItem | null;
  filterStatus: string | null;
  searchFilter: string;
  addProject: (project: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setSelectedProject: (project: ProjectItem | null) => void;
  setFilterStatus: (status: string | null) => void;
  setSearchFilter: (query: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: INITIAL_PROJECTS,
  selectedProject: null,
  filterStatus: null,
  searchFilter: '',

  addProject: (newProj) => {
    const project: ProjectItem = {
      ...newProj,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ projects: [project, ...state.projects] }));
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      ),
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
    }));
  },

  toggleFavorite: (id) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      ),
    }));
  },

  setSelectedProject: (project) => set({ selectedProject: project }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchFilter: (query) => set({ searchFilter: query }),
}));
