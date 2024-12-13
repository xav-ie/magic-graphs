import { computed, ref, watch } from "vue";
import type { ComputedRef, Ref } from "vue";
import { graph } from "@graph/global";
import type { SimulationControls } from "@ui/product/sim/types";

type SimulationControlsOptions = {
  /**
   * if true, the user can edit the graph while the simulation is running
   * @default true
   */
  allowEditingDuringPlayback?: boolean;
  /**
   * if set, the simulation will stop when the step reaches this value
   * @default trace.length
   */
  lastStep?: Ref<number>;
};

const DEFAULT_OPTIONS = {
  allowEditingDuringPlayback: true,
} as const;

export const useSimulationControls = <T extends any[]>(
  trace: ComputedRef<T>,
  options: SimulationControlsOptions = {}
): SimulationControls<T> => {
  const { allowEditingDuringPlayback, lastStep } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const DEFAULT_PLAYBACK_SPEED = 1_500;

  const simLastStep = computed(() => lastStep?.value ?? trace.value.length);
  const step = ref(0);
  const paused = ref(true);
  const playbackSpeed = ref(DEFAULT_PLAYBACK_SPEED);
  const active = ref(false);
  const interval = ref<NodeJS.Timeout | undefined>();
  const isOver = computed(() => step.value === simLastStep.value);
  const hasBegun = computed(() => step.value > 0);

  const playbackSpeedToMs = [
    { 
      label: "0.5x", 
      value: DEFAULT_PLAYBACK_SPEED / 0.5 
    },
    { 
      label: "1x", 
      value: DEFAULT_PLAYBACK_SPEED 
    },
    { 
      label: "2x", 
      value: DEFAULT_PLAYBACK_SPEED / 2
    },
  ];

  const start = () => {
    if (active.value) return;

    graph.value.settings.value.interactive = allowEditingDuringPlayback;

    paused.value = false;
    active.value = true;
    step.value = 0;

    setupPlaybackInterval();
  };

  const stop = () => {
    if (interval.value) clearInterval(interval.value);
    graph.value.settings.value.interactive = true;
    active.value = false;
  };

  const setupPlaybackInterval = () => {
    if (interval.value) clearInterval(interval.value);
    interval.value = setInterval(() => {
      if (isOver.value || paused.value) return;
      nextStep();
    }, playbackSpeed.value);
  };

  watch(playbackSpeed, () => {
    if (active.value) setupPlaybackInterval();
  });

  const nextStep = () => {
    if (isOver.value) return;
    step.value++;
  };

  const prevStep = () => {
    if (!hasBegun.value) return;
    step.value--;
  };

  const setStep = (newStep: number) => {
    if (newStep < 0 || newStep > simLastStep.value) return;
    step.value = newStep;
  };

  return {
    nextStep,
    prevStep,
    setStep,

    trace,
    step: computed(() => step.value),

    start,
    stop,
    paused,
    playbackSpeed,
    playbackSpeedToMs,

    isOver,
    hasBegun,
    isActive: computed(() => active.value),
    lastStep: simLastStep,
  };
};
