import { computed } from 'vue';
import { Fraction } from 'mathjs';
import type { Graph } from "@graph/types";
import type { SimulationRunner, TraceFunction } from "@ui/product/sim/types";
import { useSimulationControls } from '@ui/product/sim/useSimulationControls';
import { useSimulationTheme } from './theme';
import { useStateAfterNSteps } from '../markov/useStateAfterNSteps';
import state from '../state';

const { initialState } = state

export type MarkovChainTrace = TraceFunction<Fraction[]>
export type MarkovChainSimulationRunner = SimulationRunner<MarkovChainTrace>;

export const useSimulationRunner = (graph: Graph): MarkovChainSimulationRunner => {
  const { fracTransitionMatrix } = graph.transitionMatrix;
  const { nodeIdToIndex } = graph;

  const initialStateVector = computed(() => {
    if (initialState.isUndefined.value) return [];

    const stateVector: Fraction[] = []
    for (let i = 0; i < fracTransitionMatrix.value.length; i++) {
      stateVector.push(new Fraction(0));
    }

    const nodeId = initialState.get(graph)!.id
    const index = nodeIdToIndex.value.get(nodeId)!;

    stateVector[index] = new Fraction(1);
    return stateVector;
  })

  const trace = useStateAfterNSteps(fracTransitionMatrix, initialStateVector);

  const simControls = useSimulationControls(graph, trace);
  const theme = useSimulationTheme(graph, simControls);

  const start = async () => {
    await initialState.set(graph);
    if (initialState.isUndefined.value) return;

    simControls.start();
    theme.theme();
  }

  const stop = () => {
    initialState.cancelSet();

    simControls.stop();
    theme.untheme();
  }

  return {
    start,
    stop,
    simControls,
  }
}