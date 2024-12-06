import { ref, onUnmounted } from "vue";
import type { GEdge, GNode, Graph } from "@graph/types";
import { getAdjacencyList } from "./useAdjacencyList";

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
  const adjacencyList = getAdjacencyList(graph);
  const { getEdgesAlongPath, getEdgeWeight } = graph.helpers;

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

  const processedEdges = new Set<GEdge["id"]>();

  const { isGraphDirected } = graph.settings.value;

  const isEdgeValid = (edge: GEdge, fromId: GNode["id"], toId: GNode["id"]) => {
    const { to, from } = edge;
    return isGraphDirected
      ? from === fromId && to === toId
      : (from === fromId && to === toId) || (from === toId && to === fromId);
  };

  for (const [nodeId, neighbors] of Object.entries(adjacencyList)) {
    const fromIndex = nodeIndexMap[nodeId];

    for (const neighborId of neighbors) {
      const toIndex = nodeIndexMap[neighborId];
      const edges = getEdgesAlongPath(nodeId, neighborId);

      const validEdges = edges.filter((edge) =>
        isEdgeValid(edge, nodeId, neighborId)
      );

      for (const edge of validEdges) {
        const weight = getEdgeWeight(edge.id);

        if (!processedEdges.has(edge.id)) {
          matrix[fromIndex][toIndex] = weight;
          processedEdges.add(edge.id);
        }

        if (
          !isGraphDirected &&
          !processedEdges.has(`${edge.id}-reverse`)
        ) {
          matrix[toIndex][fromIndex] = weight;
          processedEdges.add(`${edge.id}-reverse`);
        }
      }
    }
  }

  return matrix;
};


const getUnweightedTransitionMatrix = (graph: Graph) => {
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
    const fromIndex = nodeIndexMap[nodeId];

    for (const neighbor of neighbors) {
      const toIndex = nodeIndexMap[neighbor];

      matrix[fromIndex][toIndex] = 1;

      if (adjacencyList[neighbor]?.includes(nodeId)) {
        matrix[toIndex][fromIndex] = 1;
      }
    }
  }
  return matrix
}


export const useTransitionMatrix = (graph: Graph) => {
  const transitionMatrix = ref(getTransitionMatrix(graph));
  const unweightedTransitionMatrix = ref(getUnweightedTransitionMatrix(graph));

  const update = () => {
    transitionMatrix.value = getTransitionMatrix(graph);
    unweightedTransitionMatrix.value = getUnweightedTransitionMatrix(graph);
  };

  graph.subscribe("onStructureChange", update);

  onUnmounted(() => {
    graph.unsubscribe("onStructureChange", update);
  });

  return {
    transitionMatrix,
    unweightedTransitionMatrix,
  };
};
