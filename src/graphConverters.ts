import type { GNode, GEdge } from './useGraphTypes';

export type AdjacencyList = Record<GNode['id'], GNode['id'][]>;

export const nodesEdgesToAdjList = (nodes: GNode[], edges: GEdge[]) => nodes.reduce<AdjacencyList>((acc, node) => {
  acc[node.label] = edges
    .filter(edge => edge.from === node.label)
    .map(edge => edge.to);
  return acc;
}, {});

export const adjListToNodesEdges = (adjList: AdjacencyList) => {
  const nodes = Object.keys(adjList).map(() => ({} as GNode));

  const edges = Object.entries(adjList).flatMap(([from, tos]) =>
    tos.map(to => ({ from: from.toString(), to: to.toString() }))
  );

  return { nodes, edges };
}