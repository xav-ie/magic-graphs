import { computed, ref } from "vue"
import type { GNode, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import colors from "@utils/colors";
import type { SimulationControls } from "@ui/sim/types";
import { useDijkstra, INF } from "./useDijkstra";
import type { DijkstrasTrace } from "./useDijkstra";

export const SIM_COLORS = {
  SOURCE: colors.AMBER_600,
  EXPLORED: colors.BLUE_500,
  EXPLORING: colors.CYAN_500,
} as const

export type DijkstraSimulatorControls = SimulationControls<DijkstrasTrace>

export const useDijkstraSimulation = (graph: Graph): DijkstraSimulatorControls => {

  const { trace } = useDijkstra(graph)
  const { setTheme } = useTheme(graph, 'dijkstra');

  const step = ref(0);
  const paused = ref(true);
  const playbackSpeed = ref(1_500);
  const active = ref(false);
  const interval = ref<NodeJS.Timeout | undefined>()
  const isOver = computed(() => step.value === trace.value.length - 1)
  const hasBegun = computed(() => step.value > 0)

  const traceAtStep = computed(() => trace.value[step.value])

  const exploredNodeAtStep = computed(() => {
    const seenNodeIds = new Set<string>()
    return trace.value?.reduce<Set<string>[]>((acc, traceStep) => {
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
  })

  const start = () => {
    paused.value = false
    active.value = true
    step.value = 0
    interval.value = setInterval(() => {
      if (isOver.value || paused.value) return
      nextStep()
    }, playbackSpeed.value)
  }

  const stop = () => {
    if (interval.value) clearInterval(interval.value)
    active.value = false
  }

  const nextStep = () => {
    if (!trace.value) return
    if (step.value === trace.value.length - 1) return
    step.value++
  }

  const prevStep = () => {
    if (step.value === 0) return
    step.value--
  }

  const setStep = (newStep: number) => {
    if (newStep < -1 || newStep > trace.value.length) return
    step.value = newStep
  }

  const colorBorders = (node: GNode) => {
    if (!active.value) return
    if (graph.isFocused(node.id)) return

    if (!traceAtStep.value) return
    if (traceAtStep.value.source.id === node.id) return SIM_COLORS.SOURCE

    if (!exploredNodeAtStep.value) return;

    const idsInCurrStep = exploredNodeAtStep.value[step.value]
    if (idsInCurrStep.has(node.id)) return SIM_COLORS.EXPLORING

    const hasExplored = exploredNodeAtStep.value.slice(0, step.value).some((ids) => ids.has(node.id))
    if (hasExplored) return SIM_COLORS.EXPLORED
  }

  const nodeDistanceText = (node: GNode) => {
    if (!active.value) return
    if (!traceAtStep.value) return
    const { distances } = traceAtStep.value
    const nodeDist = distances.find((dist) => dist.id === node.id)
    if (!nodeDist) return '?'
    if (nodeDist.distance === INF) return 'Inf'
    return nodeDist.distance.toString()
  }

  setTheme('nodeBorderColor', colorBorders)
  setTheme('nodeAnchorColor', colorBorders)
  setTheme('nodeText', nodeDistanceText)

  return {
    nextStep,
    prevStep,
    setStep,

    trace: computed(() => trace.value),
    step: computed(() => step.value),

    start,
    stop,
    paused,
    playbackSpeed,

    isOver,
    hasBegun,
    isActive: computed(() => active.value),
  }
}