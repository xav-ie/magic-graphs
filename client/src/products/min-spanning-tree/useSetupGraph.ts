import type { Graph } from "@graph/types";

export const useSetupGraph = (graph: Graph) => {

  graph.subscribe("onEdgeAdded", (edge) => {
    if (edge.to !== edge.from) return;
    graph.removeEdge(edge.id);
  });

};

export const edgeLabelIsPositiveNumber = (
  input: string
): string | undefined => {
  const parsedInput = Number(input);
  return isNaN(parsedInput) || parsedInput < 0 || input === ""
    ? undefined
    : input;
};
