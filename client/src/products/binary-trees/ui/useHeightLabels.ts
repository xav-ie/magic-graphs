import type { Graph } from "@graph/types";
import type { TreeControls } from "../useTree";
import { useNodeLabel } from "./useNodeLabel";

export const useHeightLabels = (graph: Graph, tree: TreeControls) => useNodeLabel(
  graph,
  tree.nodeIdToHeight,
  'node-height'
)