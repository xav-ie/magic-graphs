import type { GNode, GEdge } from '@graph/types';

export type AdjacencyList = Record<string, string[]>;

export const nodesEdgesToAdjList = (nodes: GNode[], edges: GEdge[]) => nodes.reduce<AdjacencyList>((acc, node) => {
  acc[node.label] = edges
    .filter(edge => {
      if (edge.type === 'undirected') {
        return (edge.from) === (node.label) || (edge.to) === (node.label);
      }
      return (edge.from) === (node.label)
    })
    .map(edge => {
      if (edge.type === 'undirected') {
        if ((edge.from) === (node.label)) {
          return (edge.to)
        }
        return (edge.from)
      }
      return (edge.to)
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