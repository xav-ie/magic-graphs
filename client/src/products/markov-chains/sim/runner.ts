import { computed } from 'vue';
import { Fraction } from 'mathjs';
import type { MathArray, MathNumericType } from 'mathjs';
import type { Graph } from "@graph/types";
import type { SimulationRunner, TraceFunction } from "@ui/product/sim/types";
import { useSimulationControls } from '@ui/product/sim/useSimulationControls';
import { useSimulationTheme } from './theme';
import { useStateAfterNSteps } from './useStateAfterNSteps';

export type MarkovChainTrace = TraceFunction<MathArray<MathNumericType>>
export type MarkovChainSimulationRunner = SimulationRunner<MarkovChainTrace>;

export const useSimulationRunner = (graph: Graph): MarkovChainSimulationRunner => {
  const { fracTransitionMatrix } = graph.transitionMatrix;

  const initialState = computed(() => {
    const stateVector: Fraction[] = []
    for (let i = 0; i < fracTransitionMatrix.value.length; i++) {
      stateVector.push(new Fraction(0));
    }
    stateVector[0] = new Fraction(1);
    return stateVector;
  })

  const trace = useStateAfterNSteps(fracTransitionMatrix, initialState);

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