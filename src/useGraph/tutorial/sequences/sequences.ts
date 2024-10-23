import type { Graph } from "@/useGraph/useGraph";
import type { TutorialSequence } from "../types";
import { BASICS_STEPS } from "./basics";

/**
 * pre-defined sequence for basic graph editing.
 * re-arrange the steps to change the order of the tutorial
 */
const BASICS_SEQUENCE: (graph: Graph) => TutorialSequence = (graph: Graph) => {
  const {
    greeting,
    createNode,
    moveNode,
    createEdge,
    createUndirectedEdge,
    createSelfDirectedEdge,
    editEdgeWeight,
    removeElement,
    goodbye,
  } = BASICS_STEPS(graph);

  return [
    {
      hint: 'Test test',
      dismiss: {
        event: 'onInterval',
        predicate: (iteration) => {
          console.log('iteration', iteration);
          return iteration > 5;
        },
      },
      interval: 500
    },
    greeting,
    createNode,
    moveNode,
    createEdge,
    createUndirectedEdge,
    createSelfDirectedEdge,
    editEdgeWeight,
    removeElement,
    goodbye
  ]
}

/**
 * contains pre-defined sequences for common use cases
 */
export const SEQUENCES: (graph: Graph) => Record<string, TutorialSequence> = (graph: Graph) => ({
  basics: BASICS_SEQUENCE(graph)
});