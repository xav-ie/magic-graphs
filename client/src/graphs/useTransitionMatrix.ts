import {  computed } from "vue";
import type { Fraction } from "mathjs";
import type { BaseGraph } from "./base";
import type { GNode } from "./types";
import type { AdjacencyLists, WeightedAdjacencyList } from "./useAdjacencyList";

/**
 * a 2D array (matrix) where matrix[i][j] represents the absolute weight of
 * transitioning from node i to node j
 */
export type TransitionMatrix<T extends number | Fraction = number> = T[][];

/**
 * generates a transition matrix for a directed or undirected graph
 *
 * @param graph the graph instance
 * @returns a {@link TransitionMatrix}
 */
export const getTransitionMatrix = <T extends number | Fraction>(
  adjList: WeightedAdjacencyList<T>,
  nodeToIndex: Map<GNode['id'], number>
) => {
  const nodeCount = Object.keys(adjList).length;

  const matrix: TransitionMatrix<T> = Array.from({ length: nodeCount }, () =>
    Array(nodeCount).fill(0)
  );

  for (const [nodeId, neighbors] of Object.entries(adjList)) {
    const fromIndex = nodeToIndex.get(nodeId)!;

    for (const neighbor of neighbors) {
      const toIndex = nodeToIndex.get(neighbor.id)!;
      matrix[fromIndex][toIndex] = neighbor.weight;
    }
  }

  return matrix;
};

export const useTransitionMatrix = (graph: BaseGraph & AdjacencyLists) => {
  const {
    nodeIdToIndex,
    weightedAdjacencyList,
    weightedFracAdjacencyList,
  } = graph;

  const transitionMatrix = computed(() => {
    return getTransitionMatrix(weightedAdjacencyList.value, nodeIdToIndex.value);
  })

  const fracTransitionMatrix = computed(() => {
    return getTransitionMatrix(weightedFracAdjacencyList.value, nodeIdToIndex.value);
  })

  return {
    /**
     * the transition matrix for the graph using standard number weights
     */
    transitionMatrix,
    /**
     * the transition matrix for the graph using fraction weights
     */
    fracTransitionMatrix,
  };
};
