import { ref, type Ref } from "vue";
import { useBaseGraph } from "@graph/compositions/useBaseGraph";
import type { GraphOptions } from "@graph/types";

export const useHistoryGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {
  const graph = useBaseGraph(canvas, options);

  const stack = ref([]);

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
    /**
     * where the history is stored. like a history book, but in reverse order.
     * just like in real life, we recommend not re-writing history.
     */
    historyStack: stack,
  }
};