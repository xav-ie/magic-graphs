import type { GNode, Graph } from '@graph/types';
import { computed, onUnmounted, ref } from 'vue';
import { getDirectedInboundEdges, getUndirectedInboundEdges } from './helpers';

/**
 * a mapping of nodes to their neighbors.
 * could take the form of either node ids or labels
 */
export type AdjacencyList = Record<string, string[]>;

export const getDirectedGraphAdjacencyList = (graph: Graph) => {
  return graph.nodes.value.reduce<AdjacencyList>((acc, node) => {
    acc[node.id] = getDirectedInboundEdges(node.id, graph.edges.value).map(edge => edge.from);
    return acc;
  }, {});
}

export const getUndirectedGraphAdjacencyList = (graph: Graph) => {
  return graph.nodes.value.reduce<AdjacencyList>((acc, node) => {
    acc[node.id] = getUndirectedInboundEdges(node.id, graph.edges.value).map(edge => {
      return edge.from === node.id ? edge.to : edge.from;
    });
    return acc;
  }, {});
}

/**
 * creates an adjacency list mapping node ids to the node ids of their neighbors
 *
 * @param graph - the graph instance
 * @returns an adjacency list using ids of nodes as keys
 * @example getAdjacencyList(graph)
 * // { 'abc123': ['def456'], 'def456': ['abc123'] }
 */
export const getAdjacencyList = (graph: Graph) => {
  const { isGraphDirected } = graph.settings.value;
  const fn = isGraphDirected ? getDirectedGraphAdjacencyList : getUndirectedGraphAdjacencyList;
  return fn(graph);
}

/**
 * creates a human readable adjacency list mapping node labels to the labels of their neighbors
 *
 * @returns an adjacency list using labels of nodes as keys as opposed to ids
 * @example getLabelAdjacencyList(graph)
 * // { 'A': ['B'], 'B': ['A'] }
 */
export const getLabelAdjacencyList = (graph: Graph) => {
  const adjList = getAdjacencyList(graph);
  const adjListEntries = Object.entries(adjList);

  return adjListEntries.reduce<AdjacencyList>((acc, [keyNodeId, toNodeIds]) => {
    const keyNode = graph.getNode(keyNodeId);
    const toNodes = toNodeIds.map(to => graph.getNode(to));

    if (!keyNode) throw new Error('the "key node" is missing from the graph');
    if (toNodes.some(node => !node)) throw new Error('a "to node" is missing from the graph');

    acc[keyNode.label] = (toNodes as GNode[]).map(node => node.label);
    return acc;
  }, {});
}

/**
 * a reactively updated adjacency list based on the graph's nodes and edges
 *
 * @param graph - the graph instance
 * @returns an object containing the adjacency list and a human readable version of it using labels
 */
export const useAdjacencyList = (graph: Pick<
  Graph,
  'nodes' |
  'edges' |
  'getNode' |
  'subscribe' |
  'unsubscribe'
>) => {
  const adjacencyList = ref<AdjacencyList>({});
  const labelAdjacencyList = ref<AdjacencyList>({});

  const makeAdjLists = () => {
    adjacencyList.value = getAdjacencyList(graph);
    labelAdjacencyList.value = getLabelAdjacencyList(graph);
  }

  const fullNodeAdjacencyList = computed(() => {
    const entries = Object.entries(adjacencyList.value);
    const fullAdjList: Record<string, GNode[]> = {};
    for (const [from, tos] of entries) {
      fullAdjList[from] = tos.map(to => graph.getNode(to)!);
    }
    return fullAdjList;
  })

  makeAdjLists();

  graph.subscribe('onStructureChange', makeAdjLists);
  onUnmounted(() => graph.unsubscribe('onStructureChange', makeAdjLists));

  return {
    /**
     * an adjacency list representation of a graph where the keys are the ids of the nodes
     */
    adjacencyList,
    /**
     * an adjacency list representation of a graph where the keys are the labels of the nodes
     */
    labelAdjacencyList,
    /**
     * an adjacency list representation of a graph where the keys are the ids of the nodes
     * and the values are the full node objects instead of just their ids or labels
     */
    fullNodeAdjacencyList,
  };
};