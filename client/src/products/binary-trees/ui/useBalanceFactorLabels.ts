import type { Graph } from "@graph/types";
import type { TreeControls } from "../useTree";
import { useNodeLabeller } from "./useNodeLabeller";

export const useBalanceFactorLabels = (graph: Graph, tree: TreeControls) => useNodeLabeller(
  graph,
  tree.nodeIdToBalanceFactor,
  'node-balance-factor'
)