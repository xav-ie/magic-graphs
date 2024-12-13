import type { BaseGraph } from "@graph/base";
import type { GraphHistoryPlugin } from "../history";
import { interpolateCoordinatesOverTime } from "@utils/animate";
import type { GraphFocusPlugin } from "../focus";
import type { GraphMarqueePlugin } from "../marquee";
import type { GraphPersistentPlugin } from "../persistent";
import { ANIMATE_NODE_MOVE_OPTIONS_DEFAULTS } from "./types";
import type { AnimateNodeMoveOptions } from "./types";

export const useAnimation = (
  graph: BaseGraph
    & GraphHistoryPlugin
    & GraphFocusPlugin
    & GraphMarqueePlugin
    & GraphPersistentPlugin
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
      if (graph.focus.isFocused(node.id)) graph.marquee.updateEncapsulatedNodeBox();
    }

    if (history) {
      graph.history.addToUndoStack({
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

    if (persist) await graph.persistent.trackGraphState();
  }

  return {
    node: animateNode,
  }
}