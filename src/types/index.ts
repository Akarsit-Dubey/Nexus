export type NodeType =
  | 'user'
  | 'project'
  | 'technology'
  | 'repository'
  | 'goal'
  | 'cluster';

export type NodeStatus = 'active' | 'in-progress' | 'completed' | 'archived';

export interface NodeMetrics {
  stars?: number;
  forks?: number;
  openIssues?: number;
  deadline?: string;
  githubUrl?: string;
  liveUrl?: string;
  language?: string;
}

export interface NexusNodeData {
  [key: string]: unknown;
  id: string;
  label: string;
  type: NodeType;
  description?: string;
  status?: NodeStatus;
  progress?: number; // 0-100
  icon?: string;
  category?: string;
  tags?: string[];
  metrics?: NodeMetrics;
  relatedIds?: string[];
  
  // Cluster-specific fields
  isCluster?: boolean;
  clusterId?: string; // which cluster this node belongs to when expanded
  childIds?: string[];
  childCount?: number;
  isExpanded?: boolean;
  
  // Graph interaction state
  isSelected?: boolean;
  isDirectNeighbor?: boolean;
  isDimmed?: boolean;
  isHidden?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: NodeStatus;
  progress: number;
  githubUrl?: string;
  liveUrl?: string;
  relatedGoals?: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GithubRepoItem {
  id: number | string;
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  updatedAt: string;
  htmlUrl: string;
  isPrivate: boolean;
  defaultBranch: string;
}

export interface GithubActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GoalItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  status: 'active' | 'completed' | 'archived';
  category: string;
  relatedProjects: string[];
  relatedTechnologies: string[];
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  accent: 'cyan' | 'purple' | 'emerald' | 'amber' | 'blue';
  githubUsername: string;
  reducedMotion: boolean;
}
