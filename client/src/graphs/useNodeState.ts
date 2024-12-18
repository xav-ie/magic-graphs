import { computed, ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { selectNode } from "@graph/select";

/**
 * a utility for managing the state of a node, providing
 * getters and setters for the node and a way to cancel the setter
 */
export const useNodeState = () => {
  const node = ref<GNode>();
  let cancelSet = () => {};

  const get = (graph: Graph) => {
    if (!node.value) return;
    return graph.getNode(node.value.id);
  }

  const set = async (graph: Graph) => {
    const { selectedItemPromise, cancelSelection } = selectNode(graph)
    cancelSet = cancelSelection
    node.value = await selectedItemPromise()
  }

  const reset = () => {
    node.value = undefined
    cancelSet()
  }

  return {
    /**
     * gets the node on the graph passed in, returns the node if it exists
     * in the graph, otherwise returns undefined
     */
    get,
    /**
     * a promise that resolves when either the node is set or cancelled by `cancelSetNode`
     */
    set,
    /**
     * cancels the promise that `setNode` is waiting on
     */
    cancelSet,

    /**
     * true if the node is set
     */
    isDefined: computed(() => node.value !== undefined),
    /**
     * true if the node is not set
     */
    isUndefined: computed(() => node.value === undefined),

    /**
     * the reactive source for tracking changes to the node with computed, watchers, etc.
     */
    ref: node,

    /**
     * resets the node to undefined
     */
    reset,
  };
}