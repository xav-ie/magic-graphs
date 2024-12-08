import type { BaseGraph } from "@graph/base";
import { useConnected } from "./useConnected";
import type { AdjacencyLists } from "@graph/useAdjacencyList";

export const useCharacteristics = (graph: BaseGraph & {
  adjacencyLists: AdjacencyLists,
}) => {
  const connectedState = useConnected(graph.adjacencyLists);

  return {
    ...connectedState,
  }
}