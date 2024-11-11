import type { Ref } from "vue";
import type { Graph } from "./types";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ONE_THROUGH_99 = Array.from({ length: 99 }, (_, i) => (i + 1).toString());

export const graphLabelGetter = (
  labelledItems: Ref<{ label: string }[]>,
  sequence: string[]
) => () => {
  const labels = labelledItems.value.map(({ label }) => label);
  let sequenceIndex = 0;
  while (labels.includes(sequence[sequenceIndex])) sequenceIndex++;
  return sequence[sequenceIndex];
};

export const nodeLetterLabelGetter = (graph: Pick<Graph, 'nodes'>) => {
  return graphLabelGetter(graph.nodes, ALPHABET);
};

export const nodeNumberLabelGetter = (graph: Pick<Graph, 'nodes'>) => {
  return graphLabelGetter(graph.nodes, ONE_THROUGH_99);
};

export const edgeLetterLabelGetter = (graph: Pick<Graph, 'edges'>) => {
  return graphLabelGetter(graph.edges, ALPHABET);
}

export const edgeNumberLabelGetter = (graph: Pick<Graph, 'edges'>) => {
  return graphLabelGetter(graph.edges, ONE_THROUGH_99);
};