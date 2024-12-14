import { computed } from "vue";
import type { Graph } from "@graph/types";
import { useComponentAdjacencyMap } from "./useComponentAdjacencyMap";
import { useMarkovClasses } from "./useMarkovClasses";
import { useMarkovPeriodicity } from "./useMarkovPeriodicity";

/**
 * reduce an array of sets into a single set
 *
 * @param sets array of sets
 * @returns a single set containing all elements from the input sets
 * @example reduceSet([new Set([1, 2]), new Set([2, 3])]) // Set(1, 2, 3)
 */
export const reduceSet = <T>(sets: Set<T>[]) => {
  return sets.reduce((acc, set) => new Set([...acc, ...set]), new Set<T>())
}

/**
 * reactive markov chain characteristics
 */
export const useMarkovChain = (graph: Graph) => {
  const componentMap = useComponentAdjacencyMap(graph);
  const { recurrentClasses, transientClasses } = useMarkovClasses(graph, componentMap);

  const recurrentStates = computed(() => reduceSet(recurrentClasses.value));
  const transientStates = computed(() => reduceSet(transientClasses.value));

  const { isPeriodic, recurrentClassPeriods } = useMarkovPeriodicity(graph, recurrentClasses);

  // TODO check with a pro to see if this is correct.
  // i am 99% sure it is though
  const isAbsorbing = computed(() => {
    if (recurrentClassPeriods.value.length === 0) return false;
    return recurrentClasses.value.every(recurrentClass => {
      return recurrentClass.size === 1;
    })
  });

  const communicatingClasses = computed(() => {
    return graph.characteristics.stronglyConnectedComponents.value
  })

  return {
    componentMap,
    communicatingClasses,

    recurrentClasses,
    recurrentStates,

    transientClasses,
    transientStates,

    isPeriodic,
    recurrentClassPeriods,

    isAbsorbing,
  }
}

export type MarkovChain = ReturnType<typeof useMarkovChain>;