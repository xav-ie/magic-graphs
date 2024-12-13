import { onUnmounted, ref, watch } from "vue";
import type { GNode, Graph } from "@graph/types";
import { getNodeDepths } from "@product/search-visualizer/useNodeDepth";
import type { Coordinate } from "@shape/types";
import type { GNodeMoveRecord } from "@graph/plugins/history/types";
import { roundToNearestN } from "@utils/math";
import { debounce } from "@utils/debounce";

export type TreeFormationOptions = {
  /**
   * the duration of the animation in milliseconds.
   * must be greater than 100
   * @default 250
   */
  durationMs?: number,
  /**
   * the horizontal offset between nodes at the same depth.
   * @default 250
   */
  xOffset?: number,
  /**
   * the vertical offset between nodes at different depths.
   * @default 200
   */
  yOffset?: number,
}

export const TREE_FORMATION_OPTIONS_DEFAULTS = {
  durationMs: 250,
  xOffset: 250,
  yOffset: 200,
} as const

export const useMoveNodesIntoTreeFormation = (
  graph: Graph,
  options: TreeFormationOptions = {}
) => {
  const treeOptions = {
    ...TREE_FORMATION_OPTIONS_DEFAULTS,
    ...options,
  }

  const treeOffsetX = ref(treeOptions.xOffset);
  const treeOffsetY = ref(treeOptions.yOffset);

  /**
   * whether nodes of the graph are currently
   * being animated to their new positions
   */
  const reshapingActive = ref(false);

  const getNewNodePositions = (rootNode: GNode) => {
    const roundToNearest10 = roundToNearestN(10);
    const newPositions: Map<GNode['id'], Coordinate> = new Map();

    const { depthToNodeIds } = getNodeDepths(rootNode, graph.adjacencyList.adjacencyList.value);
    const { x: rootNodeX, y: rootNodeY } = rootNode;

    for (let i = 1; i < depthToNodeIds.length; i++) {
      const nodeIds = depthToNodeIds[i];
      const yOffset = i * treeOffsetY.value;

      for (let j = 0; j < nodeIds.length; j++) {
        const node = graph.getNode(nodeIds[j]);
        if (!node) throw new Error(`Node with id ${nodeIds[j]} not found`);

        const x = rootNodeX + (j - nodeIds.length / 2) * treeOffsetX.value;
        const y = rootNodeY + yOffset;

        newPositions.set(node.id, {
          x: roundToNearest10(x),
          y: roundToNearest10(y),
        });
      }
    }

    return newPositions;
  }

  const shapeGraph = async (rootNode: GNode) => {
    if (reshapingActive.value) return;

    const newPositions = getNewNodePositions(rootNode);
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

      graph.animate.node({
        nodeId: node.id,
        durationMs: treeOptions.durationMs,
        endCoords,
        // we do this already but in batch at the end
        history: false,
        persist: false,
      })
    }

    // wait for all animations to finish
    await new Promise((res) => setTimeout(res, treeOptions.durationMs + 50));

    if (affectedItems.length > 0) {
      graph.persistent.trackGraphState();
      graph.history.addToUndoStack({
        action: 'move',
        affectedItems,
      })
    }

    reshapingActive.value = false;
  }

  return {
    shapeGraph,
    reshapingActive,
    treeOffsetX,
    treeOffsetY,
  }
};

export type AutoTreeOptions = TreeFormationOptions & {
  /**
   * debounce time in milliseconds to wait before reshaping the graph
   * @default 500 // half a second
   */
  debounceMs?: number,
}

export const AUTO_TREE_OPTIONS_DEFAULTS = {
  debounceMs: 500,
} as const

/**
 * automatically reshapes the graph into a tree formation
 * whenever the graph structure changes
 */
export const useAutoTree = (
  graph: Graph,
  options: AutoTreeOptions = {},
) => {
  const {
    debounceMs,
    ...treeOptions
  } = {
    ...AUTO_TREE_OPTIONS_DEFAULTS,
    ...options,
  }

  const rootNodeId = ref<GNode['id']>();
  const isActive = ref(false);

  const treeControls = useMoveNodesIntoTreeFormation(graph, treeOptions);

  const updateShape = () => {
    if (!rootNodeId.value) return;
    const rootNode = graph.getNode(rootNodeId.value);
    if (!rootNode) return;
    treeControls.shapeGraph(rootNode);
  }

  const debouncedUpdateShape = debounce(updateShape, debounceMs);

  const activate = () => {
    graph.subscribe('onStructureChange', debouncedUpdateShape);
    graph.subscribe('onNodeDrop', debouncedUpdateShape);
    graph.subscribe('onGroupDrop', debouncedUpdateShape);
    isActive.value = true;
  }

  const deactivate = () => {
    graph.unsubscribe('onStructureChange', debouncedUpdateShape);
    graph.unsubscribe('onNodeDrop', debouncedUpdateShape);
    graph.unsubscribe('onGroupDrop', debouncedUpdateShape);
    isActive.value = false;
  }

  // eagerly shape the graph when the root node changes
  watch(rootNodeId, () => {
    if (isActive.value) updateShape();
  })

  onUnmounted(deactivate);

  return {
    rootNodeId,
    activate,
    deactivate,
    isActive,
    updateShape,
    debouncedUpdateShape,
    ...treeControls,
  };
}

export type AutoTreeControls = ReturnType<typeof useAutoTree>;
