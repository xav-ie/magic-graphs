import type { GEdge, Graph } from "@graph/types"
import { fordFulkerson } from "./fordFulkerson"
import { SINK_LABEL, SOURCE_LABEL } from "./useFlowControls"
import { computed, ref } from "vue"
import { useTheme } from "@graph/themes/useTheme"
import colors from "@utils/colors"
import { getValue } from "@graph/helpers"
import { RESIDUAL_ID, useResidualEdges } from "./useResidualEdges"

export const useFlowSimulation = (graph: Graph) => {

  const { setTheme } = useTheme(graph, 'flow')

  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)

  const simulationActive = ref(false)
  const activeEdgeIds = ref<string[]>([])
  const step = ref(0)
  const tracker = ref<Record<string, number>[]>([])
  const simulationInterval = ref<NodeJS.Timeout | null>(null)
  const simulationPaused = ref(false)

  const isSimulationOver = computed(() => step.value === tracker.value.length)
  const hasSimulationBegun = computed(() => step.value > -1)

  const refreshTrace = async () => {
    createResidualEdges()

    const src = graph.nodes.value.find(n => n.label === SOURCE_LABEL)
    const sink = graph.nodes.value.find(n => n.label === SINK_LABEL)
    if (!src || !sink) return cleanupResidualEdges()
    tracker.value = fordFulkerson(graph, src.id, sink.id).tracker
    cleanupResidualEdges()
  }

  const onSimulationInterval = () => {
    if (simulationPaused.value || isSimulationOver.value) return
    nextStep()
  }

  const startSimulation = () => {
    step.value = -1
    graph.settings.value.userEditable = false
    graph.settings.value.focusable = false
    simulationActive.value = true
    simulationPaused.value = false
    createResidualEdges()

    simulationInterval.value = setInterval(onSimulationInterval, 1_500)
    graph.repaint('flow-simulation/start-simulation')()
  }

  const stopSimulation = () => {
    cleanupResidualEdges()
    graph.settings.value.userEditable = true
    graph.settings.value.focusable = true
    activeEdgeIds.value = []
    simulationActive.value = false

    if (simulationInterval.value) clearInterval(simulationInterval.value)
    graph.repaint('flow-simulation/stop-simulation')()
  }

  const nextStep = () => {
    if (step.value === tracker.value.length) return
    step.value++

    if (step.value === tracker.value.length) {
      activeEdgeIds.value = []
      graph.repaint('flow-simulation/next-step')()
      return
    }

    const trackerAtStep = tracker.value[step.value]
    activeEdgeIds.value = Object.keys(trackerAtStep)
    const [edge1Id, edge2Id] = activeEdgeIds.value
    const edge1 = graph.getEdge(edge1Id)
    const edge2 = graph.getEdge(edge2Id)

    if (!edge1 || !edge2) throw 'this is all wrong!'
    edge1.label = trackerAtStep[edge1Id].toString()
    edge2.label = trackerAtStep[edge2Id].toString()

    graph.repaint('flow-simulation/next-step')()
  }

  const prevStep = () => {
    if (step.value < -1) return
    step.value--

    if (step.value === -1) {
      activeEdgeIds.value = []
      graph.repaint('flow-simulation/prev-step')()
      return
    }

    const goToStep = step.value
    stopSimulation()
    startSimulation()
    for (let i = 0; i < goToStep + 1; i++) nextStep()
  }

  const colorActiveEdges = (edge: GEdge) => {
    const isActive = activeEdgeIds.value.includes(edge.id)
    if (isActive) return getValue(graph.theme.value.edgeFocusColor, edge)
    else if (edge.id.startsWith(RESIDUAL_ID)) return colors.ORANGE_400
  }

  setTheme('edgeColor', colorActiveEdges)

  graph.subscribe('onStructureChange', refreshTrace)
  graph.subscribe('onEdgeLabelChange', refreshTrace)

  return {
    nextStep,
    prevStep,
    startSimulation,
    stopSimulation,
    simulationActive,
    activeEdgeIds,
    step,

    isSimulationOver,
    hasSimulationBegun,

    simulationPaused,
  }
}

export type FlowSimulationControls = ReturnType<typeof useFlowSimulation>