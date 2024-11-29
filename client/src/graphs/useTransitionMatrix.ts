import { ref, onUnmounted } from "vue";
import { getAdjacencyList } from "./useAdjacencyList";
import type { Graph, GEdge } from "@graph/types";
import { getEdgesAlongPath } from "./helpers";

export type TransitionMatrix = number[][];

/**
 * Generates a transition matrix for a directed or undirected graph, incorporating edge weights.
 *
 * @param graph - The graph instance
 * @returns A 2D array (matrix) where matrix[i][j] represents the weight or probability of transitioning from node i to node j
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

    const totalEdgeWeight = neighbors.reduce((totalWeight, neighborId) => {
      const edges = getEdgesAlongPath(nodeId, neighborId, graph);
      if (edges.length > 0) {
        const weight = edges.reduce(
          (sum, edge) => sum + getEdgeWeight(edge),
          0
        );
        return totalWeight + weight;
      }
      return totalWeight;
    }, 0);

    if (totalEdgeWeight === 0) continue;

    neighbors.forEach((neighborId) => {
      const edges = getEdgesAlongPath(nodeId, neighborId, graph);
      const colIndex = nodeIndexMap[neighborId];

      if (edges.length > 0) {
        const weight = edges.reduce(
          (sum, edge) => sum + getEdgeWeight(edge),
          0
        );
        const normalizedWeight = weight / totalEdgeWeight;
        matrix[rowIndex][colIndex] = normalizedWeight;
      }
    });
  }

  return matrix;
};

const getEdgeWeight = (edge: GEdge): number => {
  const weight = parseFloat(edge.label);
  return isNaN(weight) ? 0 : weight;
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
