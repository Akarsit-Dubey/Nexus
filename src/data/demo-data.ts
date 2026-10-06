import {
  ProjectItem,
  GithubRepoItem,
  GithubActivityDay,
  GoalItem,
  NexusNodeData,
} from '@/types';
import { Node, Edge } from '@xyflow/react';

export const CURRENT_USER = {
  login: 'Akarsit-Dubey',
  name: 'Akarsit Dubey',
  bio: 'Software engineer building modern web applications, interactive developer tools, and scalable systems.',
  avatarUrl: 'https://avatars.githubusercontent.com/u/126861101?v=4',
  htmlUrl: 'https://github.com/Akarsit-Dubey',
  publicRepos: 4,
  followers: 5,
  following: 4,
  location: 'India',
};

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-nexus',
    title: 'NEXUS',
    description: 'Personal developer command center and interactive universe graph connecting projects, GitHub, and goals.',
    technologies: ['Next.js', 'React Flow', 'TypeScript', 'Tailwind CSS', 'Zustand'],
    status: 'active',
    progress: 92,
    githubUrl: 'https://github.com/Akarsit-Dubey',
    liveUrl: 'https://nexus-dev.app',
    relatedGoals: ['goal-nexus-launch'],
    isFavorite: true,
    createdAt: '2026-03-01',
    updatedAt: '2026-10-06',
  },
  {
    id: 'proj-forge',
    title: 'Forge-UI',
    description: 'Interactive design system workbench, token inspector, and component sandbox.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    status: 'in-progress',
    progress: 84,
    githubUrl: 'https://github.com/Akarsit-Dubey/Forge-UI',
    relatedGoals: ['goal-forge-tokens'],
    isFavorite: true,
    createdAt: '2026-02-10',
    updatedAt: '2026-09-28',
  },
  {
    id: 'proj-ecommerce',
    title: 'E-Commerce Website',
    description: 'Responsive web platform with interactive catalog, cart management, and seamless product navigation.',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'REST API'],
    status: 'completed',
    progress: 100,
    githubUrl: 'https://github.com/Akarsit-Dubey/E-Commerce-Website',
    isFavorite: false,
    createdAt: '2026-01-15',
    updatedAt: '2026-08-20',
  },
  {
    id: 'proj-c-systems',
    title: 'C Basic Projects',
    description: 'Core algorithmic implementations, low-level data structures, and memory-conscious system utilities in C.',
    technologies: ['C', 'Data Structures', 'Linux'],
    status: 'completed',
    progress: 100,
    githubUrl: 'https://github.com/Akarsit-Dubey/C-Basic-Projects',
    isFavorite: false,
    createdAt: '2026-09-26',
    updatedAt: '2026-10-01',
  },
];

export const INITIAL_REPOS: GithubRepoItem[] = [
  {
    id: 1,
    name: 'Forge-UI',
    fullName: 'Akarsit-Dubey/Forge-UI',
    description: 'Interactive design system workbench, token inspector, and component sandbox.',
    stars: 2,
    forks: 0,
    openIssues: 0,
    language: 'TypeScript',
    updatedAt: '2026-10-04T12:00:00Z',
    htmlUrl: 'https://github.com/Akarsit-Dubey/Forge-UI',
    isPrivate: false,
    defaultBranch: 'main',
  },
  {
    id: 2,
    name: 'E-Commerce-Website',
    fullName: 'Akarsit-Dubey/E-Commerce-Website',
    description: 'Responsive web platform with interactive catalog, cart management, and checkout.',
    stars: 1,
    forks: 0,
    openIssues: 0,
    language: 'JavaScript',
    updatedAt: '2026-08-20T10:30:00Z',
    htmlUrl: 'https://github.com/Akarsit-Dubey/E-Commerce-Website',
    isPrivate: false,
    defaultBranch: 'main',
  },
  {
    id: 3,
    name: 'C-Basic-Projects',
    fullName: 'Akarsit-Dubey/C-Basic-Projects',
    description: 'Core algorithmic implementations, low-level data structures, and memory utilities.',
    stars: 0,
    forks: 0,
    openIssues: 0,
    language: 'C',
    updatedAt: '2026-10-01T11:56:00Z',
    htmlUrl: 'https://github.com/Akarsit-Dubey/C-Basic-Projects',
    isPrivate: false,
    defaultBranch: 'main',
  },
  {
    id: 4,
    name: 'Akarsit-Dubey',
    fullName: 'Akarsit-Dubey/Akarsit-Dubey',
    description: 'Special personal developer profile repository and readme.',
    stars: 0,
    forks: 0,
    openIssues: 0,
    language: 'Markdown',
    updatedAt: '2026-09-24T14:28:00Z',
    htmlUrl: 'https://github.com/Akarsit-Dubey/Akarsit-Dubey',
    isPrivate: false,
    defaultBranch: 'main',
  },
];

