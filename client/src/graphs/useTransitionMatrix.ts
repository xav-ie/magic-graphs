import { ref, onUnmounted } from "vue";
import type { DeepPartial } from "ts-essentials";
import type { BaseGraph } from "./base";
import { getWeightedAdjacencyList } from "./useAdjacencyList";
import type { GraphSettings } from "./settings";

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
export const getTransitionMatrix = (graph: BaseGraph): TransitionMatrix => {
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
      matrix[fromIndex][toIndex] = neighbor.weight;
    }
  }

  return matrix;
};

export const useTransitionMatrix = (graph: BaseGraph) => {
  const transitionMatrix = ref(getTransitionMatrix(graph));

  const update = () => {
    transitionMatrix.value = getTransitionMatrix(graph);
  };

  const checkForUpdate = (diff: DeepPartial<GraphSettings>) => {
    // TODO investigate why this is being invoked twice when the graph settings
    // change from directed to undirected
    if (diff.isGraphDirected !== undefined) update();
  }

  graph.subscribe("onStructureChange", update);
  graph.subscribe("onSettingsChange", checkForUpdate);

  onUnmounted(() => {
    graph.unsubscribe("onStructureChange", update);
    graph.unsubscribe("onSettingsChange", checkForUpdate);
  });

  return {
    transitionMatrix,
  };
};
