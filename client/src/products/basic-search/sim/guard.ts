import type { Graph } from "@graph/types";
import { CANT_RUN_REASONS } from "@ui/product/sim/cannotRunReasons";

export const canRunBasicSearch = (graph: Graph) => () => {
  const hasNodes = graph.nodes.value.length > 0
  if (!hasNodes) return CANT_RUN_REASONS.NOT_ENOUGH_NODES(1)
}