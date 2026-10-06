import { NodeTypes } from '@xyflow/react';
import { UserNode } from './UserNode';
import { ProjectNode } from './ProjectNode';
import { ClusterNode } from './ClusterNode';
import { TechnologyNode } from './TechnologyNode';
import { GoalNode } from './GoalNode';
import { RepositoryNode } from './RepositoryNode';

export const nodeTypes: NodeTypes = {
  user: UserNode,
  project: ProjectNode,
  cluster: ClusterNode,
  technology: TechnologyNode,
  goal: GoalNode,
  repository: RepositoryNode,
};

export {
  UserNode,
  ProjectNode,
  ClusterNode,
  TechnologyNode,
  GoalNode,
  RepositoryNode,
};
