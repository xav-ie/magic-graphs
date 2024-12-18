import { computed, ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { selectNode } from "@graph/select";

export const useNodeState = () => {
  const node = ref<GNode>();
  let cancelSetNode = () => {};

  const setNode = async (graph: Graph) => {
    const { selectedItemPromise, cancelSelection } = selectNode(graph)
    cancelSetNode = cancelSelection
    node.value = await selectedItemPromise()
  }

  const reset = () => {
    node.value = undefined
    cancelSetNode()
  }

  return {
    /**
     * a promise that resolves when either the node is set or cancelled by `cancelSetNode`
     */
    setNode,
    /**
     * cancels the promise that `setNode` is waiting on
     */
    cancelSetNode,

    /**
     * true if the node is set
     */
    isDefined: computed(() => node.value !== undefined),
    /**
     * true if the node is not set
     */
    isUndefined: computed(() => node.value === undefined),

    /**
     * the node that is set
     */
    node,
    /**
     * resets the node to undefined
     */
    reset,
  };
}