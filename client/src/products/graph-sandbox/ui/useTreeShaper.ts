import { computed, ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { useNodeDepth } from "@product/search-visualizer/useNodeDepth";
import type { Coordinate } from "@shape/types";
import { interpolateCoordinatesOverTime } from "@utils/animate";
import type { GNodeMoveRecord } from "@graph/plugins/history/types";
import { roundToNearestN } from "@utils/math";

const Y_OFFSET_PER_DEPTH = 200;
const X_OFFSET = 250;
const ANIMATION_DUR_MS_PER_NODE = 150;

export const useMoveNodesIntoTreeFormation = (graph: Graph) => {
  const reshapingActive = ref(false);
  const rootNode = computed(() => graph.nodes.value[0]);
  const nodeDepths = useNodeDepth(graph, rootNode);

  const getNewNodePositions = () => {
    if (!rootNode.value || !nodeDepths.value) return;

    const roundToNearest5 = roundToNearestN(10);
    const newPositions: Map<GNode['id'], Coordinate> = new Map();

    const { depthToNodeIds } = nodeDepths.value;
    const { x: rootNodeX, y: rootNodeY } = rootNode.value;

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

    for (const [nodeId, endCoords] of newPositions) {
      const node = graph.getNode(nodeId);
      if (!node) throw new Error(`Node with id ${nodeId} not found`);
      const startCoords = { x: node.x, y: node.y };

      if (startCoords.x === endCoords.x && startCoords.y === endCoords.y) continue;

      affectedItems.push({
        graphType: 'node',
        data: {
          id: node.id,
          from: startCoords,
          to: endCoords,
        }
      })

      const { coords, timePerFrameMs } = interpolateCoordinatesOverTime({
        start: startCoords,
        end: endCoords,
        durationMs: ANIMATION_DUR_MS_PER_NODE,
      })

      for (let i = 0; i < coords.length; i++) {
        await new Promise((res) => setTimeout(res, timePerFrameMs));
        graph.moveNode(node.id, coords[i]);
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
