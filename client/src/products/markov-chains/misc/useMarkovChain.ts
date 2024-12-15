import { computed } from "vue";
import type { Graph } from "@graph/types";
import { reduceSet } from "@utils/sets";
import { useComponentAdjacencyMap } from "./useComponentAdjacencyMap";
import { useMarkovClasses } from "./useMarkovClasses";
import { useMarkovPeriodicity } from "./useMarkovPeriodicity";
import { useMarkovSteadyState } from "./useMarkovSteadyState";
import { useMarkovNodeWeights } from "./useMarkovNodeWeights";

/**
 * reactive markov chain characteristics
 */
export const useMarkovChain = (graph: Graph) => {
  const componentMap = useComponentAdjacencyMap(graph);
  const {
    recurrentClasses,
    transientClasses,
    nodeIdToRecurrentClassIndex,
    nodeIdToTransientClassIndex,
  } = useMarkovClasses(graph, componentMap);

  const recurrentStates = computed(() => reduceSet(recurrentClasses.value));
  const transientStates = computed(() => reduceSet(transientClasses.value));

  const { isPeriodic, recurrentClassPeriods } = useMarkovPeriodicity(graph, recurrentClasses);

  // TODO check with a pro to see if this is correct.
  const isAbsorbing = computed(() => {
    if (recurrentClassPeriods.value.length === 0) return false;
    return recurrentClasses.value.every(recurrentClass => {
      return recurrentClass.size === 1;
    })
  });

  const communicatingClasses = computed(() => {
    return graph.characteristics.stronglyConnectedComponents.value
  });

  const { nodeIdToOutgoingWeight, illegalNodeIds } = useMarkovNodeWeights(graph);

  const steadyState = useMarkovSteadyState(graph, {
    recurrentClasses,
    illegalNodeIds,
  });

  return {
    componentMap,
    communicatingClasses,

    recurrentClasses,
    recurrentStates,
    recurrentClassPeriods,
    nodeIdToRecurrentClassIndex,

    transientClasses,
    transientStates,
    nodeIdToTransientClassIndex,

    isPeriodic,
    isAbsorbing,

    steadyState,

    nodeIdToOutgoingWeight,
    illegalNodeIds,
  }
}

export type MarkovChain = ReturnType<typeof useMarkovChain>;