import { computed } from 'vue';
import { Fraction } from 'mathjs';
import type { Graph } from "@graph/types";
import type { SimulationRunner, TraceFunction } from "@ui/product/sim/types";
import { useSimulationControls } from '@ui/product/sim/useSimulationControls';
import { useSimulationTheme } from './theme';
import { useStateAfterNSteps } from './useStateAfterNSteps';
import { useTextTip } from '@ui/useTextTip';
import state from '../state';

export type MarkovChainTrace = TraceFunction<Fraction[]>
export type MarkovChainSimulationRunner = SimulationRunner<MarkovChainTrace>;

export const useSimulationRunner = (graph: Graph): MarkovChainSimulationRunner => {
  const { fracTransitionMatrix } = graph.transitionMatrix;

  const initialState = computed(() => {
    if (!state.startNode.value) return [];

    const stateVector: Fraction[] = []
    for (let i = 0; i < fracTransitionMatrix.value.length; i++) {
      stateVector.push(new Fraction(0));
    }

    const index = graph.nodeIdToIndex.value.get(state.startNode.value.id);
    if (index !== undefined) stateVector[index] = new Fraction(1);
    return stateVector;
  })

  const trace = useStateAfterNSteps(fracTransitionMatrix, initialState);

  const simControls = useSimulationControls(trace);
  const theme = useSimulationTheme(graph, simControls);
  const { showText, hideText } = useTextTip("select the starting node");

  const start = async () => {
    showText();
    await state.setNode(graph, state.startNode);
    hideText();
    simControls.start();
    theme.theme();
  }

  const stop = () => {
    state.cancelNodeSelection.value?.();
    simControls.stop();
    theme.untheme();
    hideText();
  }

  return {
    start,
    stop,
    simControls,
  }
}