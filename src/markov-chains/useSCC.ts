import type { MaybeRef } from "vue";
import { toRef, computed, watch } from "vue";
import type { AdjacencyList } from "@/graphConverters";
import { getStronglyConnectedComponents } from "./tarjansSCC";
import {
  adjListToAdjMap,
  getComponentAdjMap,
  getNodeToConnectedComponentMap,
  getRecurrentTransientClasses
} from "./helpers";

export const useMarkovChainSCC = (adjacencyList: MaybeRef<AdjacencyList>) => {

  const graphAdjList = toRef(adjacencyList);

  const graphAdjMap = computed(() => adjListToAdjMap(graphAdjList.value));
  const connectedComponents = computed(() => {
    console.log('recomputed connected components with', graphAdjList.value);
    const res = getStronglyConnectedComponents(graphAdjList.value);
    console.log('connected components', JSON.stringify(res));
    return getStronglyConnectedComponents(graphAdjList.value);
  });
  const nodeToConnectedComponentMap = computed(() => getNodeToConnectedComponentMap(connectedComponents.value));
  const componentAdjMap = computed(() => getComponentAdjMap(connectedComponents.value, graphAdjMap.value));
  const markovClasses = computed(() => getRecurrentTransientClasses(connectedComponents.value, componentAdjMap.value));

  return {
    graphAdjList,
    graphAdjMap,
    stronglyCoupledComponents: connectedComponents,
    nodeToConnectedComponentMap,
    componentAdjMap,
    markovClasses,
  }
}