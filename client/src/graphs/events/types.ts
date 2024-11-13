import type { GEdge, GNode } from "@graph/types";
import type { GraphSettings } from "@graph/settings";
import type {
  AddNodeOptions,
  RemoveNodeOptions,
  MoveNodeOptions,
  AddEdgeOptions,
  RemoveEdgeOptions,
} from "@graph/compositions/useBaseGraph/types";
import type { NodeAnchor } from "@graph/compositions/useNodeAnchorGraph/types";
import type { GraphTheme } from "@graph/themes";
import type { DeepPartial } from "@utils/types";
import type { HistoryRecord, RedoHistoryOptions, UndoHistoryOptions } from "@graph/compositions/useHistoryGraph/types";
import type { Coordinate } from "@shape/types";

export type BaseGraphEventMap = {
  /**
   * when a node or edge is added or removed from the graph
   */
  onStructureChange: (nodes: GNode[], edges: GEdge[]) => void;
  /**
   * when a node is added to the graph
   */
  onNodeAdded: (node: GNode, options: AddNodeOptions) => void;
  /**
   * when multiple nodes are added to the graph as a group
   */
  onBulkNodeAdded: (nodes: GNode[], options: AddNodeOptions) => void;
  /**
   * when a node is removed from the graph
   */
  onNodeRemoved: (removedNode: GNode, removedEdges: GEdge[], options: RemoveNodeOptions) => void;
  /**
   * when multiple nodes are removed from the graph as a group
   */
  onBulkNodeRemoved: (removedNodes: GNode[], removedEdges: GEdge[], options: RemoveNodeOptions) => void;
  /**
   * when a node is moved to a new position on the canvas
   */
  onNodeMoved: (node: GNode, options: MoveNodeOptions) => void;
  /**
   * when multiple nodes are moved to new positions on the canvas in as a group
   */
  onBulkNodeMoved: (nodes: GNode[], options: MoveNodeOptions) => void;
  /**
   * when an edge is added to the graph
   */
  onEdgeAdded: (edge: GEdge, options: AddEdgeOptions) => void;
  /**
   * when multiple edges are added to the graph as a group
   */
  onBulkEdgeAdded: (edges: GEdge[], options: AddEdgeOptions) => void;
  /**
   * when an edge is removed from the graph
   */
  onEdgeRemoved: (edge: GEdge, options: RemoveEdgeOptions) => void;
  /**
   * when multiple edges are removed from the graph as a group
   */
  onBulkEdgeRemoved: (edges: GEdge[], options: RemoveEdgeOptions) => void;
  /**
   * when an edge's text label is changed
   */
  onEdgeLabelChange: (edge: GEdge) => void;
  /**
   * when the canvas is repainted
   *
   * WARNING: items drawn to the canvas using ctx won't be tied to graphs internal state.
   * Use updateAggregator if you need drawn item to integrate with graph APIs
   */
  onRepaint: (ctx: CanvasRenderingContext2D, repaintId: string) => void;
  /**
   * when the node that the user is hovering over changes.
   * undefined if the user is not hovering over a node
   */
  onNodeHoverChange: (newNode: GNode | undefined, oldNode: GNode | undefined) => void;
  /**
   * when the reset process is triggered
   */
  onGraphReset: () => void;
  /**
   * when the canvas is clicked on (native dom event)
   */
  onClick: (ev: MouseEvent) => void;
  /**
   * when the user clicks the mouse button on the canvas (native dom event)
   */
  onMouseDown: (ev: MouseEvent) => void;
  /**
   * when the user releases the mouse button on the canvas (native dom event)
   */
  onMouseUp: (ev: MouseEvent) => void;
  /**
   * when the user moves the mouse on the canvas (native dom event)
   */
  onMouseMove: (ev: MouseEvent) => void;
  /**
   * when the canvas is double clicked on (native dom event)
   */
  onDblClick: (ev: MouseEvent) => void;
  /**
   * when the canvas is right clicked on (native dom event)
   */
  onContextMenu: (ev: MouseEvent) => void;
  /**
   * when a key is pressed down on the canvas (native dom event)
   */
  onKeydown: (ev: KeyboardEvent) => void;
  /**
   * when the graph theme is changed
   */
  onThemeChange: (diff: DeepPartial<GraphTheme>) => void;
  /**
   * when the settings of the graph are changed
   */
  onSettingsChange: (diff: DeepPartial<GraphSettings>) => void;
}

export type HistoryGraphEventMap = {
  /**
   * when the undo action is triggered
   */
  onUndo: (historyRecord: HistoryRecord, options: UndoHistoryOptions) => void;
  /**
   * when the redo action is triggered
   */
  onRedo: (historyRecord: HistoryRecord, options: RedoHistoryOptions) => void;
}

export type FocusGraphEventMap = {
  /**
   * when the focus item (ie nodes or edges) changes.
   * undefined if the user is not focusing on an item
   */
  onFocusChange: (newItemId: string | undefined, oldItemId: string | undefined) => void;
}

export type DraggableGraphEventMap = {
  /**
   * when the user initiates a drag on a node
   */
  onNodeDragStart: (node: GNode) => void;
  /**
   * when the user drops a node
   */
  onNodeDrop: (node: GNode) => void;
}

export type NodeAnchorGraphEventMap = {
  /**
   * when the user initiates a drag on a node anchor
   */
  onNodeAnchorDragStart: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
  /**
   * when the user drops a node anchor
   */
  onNodeAnchorDrop: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
}

export type MarqueeGraphEventMap = {
  /**
   * when the user starts a marquee drag
   */
  onGroupDragStart: (nodes: GNode[], startingCoordinates: Coordinate) => void;
  /**
   * when the user drops a marquee drag
   */
  onGroupDrop: (nodes: GNode[], endCoordinates: Coordinate) => void;
}

export type UserEditableGraphEventMap = {}

export type PersistentGraphEventMap = {}

export type CollaborativeGraphEventMap = {}

export type GraphEventMap = (
  BaseGraphEventMap &
  HistoryGraphEventMap &
  FocusGraphEventMap &
  DraggableGraphEventMap &
  NodeAnchorGraphEventMap &
  MarqueeGraphEventMap &
  UserEditableGraphEventMap &
  PersistentGraphEventMap &
  CollaborativeGraphEventMap
)