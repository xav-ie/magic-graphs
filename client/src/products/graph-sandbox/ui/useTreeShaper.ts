import { computed } from "vue";
import type { Graph } from "@graph/types";
import { useNodeDepth } from "@product/search-visualizer/useNodeDepth";

const Y_OFFSET_PER_DEPTH = 200;
const X_OFFSET = 250;

export const useTreeShaper = (graph: Graph) => {
  const rootNode = computed(() => graph.nodes.value[0]);
  const nodeDepths = useNodeDepth(graph, rootNode);

  const shapeGraph = () => {
    if (!rootNode.value || !nodeDepths.value) return;

    const { depthToNodeIds } = nodeDepths.value;
    const { x: rootNodeX, y: rootNodeY } = rootNode.value;

    // keep the root node at the current position
    // and move the rest of the nodes to form a tree

    for (let i = 1; i < depthToNodeIds.length; i++) {
      const nodeIds = depthToNodeIds[i];
      const yOffset = i * Y_OFFSET_PER_DEPTH;

      for (let j = 0; j < nodeIds.length; j++) {
        const node = graph.getNode(nodeIds[j]);
        if (!node) throw new Error(`Node with id ${nodeIds[j]} not found`);

        const x = rootNodeX + (j - nodeIds.length / 2) * X_OFFSET;
        const y = rootNodeY + yOffset;

        node.x = x;
        node.y = y;
      }
    }

    graph.trackGraphState();
    graph.updateEncapsulatedNodeBox()
  }

  return {
    shapeGraph
  }
}