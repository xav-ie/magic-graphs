import { ref, onUnmounted } from "vue";
import type { Graph } from "@graph/types";
import { getAdjacencyList } from "./useAdjacencyList";
import { getEdgesAlongPath, getEdgeWeight } from "./helpers";

export type TransitionMatrix = number[][];

/**
 * Generates a transition matrix for a directed or undirected graph
 *
 * @param graph - The graph instance
 * @returns A 2D array (matrix) where matrix[i][j] represents the
 * absolute weight of transitioning from node i to node j
 */
export const getTransitionMatrix = (graph: Graph): TransitionMatrix => {
  const nodes = graph.nodes.value;
  const nodeCount = nodes.length;
  const adjacencyList = getAdjacencyList(graph);

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
    const rowIndex = nodeIndexMap[nodeId];

    neighbors.forEach((neighborId) => {
      const edges = getEdgesAlongPath(nodeId, neighborId, graph).filter(
        (edge) => edge.from === nodeId && edge.to === neighborId
      );
      const colIndex = nodeIndexMap[neighborId];

      if (edges.length > 0) {
        const weight = edges.reduce(
          (sum, edge) => sum + getEdgeWeight(edge, graph),
          0
        );
        matrix[rowIndex][colIndex] = weight;
      }
    });
  }

  return matrix;
};

export const useTransitionMatrix = (graph: Graph) => {
  const transitionMatrix = ref<TransitionMatrix>([]);

  const update = () => {
    transitionMatrix.value = getTransitionMatrix(graph);
  };

  graph.subscribe("onStructureChange", update);
  graph.subscribe("onEdgeLabelChange", update);

  onUnmounted(() => {
    graph.unsubscribe("onStructureChange", update);
    graph.unsubscribe("onEdgeLabelChange", update);
  });

  update();

  return {
    transitionMatrix,
  };
};
