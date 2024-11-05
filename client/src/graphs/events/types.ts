import type { GEdge, GNode } from "@graph/types";
import type { GraphSettings } from "@graph/settings";
import type {
  AddNodeOptions,
  RemoveNodeOptions,
  MoveNodeOptions,
  AddEdgeOptions,
  RemoveEdgeOptions,
} from "@graph/compositions/useBaseGraphTypes";
import type { NodeAnchor } from "@graph/compositions/useNodeAnchorGraphTypes";
import type { GraphTheme } from "@graph/themes";
import type { DeepPartial } from "@utils/types";

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
   * when a node is removed from the graph
   */
  onNodeRemoved: (node: GNode, options: RemoveNodeOptions) => void;
  /**
   * when a node is moved to a new position on the canvas
   */
  onNodeMoved: (node: GNode, options: MoveNodeOptions) => void;
  /**
   * when an edge is added to the graph
   */
  onEdgeAdded: (edge: GEdge, options: AddEdgeOptions) => void;
  /**
   * when an edge is removed from the graph
   */
  onEdgeRemoved: (edge: GEdge, options: RemoveEdgeOptions) => void;
  /**
   * when an edge's weight is changed
   */
  onEdgeWeightChange: (edge: GEdge) => void;
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

export type MarqueeGraphEventMap = {}

export type UserEditableGraphEventMap = {}

export type PersistentGraphEventMap = {}

export type CollaborativeGraphEventMap = {}

export type GraphEventMap = (
  BaseGraphEventMap &
  FocusGraphEventMap &
  DraggableGraphEventMap &
  NodeAnchorGraphEventMap &
  MarqueeGraphEventMap &
  UserEditableGraphEventMap &
  PersistentGraphEventMap &
  CollaborativeGraphEventMap
)