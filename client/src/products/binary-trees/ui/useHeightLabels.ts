import type { Graph } from "@graph/types";
import type { TreeControls } from "../useTree";
import { useNodeLabel } from "./useNodeLabel";
import { useNodeColor } from "./useNodeColor";
import { numberToColor } from "./numberToColor";

export const useHeightLabels = (graph: Graph, tree: TreeControls) => {
  const { label, unlabel } = useNodeLabel(
    graph,
    tree.nodeIdToHeight,
    'node-height'
  )
}