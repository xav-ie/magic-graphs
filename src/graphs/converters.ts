import type {
  GNode,
  GEdge,
  Graph
} from '@graph/types';
import { onUnmounted, ref } from 'vue';

export type AdjacencyList = Record<string, string[]>;

export const nodesEdgesToAdjList = (nodes: GNode[], edges: GEdge[]) => nodes
  .reduce<AdjacencyList>((acc, node) => {
    acc[node.id] = edges
      // filter checks if it belongs to the node
      // map turns the edges that were filtered into a node id
      .filter(edge => {
        if (edge.type === 'undirected') return edge.from === node.id || edge.to === node.id;
        return edge.from === node.id
      })
      .map(edge => {
        if (edge.type === 'undirected') {
          if (edge.from === node.id) return edge.to
          return edge.from
        }
        return edge.to
      });
    return acc;
  }, {});

/**
 * a reactively updated adjacency list based on the graph's nodes and edges
 *
 * @param graph - the graph instance
 * @returns a ref to the adjacency list
 */
export const useAdjacencyList = (graph: Graph) => {
  const adjList = ref<AdjacencyList>({});

  const makeAdjList = () => {
    const { nodes, edges } = graph;
    adjList.value = nodesEdgesToAdjList(nodes.value, edges.value);
  }

  makeAdjList();

  graph.subscribe('onStructureChange', makeAdjList);
  onUnmounted(() => graph.unsubscribe('onStructureChange', makeAdjList));

  return adjList;
};

export const adjListToNodesEdges = (adjList: AdjacencyList) => {
  const nodes = Object.keys(adjList).map(() => ({} as GNode));

  const edges = Object.entries(adjList).flatMap(([from, tos]) =>
    tos.map(to => ({ from: from.toString(), to: to.toString() }))
  );

  return { nodes, edges };
}