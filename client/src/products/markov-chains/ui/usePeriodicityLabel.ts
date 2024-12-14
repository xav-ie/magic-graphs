import type { GNode, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import { USETHEME_ID } from "../constants";
import type { MarkovChain } from "../misc/useMarkovChain";

export const usePeriodicityLabel = (graph: Graph, markov: MarkovChain) => {
  const { setTheme, removeTheme } = useTheme(graph, USETHEME_ID);

  const nodeText = (node: GNode) => {
    if (graph.focus.isFocused(node.id)) return
    return '1'
  }

  const label = () => {
    setTheme('nodeText', nodeText);
  }

  const unlabel = () => {
    removeTheme('nodeText');
  }

  return {
    label,
    unlabel,
  }
}