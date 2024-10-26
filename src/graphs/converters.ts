import type { GNode, GEdge } from '@graph/types';

export type AdjacencyList = Record<number, number[]>;

export const nodesEdgesToAdjList = (nodes: GNode[], edges: GEdge[]) => nodes.reduce<AdjacencyList>((acc, node) => {
  acc[Number(node.label)] = edges
    .filter(edge => {
      if (edge.type === 'undirected') {
        return Number(edge.from) === Number(node.label) || Number(edge.to) === Number(node.label);
      }
      return Number(edge.from) === Number(node.label)
    })
    .map(edge => {
      if (edge.type === 'undirected') {
        if (Number(edge.from) === Number(node.label)) {
          return Number(edge.to)
        }
        return Number(edge.from)
      }
      return Number(edge.to)
    });
  return acc;
}, {});

export const adjListToNodesEdges = (adjList: AdjacencyList) => {
  const nodes = Object.keys(adjList).map(() => ({} as GNode));

  const edges = Object.entries(adjList).flatMap(([from, tos]) =>
    tos.map(to => ({ from: from.toString(), to: to.toString() }))
  );

  return { nodes, edges };
}