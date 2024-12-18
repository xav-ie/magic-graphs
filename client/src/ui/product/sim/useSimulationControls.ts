import { computed, ref, watch } from "vue";
import type { ComputedRef, Ref } from "vue";
import type { Graph } from "@graph/types";
import type { SimulationControls, SimulationTrace } from "@ui/product/sim/types";
import { useLocalStorage } from "@vueuse/core";

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

/**
 * the playback speed in ms per step of the simulation
 */
export const DEFAULT_PLAYBACK_SPEED = 1000;

export const useSimulationControls = <T extends SimulationTrace>(
  graph: Graph,
  trace: ComputedRef<T>,
  options: SimulationControlsOptions = {}
): SimulationControls<T> => {
  const { allowEditingDuringPlayback, lastStep } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  /**
   * the last step of the simulation
   */
  const simLastStep = computed(() => {
    if (lastStep) return lastStep.value; // handles custom
    if (Array.isArray(trace.value)) return trace.value.length; // handles TraceArray<T>
    return Infinity; // handles TraceFunction<T>
  });

  /**
   * the current step of the simulation
   */
  const step = ref(0);

  /**
   * whether the simulation is paused
   */
  const paused = ref(true);

  /**
   * the playback speed in ms per step of the simulation
   */
  const playbackSpeed = useLocalStorage('simulation-playback-speed',DEFAULT_PLAYBACK_SPEED);

  /**
   * whether the simulation is actively being played back (even if paused)
   */
  const active = ref(false);

  /**
   * the interval that advances the simulation
   */
  const interval = ref<NodeJS.Timeout | undefined>();

  /**
   * whether the simulation has reached the last step
   */
  const isOver = computed(() => step.value === simLastStep.value);

  /**
   * whether the simulation is past the initial step
   */
  const hasBegun = computed(() => step.value > 0);

  /**
   * kicks off the simulation playback
   */
  const start = () => {
    if (active.value) return;

    graph.settings.value.interactive = allowEditingDuringPlayback;

    paused.value = false;
    active.value = true;
    step.value = 0;

    setupPlaybackInterval();
  };

  /**
   * shuts down the simulation playback
   */
  const stop = () => {
    if (interval.value) clearInterval(interval.value);
    graph.settings.value.interactive = true;
    active.value = false;
  };

  /**
   * sets up the interval that advances the simulation
   */
  const setupPlaybackInterval = () => {
    if (interval.value) clearInterval(interval.value);
    // this condition should never be true, but
    // this loop should never be executing if the playback is not active
    if (!active.value) return;
    interval.value = setInterval(() => {
      if (isOver.value || paused.value) return;
      nextStep();
    }, playbackSpeed.value);
  };

  // makes the interval reactive to changes in the playback speed
  watch(playbackSpeed, setupPlaybackInterval);

  /**
   * advances the simulation to the next step
   */
  const nextStep = () => {
    if (isOver.value) return;
    step.value++;
  };

  /**
   * rewinds the simulation to the previous step
   */
  const prevStep = () => {
    if (!hasBegun.value) return;
    step.value--;
  };

  /**
   * sets the simulation to a specific step
   */
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

    isOver,
    hasBegun,
    isActive: computed(() => active.value),
    lastStep: simLastStep,
  };
};
