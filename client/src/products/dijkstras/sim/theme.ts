import { computed } from "vue";
import type { GNode, Graph } from "@graph/types";
import type { SimulationControls } from "@ui/product/sim/types";
import { useTheme } from "@graph/themes/useTheme";
import colors from "@utils/colors";
import type { DijkstrasTrace } from "../algo/useDijkstra";

export const SIM_COLORS = {
  SOURCE: colors.AMBER_600,
  EXPLORED: colors.BLUE_500,
  QUEUED: colors.CYAN_500,
} as const

export const INF_STR = 'Inf'

export const useSimulationTheme = (
  graph: Graph,
  sim: SimulationControls<DijkstrasTrace>
) => {
  const { trace, step } = sim;
  const { setTheme, removeAllThemes } = useTheme(graph, 'dijkstra');

  const traceAtStep = computed(() => trace.value[step.value])

  const colorBorders = (node: GNode) => {
    if (graph.isFocused(node.id)) return
    if (traceAtStep.value.currentNode?.id === node.id) return SIM_COLORS.SOURCE
    if (traceAtStep.value.queue.has(node.id)) return SIM_COLORS.QUEUED
    if (traceAtStep.value.distances[node.id] !== Infinity) return SIM_COLORS.EXPLORED
  }

  const nodeDistanceText = (node: GNode) => {
    if (graph.isFocused(node.id)) return
    const distance = traceAtStep.value.distances[node.id]
    return distance === Infinity ? INF_STR : distance.toString()
  }

  const activate = () => {
    setTheme('nodeBorderColor', colorBorders)
    setTheme('nodeAnchorColor', colorBorders)
    setTheme('nodeText', nodeDistanceText)
  }

  const deactivate = () => {
    removeAllThemes()
  }

  return {
    activate,
    deactivate,
  }
}