export const INITIAL_GOALS: GoalItem[] = [
  {
    id: 'goal-nexus-launch',
    title: 'Ship NEXUS Command Center',
    description: 'Deliver streamlined developer dashboard, intelligent graph clustering, and GitHub live sync.',
    progress: 92,
    deadline: '2026-11-15',
    status: 'active',
    category: 'Productivity',
    relatedProjects: ['proj-nexus'],
    relatedTechnologies: ['Next.js', 'React Flow', 'TypeScript'],
  },
  {
    id: 'goal-forge-tokens',
    title: 'Expand Forge-UI Component Suite',
    description: 'Add 12 accessible primitives and live theme token generator to Forge-UI.',
    progress: 75,
    deadline: '2026-12-20',
    status: 'active',
    category: 'Design Systems',
    relatedProjects: ['proj-forge'],
    relatedTechnologies: ['React', 'Tailwind CSS'],
  },
  {
    id: 'goal-systems',
    title: 'Master Low-Level C & Memory Optimization',
    description: 'Build memory pool allocators and bench-test multi-threaded data structures in C.',
    progress: 80,
    deadline: '2027-01-15',
    status: 'active',
    category: 'Systems',
    relatedProjects: ['proj-c-systems'],
    relatedTechnologies: ['C', 'Linux'],
  },
];

// 52-week activity generator (364 days)
export function generateUserActivity(): GithubActivityDay[] {
  const days: GithubActivityDay[] = [];
  const today = new Date('2026-10-06');

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Deterministic pseudo-random seed
    const rand = Math.sin(i * 14.23 + 45.1) * 10000;
    const norm = rand - Math.floor(rand);

    let count = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;

    if (!isWeekend && norm > 0.45) {
      count = Math.floor(norm * 6) + 1;
      if (count >= 5) level = 4;
      else if (count >= 3) level = 3;
      else if (count >= 2) level = 2;
      else level = 1;
    } else if (isWeekend && norm > 0.75) {
      count = Math.floor(norm * 3) + 1;
      level = 1;
    }

    days.push({ date: dateStr, count, level });
  }

  return days;
}

// ==============================================================================
// INITIAL UNIVERSE: 5–12 Key Nodes Only + Collapsible Cluster Nodes!
// ==============================================================================

