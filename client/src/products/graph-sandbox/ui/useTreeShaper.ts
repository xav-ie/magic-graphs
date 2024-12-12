import { computed, ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { useNodeDepth } from "@product/search-visualizer/useNodeDepth";
import type { Coordinate } from "@shape/types";
import { pointInterpolation, calculateSteps } from "@utils/animate";
import type { GNodeMoveRecord } from "@graph/plugins/history/types";

const Y_OFFSET_PER_DEPTH = 200;
const X_OFFSET = 250;

/**
 * rounds a number to the nearest multiple of another number
 * @param n the number to round
 * @param nearest the number to round to
 */
const roundToNearestN = (nearest: number) => (n: number) => {
  return Math.round(n / nearest) * nearest;
}

export const useTreeShaper = (graph: Graph) => {
  const reshapingActive = ref(false);
  const rootNode = computed(() => graph.nodes.value[0]);
  const nodeDepths = useNodeDepth(graph, rootNode);

  const getNewNodePositions = () => {
    if (!rootNode.value || !nodeDepths.value) return;

    const roundToNearest5 = roundToNearestN(10);
    const newPositions: Map<GNode['id'], Coordinate> = new Map();

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

        newPositions.set(node.id, {
          x: roundToNearest5(x),
          y: roundToNearest5(y),
        });
      }
    }

    return newPositions;
  }

  const shapeGraph = async () => {
    if (reshapingActive.value) return;

    const newPositions = getNewNodePositions();
    if (!newPositions) return;

    reshapingActive.value = true;

    const affectedItems: GNodeMoveRecord[] = []

    for (const [nodeId, { x, y }] of newPositions) {
      const node = graph.getNode(nodeId);
      if (!node) throw new Error(`Node with id ${nodeId} not found`);

      if (node.x === x && node.y === y) continue;

      affectedItems.push({
        graphType: 'node',
        data: {
          id: node.id,
          from: { x: node.x, y: node.y },
          to: { x, y },
        }
      })

      const ANIMATION_DURATION = 150;
      const ANIMATION_FRAME_RATE = 60;

      const steps = calculateSteps(ANIMATION_DURATION, ANIMATION_FRAME_RATE);
      const points = pointInterpolation(node, { x, y }, steps, 'in-out');

      for (let i = 0; i < points.length; i++) {
        await new Promise((res) => setTimeout(res, ANIMATION_DURATION / steps));
        graph.moveNode(node.id, points[i]);
        graph.updateEncapsulatedNodeBox();
      }
    }

    if (affectedItems.length > 0) {
      graph.trackGraphState();
      graph.addToUndoStack({
        action: 'move',
        affectedItems,
      })
    }

    reshapingActive.value = false;
  }

  return {
    shapeGraph,
    reshapingActive,
  }
};
