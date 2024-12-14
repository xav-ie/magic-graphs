import type { Graph } from "@graph/types";
import { useComponentAdjacencyMap } from "./useAdjacentComponents";

export const useMarkovState = (graph: Graph) => {
  const componentMap = useComponentAdjacencyMap(graph);
}