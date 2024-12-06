import { ref, onUnmounted } from "vue";
import type { GEdge, GNode, Graph } from "@graph/types";
import { getWeightedAdjacencyList } from "./useAdjacencyList";

/**
 * a 2D array (matrix) where matrix[i][j] represents the absolute weight of
 * transitioning from node i to node j
 */
export type TransitionMatrix = number[][];

/**
 * generates a transition matrix for a directed or undirected graph
 *
 * @param graph - The graph instance
 * @returns a 2D array (matrix) where matrix[i][j] represents the
 * absolute weight of transitioning from node i to node j
 */
export const getTransitionMatrix = (graph: Graph): TransitionMatrix => {
  const nodes = graph.nodes.value;
  const nodeCount = nodes.length;
  const adjacencyList = getWeightedAdjacencyList(graph);

  const nodeIndexMap = nodes.reduce<Record<string, number>>(
    (acc, node, index) => {
      acc[node.id] = index;
      return acc;
    },
    {}
  );

  const matrix = Array.from({ length: nodeCount }, () =>
    Array(nodeCount).fill(0)
  );

  for (const [nodeId, neighbors] of Object.entries(adjacencyList)) {
    const fromIndex = nodeIndexMap[nodeId];

    for (const neighbor of neighbors) {
      const toIndex = nodeIndexMap[neighbor.id];
      matrix[fromIndex][toIndex] = neighbor.weight
    }
  }

  return matrix;
};

export const useTransitionMatrix = (graph: Graph) => {
  const transitionMatrix = ref(getTransitionMatrix(graph));

  const update = () => {
    transitionMatrix.value = getTransitionMatrix(graph);
  };

  graph.subscribe("onStructureChange", update);

  onUnmounted(() => {
    graph.unsubscribe("onStructureChange", update);
  });

  return {
    transitionMatrix,
  };
};
