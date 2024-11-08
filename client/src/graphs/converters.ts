import type { Graph } from '@graph/types';
import { onUnmounted, ref } from 'vue';
import { doesEdgeFlowOutOfToNode } from './helpers';

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
      .filter(edge => doesEdgeFlowOutOfToNode(edge, node))
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
export const useAdjacencyList = (graph: Graph) => {
  const adjList = ref<AdjacencyList>({});
  const labelAdjList = ref<AdjacencyList>({});

  const makeAdjLists = () => {
    adjList.value = getAdjacencyList(graph);
    labelAdjList.value = getLabelAdjacencyList(graph);
  }

  makeAdjLists();

  graph.subscribe('onStructureChange', makeAdjLists);
  onUnmounted(() => graph.unsubscribe('onStructureChange', makeAdjLists));

  return {
    adjacencyList: adjList,
    humanReadableAdjList: labelAdjList
  };
};