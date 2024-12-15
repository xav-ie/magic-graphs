import { computed } from "vue"
import type { GNode, Graph } from "@graph/types"

/**
 * a map of node ids to the sum of their outgoing edge weights
 */
export type NodeIdToOutgoingWeight = Map<GNode['id'], number>;

/**
 * if a node/state is found to have a sum of outgoing edge weights
 * that is not equal to 1, it is considered illegal.
 * however to account for 0.33 or 0.66 meaning essentially 1/3 and 2/3
 * we allow for a small tolerance
 */
const ILLEGAL_NODE_WEIGHT_TOLERANCE = 0.02;

export const useMarkovNodeWeights = (graph: Graph) => {
  const { getOutboundEdges, getEdgeWeight } = graph.helpers

  const nodeIdToOutgoingWeight = computed(() => {
    return graph.nodes.value.reduce<NodeIdToOutgoingWeight>((acc, node) => {
      const outgoingEdges = getOutboundEdges(node.id);
      const weights = outgoingEdges.map((edge) => getEdgeWeight(edge.id));

      const sum = weights.reduce((acc, curr) => acc + curr, 0);
      acc.set(node.id, sum);

      return acc;
    }, new Map());
  })

  const illegalNodeIds = computed(() => {
    const illegalNodes = new Set<GNode['id']>();

    for (const [nodeId, sum] of nodeIdToOutgoingWeight.value) {
      const illegal = Math.abs(sum - 1) > ILLEGAL_NODE_WEIGHT_TOLERANCE;
      if (illegal) illegalNodes.add(nodeId);
    }

    return illegalNodes;
  });

  return {
    /**
     * maps node ids to the sum of their outgoing edge weights
     */
    nodeIdToOutgoingWeight,
    /**
     * set of node ids with outgoing edge weights not equal to 1 (within tolerance)
     */
    illegalNodeIds,
  };
}