import type { Graph } from "@graph/types";
import { useNodeState } from "@graph/useNodeState";

const startNode = useNodeState()

export default {
  startNode,
  reset: startNode.reset,
}