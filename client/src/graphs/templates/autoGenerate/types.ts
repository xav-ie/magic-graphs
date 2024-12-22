type GenerateGraphOptions = {
  edgeType: "directed" | "undirected";
  edgeLabel: string | ((fromNode: string, toNode: string) => string);
  edgeLabelMin: string;
  edgeLabelMax: string;
  layout: "circular" | "grid";
};

type PartialGenerateGraphOptions = Partial<GenerateGraphOptions>;

export type AutoGenerateGraphOptions = {
  numNodes: number;
  numEdges: number;
} & PartialGenerateGraphOptions;

export const DEFAULT_AUTO_GENERATE_GRAPH_OPTIONS: AutoGenerateGraphOptions = {
  numNodes: 10,
  numEdges: 10,
  edgeType: "directed",
  edgeLabel: "1",
  layout: "circular",
};
