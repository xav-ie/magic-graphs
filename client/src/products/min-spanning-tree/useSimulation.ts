import { computed, ref, type Ref } from "vue";
import type { Graph, GEdge } from "@graph/types";
import type { SimulationControls } from "@ui/product/sim/types";
import { useKruskal } from "./useKruskal";
import { usePrim } from "./usePrim";
import { useMSTColorizer } from "./useMSTColorizer";

export type MSTSimulationControls = SimulationControls<GEdge[]>;
export const MST_ALGORITHMS = ["kruskal", "prim"] as const;
export type MSTAlgorithm = typeof MST_ALGORITHMS[number];

export const useMSTSimulation = (
  graph: Graph,
  currentAlgorithm: Ref<MSTAlgorithm>
): MSTSimulationControls => {

  const kruskalTrace = useKruskal(graph);
  const primsTrace = usePrim(graph);

  const trace = computed(() => {
    if (currentAlgorithm.value === "prim") return primsTrace.value;
    else return kruskalTrace.value;
  });

  const step = ref(0);
  const paused = ref(true);
  const playbackSpeed = ref(1_500);
  const active = ref(false);
  const interval = ref<NodeJS.Timeout | undefined>();

  const hasBegun = computed(() => step.value > 0);
  const isOver = computed(() => step.value === trace.value.length + 1);

  const traceAtStep = computed(() => trace.value.slice(0, step.value));

  const { colorize, decolorize } = useMSTColorizer(graph, traceAtStep);

  const start = () => {
    if (active.value) return;

    paused.value = false;
    active.value = true;
    step.value = 0;
    colorize();
    interval.value = setInterval(() => {
      if (isOver.value || paused.value) return;
      nextStep();
    }, playbackSpeed.value);
  };

  const stop = () => {
    if (interval.value) clearInterval(interval.value);
    active.value = false;
    decolorize();
  };

  const nextStep = () => {
    if (isOver.value) return;
    step.value++;
  };

  const prevStep = () => {
    if (!hasBegun.value) return;
    step.value--;
  };

  const setStep = (newStep: number) => {
    if (newStep < -1 || newStep > trace.value.length) return;
    step.value = newStep;
  };

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
    // progress: computed(() => `${step.value} / ${trace.value.length}`),
  };
};
