import type { GNode } from '@graph/types';

/**
 * trace for bfs/dfs search
 */
export type BasicSearchTrace = {
  currentNodeId?: GNode['id'];
  /**
   * nodes that have already been explored
   */
  visited: Set<GNode['id']>;
  /**
   * a neutral term for stacked or queued nodes
   */
  nextToExplore?: Set<GNode['id']>;
};
