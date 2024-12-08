import type { BaseGraph } from "@graph/base";
import { useConnected } from "./useConnected";

export const useCharacteristics = (graph: BaseGraph) => {

  const connectedState = useConnected(graph)

  return {
    ...connectedState,
  }
}