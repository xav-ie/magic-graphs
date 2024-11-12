import type { Ref } from "vue";
import { useBaseGraph } from "@graph/compositions/useBaseGraph";
import type { GraphOptions } from "@graph/types";

export const useHistoryGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {
  const graph = useBaseGraph(canvas, options);

  const undo = () => {}

  const redo = () => {}

  return {
    ...graph,

    /**
     * Undo the last action
     */
    undo,
    /**
     * Redo the last action
     */
    redo,
  }
};