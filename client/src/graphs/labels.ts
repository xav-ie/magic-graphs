import type { Ref } from "vue";
import type { Graph } from "./types";

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const ONE_THROUGH_99 = Array.from({ length: 99 }, (_, i) => (i + 1).toString());

export type LabelledItem = { label: string };

export const graphLabelGetter = (
  labelledItems: Ref<LabelledItem[]>,
  sequence: string[]
) => () => {
  let labels = labelledItems.value.map(({ label }) => label);

  let index = 0;
  let newLabel;

  while (!newLabel) {
    const indexOutOfBounds = index >= sequence.length;
    if (indexOutOfBounds) {
      labels = labels.slice(sequence.length);
      index = 0;
    }
    const potentialLabel = sequence[index];
    const labelExists = labels.includes(potentialLabel);
    if (!labelExists) newLabel = potentialLabel;
    index++;
  }

  return newLabel
};

/**
 * takes a graph and gives a function that will return the next available letter label (A-Z)
 * for a node in the graph
 *
 * @param graph - a graph instance
 * @returns a function that will return the next available letter label
 */
export const nodeLetterLabelGetter = (graph: Pick<Graph, 'nodes'>) => {
  return graphLabelGetter(graph.nodes, ALPHABET);
};

/**
 * takes a graph and gives a function that will return the next available number label (1-99)
 * for a node in the graph
 *
 * @param graph - a graph instance
 * @returns a function that will return the next available number label
 */
export const nodeNumberLabelGetter = (graph: Pick<Graph, 'nodes'>) => {
  return graphLabelGetter(graph.nodes, ONE_THROUGH_99);
};

export const edgeLetterLabelGetter = (graph: Pick<Graph, 'edges'>) => {
  return graphLabelGetter(graph.edges, ALPHABET);
}

export const edgeNumberLabelGetter = (graph: Pick<Graph, 'edges'>) => {
  return graphLabelGetter(graph.edges, ONE_THROUGH_99);
};