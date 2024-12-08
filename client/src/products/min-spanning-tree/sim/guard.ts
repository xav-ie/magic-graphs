import type { Graph } from '@graph/types'
import { CANT_RUN_REASONS } from '@ui/product/sim/cannotRunReasons'

export const canRunMST = (graph: Graph) => () => {
  const isDirected = graph.settings.value.isGraphDirected
  if (isDirected) return CANT_RUN_REASONS.NOT_UNDIRECTED
  const isWeighted = graph.settings.value.displayEdgeLabels
  if (!isWeighted) return CANT_RUN_REASONS.NOT_WEIGHTED
  const hasAtLeastOneEdge = graph.edges.value.length >= 1
  if (!hasAtLeastOneEdge) return CANT_RUN_REASONS.NOT_ENOUGH_EDGES(1)
  const isConnected = graph.characteristics.isConnected.value
  if (!isConnected) return CANT_RUN_REASONS.NOT_CONNECTED
  return true
}