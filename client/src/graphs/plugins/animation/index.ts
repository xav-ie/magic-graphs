import type { BaseGraph } from "@graph/base";
import type { BroadcastOption, HistoryOption, PersistOption } from "@graph/base/types";
import type { GNode, Graph } from "@graph/types";
import type { Coordinate } from "@shape/types";
import type { GraphHistoryControls } from "../history";
import { interpolateCoordinatesOverTime } from "@utils/animate";
import type { GraphFocusControls } from "../focus";
import type { GraphMarqueeControls } from "../marquee";
import type { GraphPersistentControls } from "../persistent";

export type AnimateNodeMoveOptions = {
  /**
   * the id of the node to move
   */
  nodeId: GNode['id'],
  /**
   * the coordinates of the node after the move
   */
  endCoords: Coordinate,
  /**
   * the duration of the animation in milliseconds.
   * must be greater than 100
   * @default 300
   */
  durationMs?: number,
} & Partial<HistoryOption & BroadcastOption & PersistOption>

export const ANIMATE_NODE_MOVE_OPTIONS_DEFAULTS = {
  durationMs: 300,
  broadcast: true,
  history: true,
  persist: true,
} as const

export const useAnimation = (
  graph: BaseGraph
    & GraphHistoryControls
    & GraphFocusControls
    & GraphMarqueeControls
    & GraphPersistentControls
) => {

  const animateNode = async (options: AnimateNodeMoveOptions) => {
    const {
      nodeId,
      endCoords,
      durationMs,
      history,
      broadcast,
      persist,
    } = {
      ...ANIMATE_NODE_MOVE_OPTIONS_DEFAULTS,
      ...options
    }

    if (durationMs < 100) throw new Error(`durationMs must be greater than 100, got ${durationMs}`)

    const node = graph.getNode(nodeId)
    if (!node) throw new Error(`Node with id ${nodeId} not found`)

    const startCoords = { x: node.x, y: node.y }

    const { coords, timePerFrameMs } = interpolateCoordinatesOverTime({
      start: startCoords,
      end: endCoords,
      durationMs,
    })

    for (let i = 0; i < coords.length; i++) {
      await new Promise((res) => setTimeout(res, timePerFrameMs));
      graph.moveNode(node.id, coords[i], { broadcast });
      if (graph.isFocused(node.id)) graph.updateEncapsulatedNodeBox();
    }

    if (history) {
      graph.addToUndoStack({
        action: 'move',
        affectedItems: [{
          graphType: 'node',
          data: {
            id: options.nodeId,
            from: startCoords,
            to: options.endCoords
          }
        }]
      })
    }

    if (persist) await graph.trackGraphState();
  }

  return {
    node: animateNode,
  }
}