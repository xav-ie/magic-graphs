import { computed } from 'vue';
import { matrix, multiply, type MathArray, type MathNumericType } from 'mathjs';
import type { Graph } from "@graph/types";
import type { SimulationRunner, TraceFunction } from "@ui/product/sim/types";
import type { TransitionMatrix } from '@graph/useTransitionMatrix';
import { useSimulationControls } from '@ui/product/sim/useSimulationControls';
import { useSimulationTheme } from './theme';

export type MarkovChainTrace = TraceFunction<MathArray<MathNumericType>>
export type MarkovChainSimulationRunner = SimulationRunner<MarkovChainTrace>;

/**
 * performs a matrix multiplication n times to get the state after n steps
 *
 * @param transitionMatrix graph transition matrix
 * @param initialState a vector representing the initial state
 * @param n number of steps to simulate
 * @returns a vector representing the state after n steps
 */
export const getStateAfterNSteps = (
  transitionMatrix: TransitionMatrix,
  initialState: number[],
  n: number
) => {
  let vector = matrix(initialState);
  const transMatrix = matrix(transitionMatrix);

  for (let i = 0; i < n; i++) {
    vector = multiply(vector, transMatrix);
  }

  return vector.toArray()
}

export const useSimulationRunner = (graph: Graph): MarkovChainSimulationRunner => {
  const { transitionMatrix } = graph.transitionMatrix;

  const initialState = computed(() => {
    const stateVector = Array(graph.nodes.value.length).fill(0);
    stateVector[0] = 1;
    return stateVector;
  })

  const trace = computed<MarkovChainTrace>(() => (n) => {
    return getStateAfterNSteps(transitionMatrix.value, initialState.value, n);
  })

  const simControls = useSimulationControls(trace);
  const theme = useSimulationTheme(graph, simControls);

  const start = () => {
    simControls.start();
    theme.theme();
  }

  const stop = () => {
    simControls.stop();
    theme.untheme();
  }

  return {
    start,
    stop,
    simControls,
  }
}