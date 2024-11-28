import { computed, ref } from "vue"
import type { ComputedRef } from "vue"
import type { SimulationControls } from "@ui/product/sim/types";

export const useSimulationControls = <T extends any[]>(trace: ComputedRef<T>): SimulationControls<T> => {
  const step = ref(-1);
  const paused = ref(true);
  const playbackSpeed = ref(1_500);
  const active = ref(false);
  const interval = ref<NodeJS.Timeout | undefined>()
  const isOver = computed(() => step.value === trace.value.length)
  const hasBegun = computed(() => step.value > -1)

  const start = () => {
    console.log('start')
    if (active.value) return

    paused.value = false
    active.value = true
    step.value = -1
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
    if (step.value === trace.value.length) return
    step.value++
  }

  const prevStep = () => {
    if (step.value === -1) return
    step.value--
  }

  const setStep = (newStep: number) => {
    if (newStep < -1 || newStep > trace.value.length) return
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