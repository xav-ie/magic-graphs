import type { ComputedRef, DeepReadonly, Ref, UnwrapNestedRefs } from "vue";

/**
 * used as a standard for all simulation experiences across all products
 * @template T the type of the trace that the simulation is running on
 */
export type SimulationControls<T extends any[]> = {
  /**
   * skip forward to the next step.
   * wont do anything if the current step is trace.length
   */
  nextStep: () => void
  /**
   * skip backward to the previous step.
   * wont do anything if the current step is -1
   */
  prevStep: () => void

  /**
   * the current trace of the algorithm for which the simulation is being run.
   * do not write
   */
  trace: Ref<T>
  /**
   * the current step of the simulation.
   * ranges from -1 to trace.length where -1 is the state before the algorithm has begun
   * and trace.length is the state after the algorithm has completed
   */
  step: DeepReadonly<UnwrapNestedRefs<number>>
  /**
   * set the current step of the simulation
   * @param step the step to set the simulation to
   * @throws if step is not within the bounds of the trace (-1 to trace.length)
   */
  setStep: (step: number) => void

  /**
   * start the simulation. this will begin the simulation from step -1
   */
  start: () => void
  /**
   * stop the simulation. this will end the simulation and set the step to trace.length
   */
  stop: () => void
  /**
   * pause the simulation. keeps the playback interval running but stops the step from incrementing
   */
  paused: Ref<boolean>
  /**
   * time, in milliseconds, between each step firing.
   */
  playbackSpeed: Ref<number>

  /**
   * whether the simulation is currently active.
   * changes to true when start is called and false when stop is called
   */
  isActive: DeepReadonly<UnwrapNestedRefs<boolean>>
  /**
   * whether the simulation is over.
   * true when the step is trace.length
   */
  isOver: Readonly<ComputedRef<boolean>>
  /**
   * whether the simulation has begun.
   * true when the step is greater than -1
   */
  hasBegun: Readonly<ComputedRef<boolean>>
}