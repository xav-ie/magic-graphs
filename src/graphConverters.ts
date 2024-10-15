import type { GNode, GEdge } from '@/useGraph/types';

export type AdjacencyList = Record<number, number[]>;

export const nodesEdgesToAdjList = (nodes: GNode[], edges: GEdge[]) => nodes.reduce<AdjacencyList>((acc, node) => {
  acc[Number(node.label)] = edges
    .filter(edge => Number(edge.from) === Number(node.label))
    .map(edge => Number(edge.to));
  return acc;
}, {});

export const adjListToNodesEdges = (adjList: AdjacencyList) => {
  const nodes = Object.keys(adjList).map(() => ({} as GNode));

  const edges = Object.entries(adjList).flatMap(([from, tos]) =>
    tos.map(to => ({ from: from.toString(), to: to.toString() }))
  );

  return { nodes, edges };
}