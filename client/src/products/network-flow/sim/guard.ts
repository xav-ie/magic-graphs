import type { Graph } from "@graph/types"
import { CANT_RUN_REASONS } from "@ui/product/sim/cannotRunReasons"

export const canRunFordFulkerson = (graph: Graph) => () => {
  const isWeighted = graph.settings.value.displayEdgeLabels
  if (!isWeighted) return CANT_RUN_REASONS.NOT_WEIGHTED
  const isDirected = graph.settings.value.isGraphDirected
  if (!isDirected) return CANT_RUN_REASONS.NOT_DIRECTED
  const hasAtLeastTwoNodes = graph.nodes.value.length >= 2
  if (!hasAtLeastTwoNodes) return CANT_RUN_REASONS.NOT_ENOUGH_NODES(2)
  const { hasBidirectionalEdges } = graph.characteristics
  if (hasBidirectionalEdges.value) return CANT_RUN_REASONS.NOT_BIDIRECTIONAL
}