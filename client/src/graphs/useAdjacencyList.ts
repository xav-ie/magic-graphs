import { onUnmounted, ref } from 'vue';
import type { GNode, Graph } from '@graph/types';
import { getDirectedOutboundEdges, getUndirectedOutboundEdges } from './helpers';
import type { DeepPartial } from '@utils/types';
import type { GraphSettings } from './settings';

/**
 * a mapping of nodes to their neighbors.
 * could take the form of either node ids or labels
 */
export type AdjacencyList = Record<string, string[]>;

export const getDirectedGraphAdjacencyList = (graph: Graph) => {
  return graph.nodes.value.reduce<AdjacencyList>((acc, node) => {
    acc[node.id] = getDirectedOutboundEdges(node.id, graph.edges.value).map(edge => edge.to);
    return acc;
  }, {});
}

export const getUndirectedGraphAdjacencyList = (graph: Graph) => {
  return graph.nodes.value.reduce<AdjacencyList>((acc, node) => {
    acc[node.id] = getUndirectedOutboundEdges(node.id, graph.edges.value).map(edge => {
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
 * a mapping of nodes to their neighbors where
 * neighbors are the full node objects instead of just their ids or labels
 */
export type FullNodeAdjacencyList = Record<string, GNode[]>;

/**
 * creates an adjacency list mapping node ids to the node objects of their neighbors
 *
 * @param graph - the graph instance
 * @returns an adjacency list using ids of nodes as keys and the full node objects as values
 * @example getFullNodeAdjacencyList(graph)
 * // { 'abc123': [{ id: 'def456', label: 'B' }], 'def456': [{ id: 'abc123', label: 'A' }] }
 */
export const getFullNodeAdjacencyList = (graph: Graph) => {
  const adjList = getAdjacencyList(graph);
  const adjListEntries = Object.entries(adjList);

  return adjListEntries.reduce<FullNodeAdjacencyList>((acc, [keyNodeId, toNodeIds]) => {
    acc[keyNodeId] = toNodeIds.map(to => graph.getNode(to)!);
    return acc;
  }, {});
}

/**
 * reactively updating adjacency lists for a graph
 *
 * @param graph - the graph instance
 * @returns all forms of adjacency lists including standard (ids), labels, and full node
 * @example const { adjacencyList, labelAdjacencyList, fullNodeAdjacencyList } = useAdjacencyList(graph)
 * // adjacencyList.value = { 'abc123': ['def456'], 'def456': ['abc123'] }
 * // labelAdjacencyList.value = { 'A': ['B'], 'B': ['A'] }
 * // fullNodeAdjacencyList.value = {
 * //   'abc123': [{ id: 'def456', label: 'B' }],
 * //   'def456': [{ id: 'abc123', label: 'A' }]
 * // }
 */
export const useAdjacencyList = (graph: Graph) => {
  const adjacencyList = ref<AdjacencyList>({});
  const labelAdjacencyList = ref<AdjacencyList>({});
  const fullNodeAdjacencyList = ref<FullNodeAdjacencyList>({});

  const update = () => {
    adjacencyList.value = getAdjacencyList(graph);
    labelAdjacencyList.value = getLabelAdjacencyList(graph);
    fullNodeAdjacencyList.value = getFullNodeAdjacencyList(graph);
  }

  update();

  const checkSettingsDiffForUpdate = (diff: DeepPartial<GraphSettings>) => {
    if ('isGraphDirected' in diff) update();
  }

  graph.subscribe('onStructureChange', update);
  graph.subscribe('onSettingsChange', checkSettingsDiffForUpdate);

  onUnmounted(() => {
    graph.unsubscribe('onStructureChange', update);
    graph.unsubscribe('onSettingsChange', checkSettingsDiffForUpdate);
  });

  return {
    /**
     * the adjacency list using node ids as keys
     */
    adjacencyList,
    /**
     * the adjacency list using node labels as keys
     */
    labelAdjacencyList,
    /**
     * the adjacency list using node ids as keys and full node objects as values
     */
    fullNodeAdjacencyList,
  };
};