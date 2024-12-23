import { computed, watch } from "vue";
import type { GNode, Graph } from "@graph/types";
import { useAutoTree } from "../../graph-sandbox/ui/tree/useTreeShaper";
import type { AutoTreeOptions } from "../../graph-sandbox/ui/tree/useTreeShaper";
import { getNodeDepths } from "@product/search-visualizer/useNodeDepth";

export const useAutoBinaryTree = (
  graph: Graph,
  options: Partial<AutoTreeOptions> = {},
) => {
  const treeControls = useAutoTree(graph, {
    ...options,
    shape: 'binary',
  })

  const rootNode = computed<GNode | undefined>(() => graph.nodes.value?.[0])

  watch(rootNode, () => {
    treeControls.rootNodeId.value = rootNode.value?.id;
  }, { immediate: true })

  treeControls.activate();

  const depthToXOffset: Record<number, number> = {
    1: 250,
    2: 200,
    3: 150,
  }

  graph.subscribe('onStructureChange', () => {
    if (!rootNode.value) return;
    const { adjacencyList } = graph.adjacencyList;
    const { depth } = getNodeDepths(rootNode.value, adjacencyList.value);
    const newXOffset = depthToXOffset[depth] ?? 100;
    treeControls.options.value.xOffset = newXOffset;
    treeControls.debouncedUpdateShape();
  })

  return treeControls;
}
