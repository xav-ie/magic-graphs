import type { GNode, Graph } from '@graph/types';
import { computed, onUnmounted, ref } from 'vue';
import { isEdgeOriginatingFromNode } from './helpers';

/**
 * an adjacency list representation of a graph where the keys are the ids or labels of the nodes
 * depending on the function used to generate it
 */
export type AdjacencyList = Record<string, string[]>;

/**
 * converts a list of nodes and edges to an adjacency list
 *
 * @returns an adjacency list using ids of nodes as keys
 */
export const getAdjacencyList = ({ nodes, edges }: Pick<Graph, 'nodes' | 'edges'>) => {
  return nodes.value.reduce<AdjacencyList>((acc, node) => {
    acc[node.id] = edges.value
      .filter(edge => isEdgeOriginatingFromNode(edge, node))
      .map(edge => {
        if (edge.type === 'undirected') {
          if (edge.from === node.id) return edge.to
          return edge.from
        }
        return edge.to
      });
    return acc;
  }, {});
}

/**
 * @returns an adjacency list using labels of nodes as keys as opposed to ids
 */
export const getLabelAdjacencyList = ({
  nodes,
  edges,
  getNode
}: Pick<Graph, 'nodes' | 'edges' | 'getNode'>) => {
  const adjList = getAdjacencyList({ nodes, edges });
  const entries = Object.entries(adjList);
  return entries.reduce<AdjacencyList>((acc, [from, tos]) => {
    const keyNode = getNode(from);
    if (!keyNode) return acc;
    const toNodeLabels = tos
      .map(to => getNode(to))
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