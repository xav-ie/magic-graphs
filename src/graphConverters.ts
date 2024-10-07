import type { Node as GNode, Edge as GEdge } from './useGraph';

export type AdjacencyList = Record<GNode['id'], GNode['id'][]>;

export const nodesEdgesToAdjList = (nodes: GNode[], edges: GEdge[]) => nodes.reduce<AdjacencyList>((acc, node) => {
  acc[node.id] = edges
    .filter(edge => edge.from === node.id)
    .map(edge => edge.to);
  return acc;
}, {});
