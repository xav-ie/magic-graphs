import type { Graph } from "@graph/types";
import { CANT_RUN_REASONS } from "@ui/product/sim/cannotRunReasons";
import { useMarkovChain } from "../markov/useMarkovChain";

export const canRunMarkovChain = (graph: Graph) => {
  const { illegalNodeIds } = useMarkovChain(graph)
  return () => {
    const isWeighted = graph.settings.value.displayEdgeLabels
    if (!isWeighted) return CANT_RUN_REASONS.NOT_WEIGHTED
    const nonNegativeWeights = graph.edges.value.every((e) => graph.helpers.getEdgeWeight(e.id) >= 0)
    if (!nonNegativeWeights) return CANT_RUN_REASONS.NEGATIVE_EDGE_WEIGHTS
    const hasNodes = graph.nodes.value.length > 0
    if (!hasNodes) return CANT_RUN_REASONS.NOT_ENOUGH_NODES(1)
    if (illegalNodeIds.value.size > 0) return CANT_RUN_REASONS.INVALID('markov chain')
    return true
  }
}