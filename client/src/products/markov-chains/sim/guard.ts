import type { Graph } from "@graph/types";
import { SimulationGuard } from "@ui/product/sim/guard";
import { useMarkovChain } from "../markov/useMarkovChain";

export const canRunMarkovChain = (graph: Graph) => {
  const { illegalNodeIds } = useMarkovChain(graph)
  return new SimulationGuard(graph)
    .weighted()
    .nonNegativeEdgeWeights()
    .minNodes(1)
    .invalid(() => illegalNodeIds.value.size > 0, 'markov chain')
}