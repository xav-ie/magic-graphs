import { matrix, multiply } from 'mathjs';
import type { Graph } from "@graph/types";
import type { SimulationRunner, TraceFunction } from "@ui/product/sim/types";
import type { TransitionMatrix } from '@graph/useTransitionMatrix';
import { computed } from 'vue';

export type MarkovChainTrace = TraceFunction<number[]>;
export type MarkovChainSimulationRunner = SimulationRunner<MarkovChainTrace>;

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

  return vector.toArray().map((entry) => parseFloat(Number(entry).toFixed(4)));
}

export const useSimulationRunner = (graph: Graph) => {

  const { transitionMatrix } = graph.transitionMatrix

  const initialState = computed(() => {
    const stateVector = Array(graph.nodes.value.length).fill(0);
    stateVector[0] = 1;
    return stateVector;
  })

  const trace = computed<MarkovChainTrace>(() => (n) => {
    return getStateAfterNSteps(transitionMatrix.value, initialState.value, n);
  })

}