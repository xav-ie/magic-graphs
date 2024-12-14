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
 *
 *
 */
export const useMarkovCharacteristics = (graph: Graph) => {
  const componentMap = useComponentAdjacencyMap(graph);
  const { recurrentClasses, transientClasses } = useMarkovClasses(graph, componentMap);

  const recurrentStates = computed(() => reduceSet(recurrentClasses.value));
  const transientStates = computed(() => reduceSet(transientClasses.value));

  const { isPeriodic, recurrentClassPeriods } = useMarkovPeriodicity(graph, recurrentClasses);

  return {
    componentMap,

    recurrentClasses,
    recurrentStates,

    transientClasses,
    transientStates,

    isPeriodic,
    recurrentClassPeriods,
  }
}