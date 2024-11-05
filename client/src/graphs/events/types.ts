import type { GEdge, GNode } from "@graph/types";
import type { GraphSettings } from "@graph/settings";
import type {
  AddNodeOptions,
  RemoveNodeOptions,
  MoveNodeOptions,
  AddEdgeOptions,
  RemoveEdgeOptions,
} from "@graph/baseGraphAPIs";
import type { GraphTheme } from "@graph/themes";
import type { DeepPartial } from "@utils/types";
import type { NodeAnchor } from "@graph/compositions/useNodeAnchorGraph";

export type BaseGraphEventMap = {
  /* graph dataflow events */
  onStructureChange: (nodes: GNode[], edges: GEdge[]) => void;
  onFocusChange: (newItemId: string | undefined, oldItemId: string | undefined) => void;

  onNodeAdded: (node: GNode, options: AddNodeOptions) => void;
  onNodeRemoved: (node: GNode, options: RemoveNodeOptions) => void;
  onNodeMoved: (node: GNode, options: MoveNodeOptions) => void;

  onEdgeAdded: (edge: GEdge, options: AddEdgeOptions) => void;
  onEdgeRemoved: (edge: GEdge, options: RemoveEdgeOptions) => void;

  onEdgeWeightChange: (edge: GEdge) => void;

  /*
    this event is called when the graph needs to be redrawn
    WARNING: items drawn to the canvas using ctx won't be tied to the graph event architecture.
    Use updateAggregator if you need drawn item to integrate with graph apis
  */
  onRepaint: (ctx: CanvasRenderingContext2D, repaintId: string) => void;

  onNodeHoverChange: (newNode: GNode | undefined, oldNode: GNode | undefined) => void;
  onGraphReset: () => void;

  /* canvas dom events */
  onClick: (ev: MouseEvent) => void;
  onMouseDown: (ev: MouseEvent) => void;
  onMouseUp: (ev: MouseEvent) => void;
  onMouseMove: (ev: MouseEvent) => void;
  onDblClick: (ev: MouseEvent) => void;
  onContextMenu: (ev: MouseEvent) => void;

  /* global dom events */
  onKeydown: (ev: KeyboardEvent) => void;

  /* reactivity events */
  onThemeChange: (diff: DeepPartial<GraphTheme>) => void;
  onSettingsChange: (diff: DeepPartial<GraphSettings>) => void;
}

export type FocusGraphEventMap = {
  onFocusChange: (newItemId: string | undefined, oldItemId: string | undefined) => void;
}

export type DraggableGraphEventMap = {
  onNodeDragStart: (node: GNode) => void;
  onNodeDrop: (node: GNode) => void;
}

export type NodeAnchorGraphEventMap = {
  /**
   * when the user initiates a drag on a node anchor
   * @param parentNode - the parent node of the anchor
   * @param nodeAnchor - the anchor being dragged
   */
  onNodeAnchorDragStart: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
  /**
   * when the user drops a node anchor
   * @param parentNode - the parent node of the anchor
   * @param nodeAnchor - the anchor being dropped
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