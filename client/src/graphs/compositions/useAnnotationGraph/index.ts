import type { GraphOptions } from "@graph/types";
import type { Ref } from "vue";
import { useMarqueeGraph } from "../useMarqueeGraph";

export const useAnnotationGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {
  const graph = useMarqueeGraph(canvas, options)
  console.log('Annotation graph created')
  return graph
}