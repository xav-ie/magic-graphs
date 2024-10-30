import type {
  GNode,
  GEdge,
  Graph
} from '@graph/types';
import { onUnmounted, ref } from 'vue';
import { doesEdgeConnectToNode } from './helpers';

export type AdjacencyList = Record<string, string[]>;

export const nodesEdgesToAdjList = (nodes: GNode[], edges: GEdge[]) => nodes
  .reduce<AdjacencyList>((acc, node) => {
    acc[node.id] = edges
      .filter(edge => doesEdgeConnectToNode(edge, node))
      .map(edge => {
        if (edge.type === 'undirected') {
          if (edge.from === node.id) return edge.to
          return edge.from
        }
        return edge.to
      });
    return acc;
  }, {});

export const humanReadableAdjList = (adjList: AdjacencyList, graph: Graph) => {
  const entries = Object.entries(adjList);
  return entries.reduce<AdjacencyList>((acc, [from, tos]) => {
    const keyNode = graph.getNode(from);
    if (!keyNode) return acc;
    const toNodeLabels = tos
      .map(to => graph.getNode(to))
      .filter(Boolean)
      .map(node => node!.label)
    acc[keyNode.label] = toNodeLabels;
    return acc;
  }, {});
}

/**
 * a reactively updated adjacency list based on the graph's nodes and edges
 *
 * @param graph - the graph instance
 * @returns a ref to the adjacency list
 */
export const useAdjacencyList = (graph: Graph) => {
  const adjList = ref<AdjacencyList>({});
  const labelAdjList = ref<AdjacencyList>({});

  const makeAdjLists = () => {
    const { nodes, edges } = graph;
    adjList.value = nodesEdgesToAdjList(nodes.value, edges.value);
    labelAdjList.value = humanReadableAdjList(adjList.value, graph);
    console.log(JSON.stringify(labelAdjList.value, null, 2));
  }

  makeAdjLists();

  graph.subscribe('onStructureChange', makeAdjLists);
  onUnmounted(() => graph.unsubscribe('onStructureChange', makeAdjLists));

  return {
    adjacencyList: adjList,
    humanReadableAdjList: labelAdjList
  };
};

export const adjListToNodesEdges = (adjList: AdjacencyList) => {
  const nodes = Object.keys(adjList).map(() => ({} as GNode));

  const edges = Object.entries(adjList).flatMap(([from, tos]) =>
    tos.map(to => ({ from: from.toString(), to: to.toString() }))
  );

  return { nodes, edges };
}