// Cluster definition data for expandable children
export const CLUSTER_CHILDREN: Record<string, Node<NexusNodeData>[]> = {
  'cluster-frontend': [
    {
      id: 'tech-react',
      type: 'technology',
      position: { x: -440, y: -260 },
      data: {
        id: 'tech-react',
        label: 'React',
        type: 'technology',
        description: 'Component architecture, concurrent rendering, and reactive hooks.',
        clusterId: 'cluster-frontend',
        tags: ['Frontend', 'Library'],
        relatedIds: ['proj-nexus', 'proj-forge'],
      },
    },
    {
      id: 'tech-nextjs',
      type: 'technology',
      position: { x: -280, y: -340 },
      data: {
        id: 'tech-nextjs',
        label: 'Next.js',
        type: 'technology',
        description: 'Server components, app routing, streaming SSR, and edge handlers.',
        clusterId: 'cluster-frontend',
        tags: ['Framework', 'React'],
        relatedIds: ['proj-nexus'],
      },
    },
    {
      id: 'tech-typescript',
      type: 'technology',
      position: { x: -480, y: -130 },
      data: {
        id: 'tech-typescript',
        label: 'TypeScript',
        type: 'technology',
        description: 'Strict type safety, generics, and compiler tooling.',
        clusterId: 'cluster-frontend',
        tags: ['Language', 'Typed'],
        relatedIds: ['proj-nexus', 'proj-forge'],
      },
    },
    {
      id: 'tech-tailwind',
      type: 'technology',
      position: { x: -320, y: -190 },
      data: {
        id: 'tech-tailwind',
        label: 'Tailwind CSS',
        type: 'technology',
        description: 'Utility-first styling, design tokens, and fluid layout engine.',
        clusterId: 'cluster-frontend',
        tags: ['Styling', 'UI'],
        relatedIds: ['proj-forge', 'proj-nexus'],
      },
    },
  ],
  'cluster-systems': [
    {
      id: 'tech-c',
      type: 'technology',
      position: { x: 380, y: 120 },
      data: {
        id: 'tech-c',
        label: 'C Language',
        type: 'technology',
        description: 'Low-level systems programming, pointers, and memory control.',
        clusterId: 'cluster-systems',
        tags: ['Systems', 'Language'],
        relatedIds: ['proj-c-systems'],
      },
    },
    {
      id: 'tech-git',
      type: 'technology',
      position: { x: 490, y: 220 },
      data: {
        id: 'tech-git',
        label: 'Git & GitHub',
        type: 'technology',
        description: 'Distributed version control, branches, and code collaboration.',
        clusterId: 'cluster-systems',
        tags: ['Tooling', 'VCS'],
        relatedIds: ['user-core'],
      },
    },
    {
      id: 'tech-javascript',
      type: 'technology',
      position: { x: 340, y: 270 },
      data: {
        id: 'tech-javascript',
        label: 'JavaScript',
        type: 'technology',
        description: 'Event-driven web scripting and asynchronous runtime.',
        clusterId: 'cluster-systems',
        tags: ['Web', 'Language'],
        relatedIds: ['proj-ecommerce'],
      },
    },
  ],
  'cluster-goals': [
    {
      id: 'goal-nexus-launch',
      type: 'goal',
      position: { x: -80, y: 320 },
      data: {
        id: 'goal-nexus-launch',
        label: 'Ship NEXUS',
        type: 'goal',
        description: 'Deliver streamlined developer command center and universe.',
        status: 'active',
        progress: 92,
        metrics: { deadline: '2026-11-15' },
        clusterId: 'cluster-goals',
        relatedIds: ['proj-nexus'],
      },
    },
    {
      id: 'goal-forge-tokens',
      type: 'goal',
      position: { x: 80, y: 360 },
      data: {
        id: 'goal-forge-tokens',
        label: 'Expand Forge-UI',
        type: 'goal',
        description: 'Add 12 accessible primitives and live token generator.',
        status: 'active',
        progress: 75,
        metrics: { deadline: '2026-12-20' },
        clusterId: 'cluster-goals',
        relatedIds: ['proj-forge'],
      },
    },
  ],
};

