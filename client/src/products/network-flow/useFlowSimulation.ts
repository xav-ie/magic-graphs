import { computed, ref } from "vue"
import type { GEdge, Graph } from "@graph/types"
import { useTheme } from "@graph/themes/useTheme"
import colors from "@utils/colors"
import { getValue } from "@graph/helpers"
import type { SimulationControls } from "@ui/sim/types"
import { RESIDUAL_ID, useResidualEdges } from "./useResidualEdges"
import { useFordFulkerson } from "./useFordFulkerson"
import type { FlowTrace } from "./fordFulkerson"

export type FlowSimulationControls = SimulationControls<FlowTrace>

export const useFlowSimulation = (graph: Graph): FlowSimulationControls => {

  const { setTheme } = useTheme(graph, 'flow')
  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)
  const { trace } = useFordFulkerson(graph)

  const active = ref(false)
  const activeEdgeIds = ref<string[]>([])
  const step = ref(0)

  const simulationInterval = ref<NodeJS.Timeout | null>(null)
  const paused = ref(false)
  const playbackSpeed = ref(1_500)

  const isOver = computed(() => step.value === trace.value.length)
  const hasBegun = computed(() => step.value > -1)

  const onSimulationInterval = () => {
    if (paused.value || isOver.value) return
    nextStep()
  }

  const start = () => {
    step.value = -1
    graph.settings.value.userEditable = false
    graph.settings.value.focusable = false
    active.value = true
    paused.value = false
    createResidualEdges()

    simulationInterval.value = setInterval(onSimulationInterval, playbackSpeed.value)
  }

  const stop = () => {
    cleanupResidualEdges()
    graph.settings.value.userEditable = true
    graph.settings.value.focusable = true
    activeEdgeIds.value = []
    active.value = false

    if (simulationInterval.value) clearInterval(simulationInterval.value)
  }

  const nextStep = () => {
    if (step.value === trace.value.length) return
    step.value++

    if (step.value === trace.value.length) {
      activeEdgeIds.value = []
      return
    }

    const trackerAtStep = trace.value[step.value]
    activeEdgeIds.value = Object.keys(trackerAtStep)
    const [edge1Id, edge2Id] = activeEdgeIds.value
    const edge1 = graph.getEdge(edge1Id)
    const edge2 = graph.getEdge(edge2Id)

    if (!edge1 || !edge2) throw 'this is all wrong!'
    edge1.label = trackerAtStep[edge1Id].toString()
    edge2.label = trackerAtStep[edge2Id].toString()
  }

  const prevStep = () => {
    if (step.value < -1) return
    step.value--

    if (step.value === -1) {
      activeEdgeIds.value = []
      return
    }

    const goToStep = step.value
    stop()
    start()
    for (let i = 0; i < goToStep + 1; i++) nextStep()
  }

  const colorActiveEdges = (edge: GEdge) => {
    const isActive = activeEdgeIds.value.includes(edge.id)
    if (isActive) return getValue(graph.theme.value.edgeFocusColor, edge)
    else if (edge.id.startsWith(RESIDUAL_ID)) return colors.ORANGE_400
  }

  setTheme('edgeColor', colorActiveEdges)

  return {
    nextStep,
    prevStep,
    setStep: () => { throw 'setStep not implemented' },

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