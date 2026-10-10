import { create } from 'zustand';
import {
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import { NodeType, NexusNodeData } from '@/types';
import {
  INITIAL_UNIVERSE_NODES,
  INITIAL_UNIVERSE_EDGES,
  CLUSTER_CHILDREN,
} from '@/data/demo-data';
import { useProjectStore } from '@/stores/project-store';

interface UniverseState {
  nodes: Node<NexusNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  focusedProjectId: string | null;
  activeFilters: NodeType[];
  searchQuery: string;
  isInspectorOpen: boolean;
  expandedClusters: Record<string, boolean>;

  // Actions
  setNodes: (nodes: Node<NexusNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange<Node<NexusNodeData>>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  enterFocusMode: (projectId: string) => void;
  exitFocusMode: () => void;
  toggleCluster: (clusterId: string) => void;
  toggleFilter: (type: NodeType) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
  closeInspector: () => void;
  resetUniverse: () => void;
  addNode: (node: Node<NexusNodeData>) => void;
}

function computeHighlighting(
  nodes: Node<NexusNodeData>[],
  edges: Edge[],
  activeNodeId: string | null,
  focusedProjectId: string | null,
  activeFilters: NodeType[]
): { nodes: Node<NexusNodeData>[]; edges: Edge[] } {
  // If focused on a specific project, strictly show only that project and its neighbors
  const primaryFocusId = focusedProjectId || activeNodeId;
  const connectedIds = new Set<string>();
  const activeEdgeIds = new Set<string>();

  if (primaryFocusId) {
    connectedIds.add(primaryFocusId);
    edges.forEach((edge) => {
      if (edge.source === primaryFocusId) {
        connectedIds.add(edge.target);
        activeEdgeIds.add(edge.id);
      } else if (edge.target === primaryFocusId) {
        connectedIds.add(edge.source);
        activeEdgeIds.add(edge.id);
      }
    });
  }

  const updatedNodes = nodes.map((node) => {
    const matchesFilter =
      activeFilters.length === 0 || activeFilters.includes(node.data.type);

    const isSelected = activeNodeId === node.id;
    const isDirectNeighbor =
      primaryFocusId !== null && !isSelected && connectedIds.has(node.id);

    // In focus mode, hide completely or severely dim unrelated nodes
    const isDimmed =
      !matchesFilter ||
      (primaryFocusId !== null && !connectedIds.has(node.id));

    return {
      ...node,
      hidden: !matchesFilter,
      data: {
        ...node.data,
        isSelected,
        isDirectNeighbor,
        isDimmed,
      },
    };
  });

  const updatedEdges = edges.map((edge) => {
    const isEdgeActive = activeEdgeIds.has(edge.id);
    const isDimmed = primaryFocusId !== null && !isEdgeActive;

    return {
      ...edge,
      style: {
        ...edge.style,
        stroke: isEdgeActive
          ? '#38bdf8'
          : isDimmed
          ? 'rgba(148, 163, 184, 0.08)'
          : 'rgba(148, 163, 184, 0.28)',
        strokeWidth: isEdgeActive ? 2.5 : 1.5,
        opacity: isDimmed ? 0.15 : 1,
      },
    };
  });

  return { nodes: updatedNodes, edges: updatedEdges };
}

function ensureProjectNodeExists(
  nodes: Node<NexusNodeData>[],
  edges: Edge[],
  projectId: string
): { nodes: Node<NexusNodeData>[]; edges: Edge[] } {
  if (nodes.some((n) => n.id === projectId)) {
    return { nodes, edges };
  }

  const project = useProjectStore.getState().projects.find((p) => p.id === projectId);
  if (!project) {
    return { nodes, edges };
  }

  const angle = -Math.PI / 4 + (nodes.length * 0.75);
  const radius = 230;
  const newNode: Node<NexusNodeData> = {
    id: project.id,
    type: 'project',
    position: {
      x: Math.round(Math.cos(angle) * radius),
      y: Math.round(Math.sin(angle) * radius),
    },
    data: {
      id: project.id,
      label: project.title,
      type: 'project',
      description: project.description,
      status: project.status,
      progress: project.progress,
      tags: project.technologies,
      metrics: {
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
      },
      relatedIds: ['user-core'],
    },
  };

  const newEdge: Edge = {
    id: `e-user-${project.id}`,
    source: 'user-core',
    target: project.id,
    type: 'default',
    style: { stroke: 'rgba(168, 85, 247, 0.4)', strokeWidth: 1.5 },
  };

  return {
    nodes: [...nodes, newNode],
    edges: [...edges, newEdge],
  };
}

export const useUniverseStore = create<UniverseState>((set, get) => ({
  nodes: JSON.parse(JSON.stringify(INITIAL_UNIVERSE_NODES)),
  edges: JSON.parse(JSON.stringify(INITIAL_UNIVERSE_EDGES)),
  selectedNodeId: null,
  focusedProjectId: null,
  activeFilters: [],
  searchQuery: '',
  isInspectorOpen: false,
  expandedClusters: {},

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  setSelectedNodeId: (id) => {
    const { nodes, edges, activeFilters, focusedProjectId } = get();
    const isInspectorOpen = id !== null;

    let currentNodes = nodes;
    let currentEdges = edges;

    if (id) {
      const ensured = ensureProjectNodeExists(nodes, edges, id);
      currentNodes = ensured.nodes;
      currentEdges = ensured.edges;
    }

    const { nodes: updatedNodes, edges: updatedEdges } = computeHighlighting(
      currentNodes,
      currentEdges,
      id,
      focusedProjectId,
      activeFilters
    );

    set({
      selectedNodeId: id,
      isInspectorOpen,
      nodes: updatedNodes,
      edges: updatedEdges,
    });
  },

  enterFocusMode: (projectId) => {
    const { nodes, edges, activeFilters } = get();

    const ensured = ensureProjectNodeExists(nodes, edges, projectId);

    const { nodes: updatedNodes, edges: updatedEdges } = computeHighlighting(
      ensured.nodes,
      ensured.edges,
      projectId,
      projectId,
      activeFilters
    );

    set({
      focusedProjectId: projectId,
      selectedNodeId: projectId,
      isInspectorOpen: true,
      nodes: updatedNodes,
      edges: updatedEdges,
    });
  },

  exitFocusMode: () => {
    const { nodes, edges, activeFilters } = get();
    const { nodes: updatedNodes, edges: updatedEdges } = computeHighlighting(
      nodes,
      edges,
      null,
      null,
      activeFilters
    );

    set({
      focusedProjectId: null,
      selectedNodeId: null,
      isInspectorOpen: false,
      nodes: updatedNodes,
      edges: updatedEdges,
    });
  },

  toggleCluster: (clusterId) => {
    const { nodes, edges, expandedClusters, selectedNodeId, focusedProjectId, activeFilters } = get();
    const isCurrentlyExpanded = Boolean(expandedClusters[clusterId]);
    const children = CLUSTER_CHILDREN[clusterId] || [];

    let nextNodes: Node<NexusNodeData>[];
    let nextEdges: Edge[];

    if (isCurrentlyExpanded) {
      // Collapse: remove child nodes and their edges
      const childIds = new Set(children.map((c) => c.id));
      nextNodes = nodes
        .filter((n) => !childIds.has(n.id))
        .map((n) => (n.id === clusterId ? { ...n, data: { ...n.data, isExpanded: false } } : n));

      nextEdges = edges.filter(
        (e) => !childIds.has(e.source) && !childIds.has(e.target)
      );
    } else {
      // Expand: add child nodes and link them to the cluster and related projects
      const updatedClusterNode = nodes.map((n) =>
        n.id === clusterId ? { ...n, data: { ...n.data, isExpanded: true } } : n
      );

      const newEdges: Edge[] = [];
      children.forEach((child) => {
        // Edge between cluster and child
        newEdges.push({
          id: `e-${clusterId}-${child.id}`,
          source: clusterId,
          target: child.id,
          type: 'default',
          style: { stroke: 'rgba(99, 102, 241, 0.4)', strokeWidth: 1.5 },
        });

        // Edges between child and related projects if in graph
        (child.data.relatedIds || []).forEach((relId) => {
          if (nodes.some((n) => n.id === relId)) {
            newEdges.push({
              id: `e-${child.id}-${relId}`,
              source: child.id,
              target: relId,
              type: 'default',
              style: { stroke: 'rgba(148, 163, 184, 0.25)', strokeWidth: 1.2 },
            });
          }
        });
      });

      nextNodes = [...updatedClusterNode, ...children];
      nextEdges = [...edges, ...newEdges];
    }

    const { nodes: updatedNodes, edges: updatedEdges } = computeHighlighting(
      nextNodes,
      nextEdges,
      selectedNodeId,
      focusedProjectId,
      activeFilters
    );

    set({
      nodes: updatedNodes,
      edges: updatedEdges,
      expandedClusters: {
        ...expandedClusters,
        [clusterId]: !isCurrentlyExpanded,
      },
    });
  },

  toggleFilter: (type) => {
    const { activeFilters, nodes, edges, selectedNodeId, focusedProjectId } = get();
    const newFilters = activeFilters.includes(type)
      ? activeFilters.filter((t) => t !== type)
      : [...activeFilters, type];

    const { nodes: updatedNodes, edges: updatedEdges } = computeHighlighting(
      nodes,
      edges,
      selectedNodeId,
      focusedProjectId,
      newFilters
    );

    set({
      activeFilters: newFilters,
      nodes: updatedNodes,
      edges: updatedEdges,
    });
  },

  resetFilters: () => {
    const { nodes, edges, selectedNodeId, focusedProjectId } = get();
    const { nodes: updatedNodes, edges: updatedEdges } = computeHighlighting(
      nodes,
      edges,
      selectedNodeId,
      focusedProjectId,
      []
    );

    set({
      activeFilters: [],
      nodes: updatedNodes,
      edges: updatedEdges,
    });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  closeInspector: () => {
    const { nodes, edges, activeFilters, focusedProjectId } = get();
    const { nodes: updatedNodes, edges: updatedEdges } = computeHighlighting(
      nodes,
      edges,
      null,
      focusedProjectId,
      activeFilters
    );

    set({
      selectedNodeId: null,
      isInspectorOpen: false,
      nodes: updatedNodes,
      edges: updatedEdges,
    });
  },

  resetUniverse: () => {
    set({
      nodes: JSON.parse(JSON.stringify(INITIAL_UNIVERSE_NODES)),
      edges: JSON.parse(JSON.stringify(INITIAL_UNIVERSE_EDGES)),
      selectedNodeId: null,
      focusedProjectId: null,
      activeFilters: [],
      searchQuery: '',
      isInspectorOpen: false,
      expandedClusters: {},
    });
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },
}));
