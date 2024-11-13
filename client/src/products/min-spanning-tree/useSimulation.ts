import { computed, ref, type Ref } from "vue"
import type { Graph, GEdge } from "@graph/types";
import type { SimulationControls } from "@ui/sim/types";
import { useKruskal } from "./kruskal";
import { usePrims } from "./prim";
import { useColorizeGraph } from "./useColorizeGraph";
import { useTheme } from "@graph/themes/useTheme";

export type MSTSumilationControls = SimulationControls<GEdge[]>
export type Algorithm = "kruskal" | "prim" | 'none';


export const useMSTSimulation = (graph: Graph, currentAlgorithm: Ref<Algorithm>): MSTSumilationControls => {

  const { trace: kTrace } = useKruskal(graph)
  const { trace: pTrace } = usePrims(graph)

  const trace = computed(() => {
    if (currentAlgorithm.value === 'none') return graph.edges.value 
    else if (currentAlgorithm.value === "prim") return pTrace.value
    else return kTrace.value
  })

  const { removeAllThemes } = useTheme(graph, 'mst')

  const step = ref(0);
  const paused = ref(true);
  const playbackSpeed = ref(1_500);
  const active = ref(false);
  const interval = ref<NodeJS.Timeout | undefined>()
  const isOver = computed(() => step.value === trace.value.length)
  const hasBegun = computed(() => step.value > 0)

  const traceAtStep = computed(() => trace.value.slice(0, step.value))

  const start = () => {
    paused.value = false
    active.value = true
    step.value = 0
    interval.value = setInterval(() => {
      if (isOver.value || paused.value) return
      nextStep()
    }, playbackSpeed.value)
    useColorizeGraph(graph, traceAtStep.value)
  }

  const stop = () => {
    if (interval.value) clearInterval(interval.value)
    active.value = false
    removeAllThemes()
  }

  const nextStep = () => {
    if (!trace.value) return
    if (step.value === trace.value.length + 1) return
    step.value++

    useColorizeGraph(graph, traceAtStep.value)
  }

  const prevStep = () => {
    if (step.value === 0) return
    step.value--

    useColorizeGraph(graph, traceAtStep.value)
  }

  const setStep = (newStep: number) => {
    if (newStep < -1 || newStep > trace.value.length) return
    step.value = newStep

    useColorizeGraph(graph, traceAtStep.value)
  }

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