// Initial 7 Clean Nodes
export const INITIAL_UNIVERSE_NODES: Node<NexusNodeData>[] = [
  // 1. Central Core Node (User)
  {
    id: 'user-core',
    type: 'user',
    position: { x: 0, y: 0 },
    data: {
      id: 'user-core',
      label: 'Akarsit Dubey',
      type: 'user',
      description: 'Developer Command Center Core · @Akarsit-Dubey',
      tags: ['Developer', 'Architect'],
      metrics: {
        githubUrl: 'https://github.com/Akarsit-Dubey',
      },
      relatedIds: ['proj-nexus', 'proj-forge', 'proj-ecommerce', 'cluster-frontend', 'cluster-systems', 'cluster-goals'],
    },
  },

  // 2. Project: NEXUS
  {
    id: 'proj-nexus',
    type: 'project',
    position: { x: -220, y: -80 },
    data: {
      id: 'proj-nexus',
      label: 'NEXUS',
      type: 'project',
      description: 'Personal developer command center and interactive universe graph.',
      status: 'active',
      progress: 92,
      tags: ['Next.js', 'React Flow', 'TypeScript'],
      metrics: {
        githubUrl: 'https://github.com/Akarsit-Dubey',
        liveUrl: 'https://nexus-dev.app',
      },
      relatedIds: ['user-core', 'cluster-frontend', 'goal-nexus-launch'],
    },
  },

  // 3. Project: Forge-UI
  {
    id: 'proj-forge',
    type: 'project',
    position: { x: -160, y: 150 },
    data: {
      id: 'proj-forge',
      label: 'Forge-UI',
      type: 'project',
      description: 'Interactive design system workbench and component sandbox.',
      status: 'in-progress',
      progress: 84,
      tags: ['React', 'TypeScript', 'Tailwind'],
      metrics: {
        githubUrl: 'https://github.com/Akarsit-Dubey/Forge-UI',
      },
      relatedIds: ['user-core', 'cluster-frontend', 'goal-forge-tokens'],
    },
  },

  // 4. Project: E-Commerce Website
  {
    id: 'proj-ecommerce',
    type: 'project',
    position: { x: 180, y: -120 },
    data: {
      id: 'proj-ecommerce',
      label: 'E-Commerce Website',
      type: 'project',
      description: 'Responsive web platform with interactive catalog and cart management.',
      status: 'completed',
      progress: 100,
      tags: ['JavaScript', 'HTML5', 'CSS3'],
      metrics: {
        githubUrl: 'https://github.com/Akarsit-Dubey/E-Commerce-Website',
      },
      relatedIds: ['user-core', 'cluster-systems'],
    },
  },

  // 5. Cluster: Frontend Stack (Expandable)
  {
    id: 'cluster-frontend',
    type: 'cluster',
    position: { x: -440, y: -220 },
    data: {
      id: 'cluster-frontend',
      label: 'Frontend Stack · 4',
      type: 'cluster',
      category: 'Technologies',
      description: 'React, Next.js, TypeScript, Tailwind CSS. Click to expand.',
      isCluster: true,
      childCount: 4,
      isExpanded: false,
      childIds: ['tech-react', 'tech-nextjs', 'tech-typescript', 'tech-tailwind'],
      relatedIds: ['proj-nexus', 'proj-forge'],
    },
  },

  // 6. Cluster: Systems & Tools (Expandable)
  {
    id: 'cluster-systems',
    type: 'cluster',
    position: { x: 380, y: 120 },
    data: {
      id: 'cluster-systems',
      label: 'Languages & Tools · 3',
      type: 'cluster',
      category: 'Technologies',
      description: 'C, Git, JavaScript. Click to expand.',
      isCluster: true,
      childCount: 3,
      isExpanded: false,
      childIds: ['tech-c', 'tech-git', 'tech-javascript'],
      relatedIds: ['proj-c-systems', 'proj-ecommerce', 'user-core'],
    },
  },

  // 7. Cluster: Active Goals (Expandable)
  {
    id: 'cluster-goals',
    type: 'cluster',
    position: { x: 0, y: 260 },
    data: {
      id: 'cluster-goals',
      label: 'Active Targets · 2',
      type: 'cluster',
      category: 'Goals',
      description: 'Ship NEXUS, Expand Forge-UI. Click to expand.',
      isCluster: true,
      childCount: 2,
      isExpanded: false,
      childIds: ['goal-nexus-launch', 'goal-forge-tokens'],
      relatedIds: ['user-core', 'proj-nexus', 'proj-forge'],
    },
  },
];

// Initial Clean Edges
export const INITIAL_UNIVERSE_EDGES: Edge[] = [
  {
    id: 'e-user-nexus',
    source: 'user-core',
    target: 'proj-nexus',
    type: 'default',
    style: { stroke: 'rgba(148, 163, 184, 0.3)', strokeWidth: 1.5 },
  },
  {
    id: 'e-user-forge',
    source: 'user-core',
    target: 'proj-forge',
    type: 'default',
    style: { stroke: 'rgba(148, 163, 184, 0.3)', strokeWidth: 1.5 },
  },
  {
    id: 'e-user-ecommerce',
    source: 'user-core',
    target: 'proj-ecommerce',
    type: 'default',
    style: { stroke: 'rgba(148, 163, 184, 0.3)', strokeWidth: 1.5 },
  },
  {
    id: 'e-nexus-frontend',
    source: 'proj-nexus',
    target: 'cluster-frontend',
    type: 'default',
    style: { stroke: 'rgba(99, 102, 241, 0.35)', strokeWidth: 1.5 },
  },
  {
    id: 'e-forge-frontend',
    source: 'proj-forge',
    target: 'cluster-frontend',
    type: 'default',
    style: { stroke: 'rgba(99, 102, 241, 0.35)', strokeWidth: 1.5 },
  },
  {
    id: 'e-user-systems',
    source: 'user-core',
    target: 'cluster-systems',
    type: 'default',
    style: { stroke: 'rgba(16, 185, 129, 0.35)', strokeWidth: 1.5 },
  },
  {
    id: 'e-user-goals',
    source: 'user-core',
    target: 'cluster-goals',
    type: 'default',
    style: { stroke: 'rgba(244, 63, 94, 0.35)', strokeWidth: 1.5 },
  },
];
