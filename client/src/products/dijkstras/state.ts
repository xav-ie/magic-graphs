import { ref } from "vue";
import type { Ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { selectNode } from "@graph/select";

const startNode = ref<GNode>();

const cancelNodeSelection = ref<() => void>();

/**
 * sets a node to a ref by selecting it from the graph
 */
const setNode = async (graph: Graph, nodeRef: Ref<GNode | undefined>) => {
  const { selectedItemPromise, cancelSelection } = selectNode(graph)
  cancelNodeSelection.value = cancelSelection
  nodeRef.value = await selectedItemPromise()
}

const reset = () => {
  startNode.value = undefined
  cancelNodeSelection.value?.()
  cancelNodeSelection.value = undefined
}

export default {
  startNode,
  cancelNodeSelection,
  setNode,
  reset,
}