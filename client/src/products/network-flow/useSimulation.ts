import { computed, ref, type Ref } from "vue"
import type { GNode, Graph } from "@graph/types"
import type { SimulationControls } from "@ui/product/sim/types"
import { useFordFulkerson } from "./useFordFulkerson"
import type { FlowTrace } from "./fordFulkerson"

export type FlowSimulationControls = SimulationControls<FlowTrace>

export const useSimulation = (graph: Graph, { source, sink }: {
  source: Ref<GNode | undefined>,
  sink: Ref<GNode | undefined>
}): FlowSimulationControls => {
  const { trace } = useFordFulkerson(graph, { source, sink })

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
    if (active.value) return

    step.value = -1
    graph.settings.value.userEditable = false
    graph.settings.value.focusable = false
    active.value = true
    paused.value = false
    simulationInterval.value = setInterval(onSimulationInterval, playbackSpeed.value)
  }

  const stop = () => {
    graph.settings.value.userEditable = true
    graph.settings.value.focusable = true
    activeEdgeIds.value = []
    active.value = false

    if (simulationInterval.value) clearInterval(simulationInterval.value)
  }

  const nextStep = () => {
    if (step.value === trace.value.length) return
    step.value++
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

  return {
    nextStep,
    prevStep,
    setStep: () => { console.warn('setStep not implemented in useFlowSimulation') },

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