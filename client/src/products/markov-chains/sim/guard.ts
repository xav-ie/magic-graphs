import type { Graph } from "@graph/types";
import { SimulationGuard } from "@ui/product/sim/guard";
import { useMarkovChain } from "../markov/useMarkovChain";
import definitions from "../markov/definitions";

export const canRunMarkovChain = (graph: Graph) => {
  const { illegalNodeIds } = useMarkovChain(graph)
  return new SimulationGuard(graph)
    .weighted()
    .nonNegativeEdgeWeights()
    .minNodes(1)
    .valid(() => illegalNodeIds.value.size === 0, {
      title: 'Requires valid Markov Chain',
      description: definitions.valid,
    })
}