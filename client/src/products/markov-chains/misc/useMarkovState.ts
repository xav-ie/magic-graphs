import type { Graph } from "@graph/types";
import { useComponentAdjacencyMap } from "./useComponentAdjacencyMap";
import { useMarkovClasses } from "./useMarkovClasses";

export const useMarkovState = (graph: Graph) => {
  const componentMap = useComponentAdjacencyMap(graph);
  const classes = useMarkovClasses(graph, componentMap);

  return {
    componentMap,
    classes
  }
}