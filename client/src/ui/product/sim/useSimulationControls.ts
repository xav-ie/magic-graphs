import { computed, ref } from "vue"
import type { ComputedRef } from "vue"
import type { SimulationControls } from "@ui/product/sim/types";

export const useSimulationControls = <T extends any[]>(trace: ComputedRef<T>): SimulationControls<T> => {
  const step = ref(0);
  const paused = ref(true);
  const playbackSpeed = ref(1_500);
  const active = ref(false);
  const interval = ref<NodeJS.Timeout | undefined>()
  const isOver = computed(() => step.value === trace.value.length)
  const hasBegun = computed(() => step.value > 0)

  const start = () => {
    if (active.value) return

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
    if (isOver.value) return
    step.value++
  }

  const prevStep = () => {
    if (!hasBegun.value) return
    step.value--
  }

  const setStep = (newStep: number) => {
    if (newStep < 0 || newStep > trace.value.length) return
    step.value = newStep
  }

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
  }
}