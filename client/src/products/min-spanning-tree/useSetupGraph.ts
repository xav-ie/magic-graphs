import type { Graph } from "@graph/types";

export const useSetupGraph = (graph: Graph) => {
  const getNewLabel = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const labels = graph.nodes.value.map((node) => node.label);
    let label = 0;
    while (labels.includes(alphabet[label])) label++;
    return alphabet[label];
  };

  graph.subscribe("onNodeAdded", (node) => {
    node.label = getNewLabel();
  });

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
