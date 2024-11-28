import type { ComputedRef, Ref } from "vue";

/**
 * used as a standard for all simulation experiences across all products
 *
 * @template T the type of the trace that the simulation is running on
 */
export type SimulationControls<T extends any[] = any[]> = {
  /**
   * skip forward to the next step.
   * wont do anything if the current step is trace.length
   */
  nextStep: () => void
  /**
   * skip backward to the previous step.
   * wont do anything if the current step is 0
   */
  prevStep: () => void

  /**
   * the current trace of the algorithm for which the simulation is being run.
   */
  trace: ComputedRef<T>
  /**
   * the current step of the simulation.
   * ranges from 0 to trace.length where 0 is the state before the algorithm has begun
   * and trace.length is the state after the algorithm has completed.
   */
  step: ComputedRef<number>
  /**
   * set the current step of the simulation
   * @param step the step to set the simulation to
   * @throws if step is not within the bounds of the trace (0 to trace.length)
   */
  setStep: (step: number) => void

  /**
   * start the simulation. this will begin the simulation from step -1
   */
  start: () => void
  /**
   * stop the simulation. this will end the simulation and reset all state
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
  isActive: ComputedRef<boolean>
  /**
   * whether the simulation is over.
   * true when the step is trace.length
   */
  isOver: ComputedRef<boolean>
  /**
   * whether the simulation has begun.
   * true when the step is greater than 0
   */
  hasBegun: ComputedRef<boolean>
}

/**
 * wraps around simulation controls to provide a standard interface for
 * the work of setting up and running of simulations, ie prompting the user to select a starting node,
 * source/sink nodes, etc.
 *
 * @template T the type of the trace that the simulation is running on
 */
export type SimulationRunner<T extends any[] = any[]> = {
  /**
   * Start the simulation
   */
  start: () => Promise<void> | void
  /**
   * Stop the simulation
   */
  stop: () => Promise<void> | void
  /**
   * Whether the simulation is currently running or in start up
   * ie user is selecting the starting node
   */
  running: ComputedRef<boolean>
  /**
   * The controls for the simulation
   */
  simControls: SimulationControls<T>
}