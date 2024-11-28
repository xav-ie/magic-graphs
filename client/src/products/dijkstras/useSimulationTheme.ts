import { computed } from "vue";
import type { GNode, Graph } from "@graph/types";
import type { DijkstraSimulatorControls } from "./useSimulation";
import { INF } from "./dijkstra";
import { useTheme } from "@graph/themes/useTheme";
import colors from "@utils/colors";

export const SIM_COLORS = {
  SOURCE: colors.AMBER_600,
  EXPLORED: colors.BLUE_500,
  EXPLORING: colors.CYAN_500,
} as const

export const INF_STR = 'Inf'

export const useSimulationTheme = (graph: Graph, sim: DijkstraSimulatorControls) => {
  const { trace, step } = sim;
  const { setTheme, removeAllThemes } = useTheme(graph, 'dijkstra');

  const traceAtStep = computed(() => trace.value[step.value])

  const exploredNodeAtStep = computed(() => {
    const seenNodeIds = new Set<string>()

    const res = trace.value.reduce<Set<string>[]>((acc, traceStep) => {
      const nodeIdsAtStep = new Set<string>()
      const thisStepsNodeIds = traceStep.exploredNodes.map((i) => i.id)

      for (const nodeId of thisStepsNodeIds) {
        if (seenNodeIds.has(nodeId)) continue
        seenNodeIds.add(nodeId)
        nodeIdsAtStep.add(nodeId)
      }

      acc.push(nodeIdsAtStep)
      return acc
    }, [])

    res.push(res.at(-1) ?? new Set())
    return res
  })

  const colorBorders = (node: GNode) => {
    if (graph.isFocused(node.id)) return

    if (step.value === -1) return

    if (traceAtStep.value?.source.id === node.id) return SIM_COLORS.SOURCE

    const idsInCurrStep = exploredNodeAtStep.value[step.value]
    if (idsInCurrStep.has(node.id)) return SIM_COLORS.EXPLORING

    const hasExplored = exploredNodeAtStep.value.slice(0, step.value).some((ids) => ids.has(node.id))
    if (hasExplored) return SIM_COLORS.EXPLORED
  }

  const nodeDistanceText = (node: GNode) => {
    if (!traceAtStep.value && step.value === -1) return INF_STR

    const { distances } = traceAtStep.value ?? trace.value.at(-1)
    const nodeDist = distances.find((dist) => dist.id === node.id)

    if (!nodeDist) return '?'
    if (nodeDist.distance === INF) return INF_STR

    return nodeDist.distance.toString()
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