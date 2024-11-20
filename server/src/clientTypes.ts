// @ts-ignore
type GraphButtonIdMap = typeof GRAPH_BUTTON_ID;
// @ts-ignore
type GraphButtonId = GraphButtonIdMap[keyof GraphButtonIdMap];
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes a button that can be added to the graph toolbar
// @ts-ignore
 */
// @ts-ignore
export type GButton = {
// @ts-ignore
  cond?: () => boolean,
// @ts-ignore
  label: () => string,
// @ts-ignore
  action: () => void,
// @ts-ignore
  color: () => string,
// @ts-ignore
  id: GraphButtonId,
}

// @ts-ignore
export type BaseGraph = ReturnType<typeof useBaseGraph>

// @ts-ignore
export type FocusOption = {
// @ts-ignore
  /**
// @ts-ignore
   * whether to focus the added item/s
// @ts-ignore
   */
// @ts-ignore
  focus: boolean
}

// @ts-ignore
export type HistoryOption = {
// @ts-ignore
  /**
// @ts-ignore
   * whether to record this action in the history stack
// @ts-ignore
   */
// @ts-ignore
  history: boolean
}

// @ts-ignore
export type BroadcastOption = {
// @ts-ignore
  /**
// @ts-ignore
   * whether to broadcast this action to connected collaborators
// @ts-ignore
   */
// @ts-ignore
  broadcast: boolean
}

// @ts-ignore
export type AddNodeOptions = FocusOption & BroadcastOption & HistoryOption

// @ts-ignore
export type RemoveNodeOptions = BroadcastOption & HistoryOption

// @ts-ignore
export type AddEdgeOptions = FocusOption & BroadcastOption & HistoryOption

// @ts-ignore
export type RemoveEdgeOptions = BroadcastOption & HistoryOption

// @ts-ignore
export type MoveNodeOptions = BroadcastOption

// @ts-ignore
export type UseAggregatorOptions = {
// @ts-ignore
  canvas: Ref<HTMLCanvasElement | null | undefined>
// @ts-ignore
  emit: GraphEventEmitter
}

// @ts-ignore
type GraphCRUDOptions = {
// @ts-ignore
  emit: Emitter,
// @ts-ignore
  nodes: Ref<GNode[]>,
// @ts-ignore
  edges: Ref<GEdge[]>,
// @ts-ignore
  nodeMap: NodeMap,
// @ts-ignore
  edgeMap: EdgeMap,
// @ts-ignore
  settings: Ref<GraphSettings>,
}

// @ts-ignore
export type UseNodeEdgeMap = typeof useNodeEdgeMap
// @ts-ignore
export type NodeMap = ReturnType<UseNodeEdgeMap>['nodeIdToNodeMap']
// @ts-ignore
export type EdgeMap = ReturnType<UseNodeEdgeMap>['edgeIdToEdgeMap']

// @ts-ignore
export type Collaborator = {
// @ts-ignore
  id: string
// @ts-ignore
  name: string
// @ts-ignore
  color: string
// @ts-ignore
  mousePosition: { x: number, y: number }
}

// @ts-ignore
export type ToServerCollaboratorMove = {
// @ts-ignore
  x: number
// @ts-ignore
  y: number
}

// @ts-ignore
export type ToClientCollaboratorMove = {
// @ts-ignore
  id: Collaborator['id']
// @ts-ignore
  x: number
// @ts-ignore
  y: number
}

// @ts-ignore
export type CollaboratorMap = Record<Collaborator['id'], Collaborator>

// @ts-ignore
export type GraphState = {
// @ts-ignore
  nodes: GNode[],
// @ts-ignore
  edges: GEdge[]
}

// @ts-ignore
export interface GraphEvents {
// @ts-ignore
  nodeAdded: (node: GNode) => void
// @ts-ignore
  nodeRemoved: (nodeId: GNode['id']) => void
// @ts-ignore
  nodeMoved: (node: GNode) => void
// @ts-ignore

// @ts-ignore
  edgeAdded: (edge: GEdge) => void
// @ts-ignore
  edgeRemoved: (edgeId: GEdge['id']) => void
// @ts-ignore
  edgeLabelEdited: (edgeId: GEdge['id'], label: string) => void
// @ts-ignore

// @ts-ignore
  collaboratorJoined: (collaborator: Collaborator) => void
// @ts-ignore
  collaboratorLeft: (collaboratorId: Collaborator['id']) => void
// @ts-ignore

// @ts-ignore
  toServerCollaboratorMoved: (collaboratorMove: ToServerCollaboratorMove) => void
// @ts-ignore
  toClientCollaboratorMoved: (collaboratorMove: ToClientCollaboratorMove) => void
// @ts-ignore

// @ts-ignore
  joinRoom: (
// @ts-ignore
    joinOptions: Collaborator & { roomId: string },
// @ts-ignore
    joinWithGraphState: GraphState | null,
// @ts-ignore
    mapCallback: (collabMap: CollaboratorMap, graphState: GraphState) => void
// @ts-ignore
  ) => void
// @ts-ignore

// @ts-ignore
  leaveRoom: (confirmationCallback: () => void) => void
}

// @ts-ignore
export type ActiveDragNode = {
// @ts-ignore
  node: GNode,
// @ts-ignore
  startingCoordinates: { x: number, y: number }
}

// @ts-ignore
export type GNodeRecord = {
// @ts-ignore
  graphType: 'node',
// @ts-ignore
  data: GNode
}

// @ts-ignore
export type GNodeMoveRecord = {
// @ts-ignore
  graphType: 'node',
// @ts-ignore
  data: {
// @ts-ignore
    id: string,
// @ts-ignore
    from: { x: number, y: number },
// @ts-ignore
    to: { x: number, y: number }
// @ts-ignore
  }
}

// @ts-ignore
export type GEdgeRecord = {
// @ts-ignore
  graphType: 'edge',
// @ts-ignore
  data: GEdge
}

// @ts-ignore
export type AddRemoveRecord = {
// @ts-ignore
  /**
// @ts-ignore
   * the action that was taken in order to create this record.
// @ts-ignore
   */
// @ts-ignore
  action: 'add' | 'remove',
// @ts-ignore
  /**
// @ts-ignore
   * the items that were affected by the action.
// @ts-ignore
   */
// @ts-ignore
  affectedItems: (GNodeRecord | GEdgeRecord)[];
}

// @ts-ignore
export type MoveRecord = {
// @ts-ignore
  /**
// @ts-ignore
   * the action that was taken in order to create this record.
// @ts-ignore
   */
// @ts-ignore
  action: 'move',
// @ts-ignore
  /**
// @ts-ignore
   * the items that were affected by the action.
// @ts-ignore
   */
// @ts-ignore
  affectedItems: GNodeMoveRecord[];
}

// @ts-ignore
export type HistoryRecord = AddRemoveRecord | MoveRecord;

// @ts-ignore
export type RedoHistoryOptions = FocusOption;

// @ts-ignore
export type NodeAnchor = {
// @ts-ignore
  /**
// @ts-ignore
   * the x-coordinate of the anchor
// @ts-ignore
   */
// @ts-ignore
  x: number,
// @ts-ignore
  /**
// @ts-ignore
   * the y-coordinate of the anchor
// @ts-ignore
   */
// @ts-ignore
  y: number,
// @ts-ignore
  /**
// @ts-ignore
   * the direction of the anchor relative to the parent node.
// @ts-ignore
   * ie the north anchor is the one that spawns above the node
// @ts-ignore
   */
// @ts-ignore
  direction: 'north' | 'east' | 'south' | 'west',
// @ts-ignore
  /**
// @ts-ignore
   * the unique id of the anchor
// @ts-ignore
   */
// @ts-ignore
  id: string,
}

// @ts-ignore
export type GraphEventMap = ImportedGraphEventMap

// @ts-ignore
export type EventMapToEventBus<T> = Record<keyof T, Set<any>>

// @ts-ignore
export type GraphEvent = keyof GraphEventMap;

// @ts-ignore
type PermissiveParams<T> = T extends (...args: infer P) => any ? P : never;

// @ts-ignore
export type GenerateSubscriber<
// @ts-ignore
  T extends GraphEventMap = GraphEventMap
// @ts-ignore
> = typeof generateSubscriber<T>;
// @ts-ignore

// @ts-ignore
export type Subscriber<
// @ts-ignore
  T extends GraphEventMap = GraphEventMap
// @ts-ignore
> = ReturnType<GenerateSubscriber<T>>['subscribe'];
// @ts-ignore

// @ts-ignore
export type Unsubscriber<
// @ts-ignore
  T extends GraphEventMap = GraphEventMap
// @ts-ignore
> = ReturnType<GenerateSubscriber<T>>['unsubscribe'];
// @ts-ignore

// @ts-ignore
export type Emitter<
// @ts-ignore
  T extends GraphEventMap = GraphEventMap
// @ts-ignore
> = ReturnType<GenerateSubscriber<T>>['emit'];
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @returns an empty event bus with all events initialized to empty sets
// @ts-ignore
 */
// @ts-ignore
export const getInitialEventBus = () => {
// @ts-ignore
  const eventBus = {
// @ts-ignore
    /**
// @ts-ignore
     * BaseGraphEvents
// @ts-ignore
     */
// @ts-ignore
    onStructureChange: new Set(),
// @ts-ignore

// @ts-ignore
    onNodeAdded: new Set(),
// @ts-ignore
    onBulkNodeAdded: new Set(),
// @ts-ignore

// @ts-ignore
    onNodeRemoved: new Set(),
// @ts-ignore
    onBulkNodeRemoved: new Set(),
// @ts-ignore

// @ts-ignore
    onNodeMoved: new Set(),
// @ts-ignore
    onBulkNodeMoved: new Set(),
// @ts-ignore

// @ts-ignore
    onEdgeAdded: new Set(),
// @ts-ignore
    onBulkEdgeAdded: new Set(),
// @ts-ignore

// @ts-ignore
    onEdgeRemoved: new Set(),
// @ts-ignore
    onBulkEdgeRemoved: new Set(),
// @ts-ignore

// @ts-ignore
    onEdgeLabelChange: new Set(),
// @ts-ignore

// @ts-ignore
    onRepaint: new Set(),
// @ts-ignore
    onNodeHoverChange: new Set(),
// @ts-ignore
    onGraphReset: new Set(),
// @ts-ignore

// @ts-ignore
    onClick: new Set(),
// @ts-ignore
    onMouseDown: new Set(),
// @ts-ignore
    onMouseUp: new Set(),
// @ts-ignore
    onMouseMove: new Set(),
// @ts-ignore
    onDblClick: new Set(),
// @ts-ignore
    onContextMenu: new Set(),
// @ts-ignore

// @ts-ignore
    onKeyDown: new Set(),
// @ts-ignore
    onKeyUp: new Set(),
// @ts-ignore

// @ts-ignore
    onThemeChange: new Set(),
// @ts-ignore
    onSettingsChange: new Set(),
// @ts-ignore

// @ts-ignore
    /**
// @ts-ignore
     * HistoryGraphEvents
// @ts-ignore
     */
// @ts-ignore
    onUndo: new Set(),
// @ts-ignore
    onRedo: new Set(),
// @ts-ignore

// @ts-ignore
    /**
// @ts-ignore
     * FocusGraphEvents
// @ts-ignore
     */
// @ts-ignore
    onFocusChange: new Set(),
// @ts-ignore

// @ts-ignore
    /**
// @ts-ignore
     * DraggableGraphEvents
// @ts-ignore
     */
// @ts-ignore
    onNodeDragStart: new Set(),
// @ts-ignore
    onNodeDrop: new Set(),
// @ts-ignore

// @ts-ignore
    /**
// @ts-ignore
     * NodeAnchorGraphEvents
// @ts-ignore
     */
// @ts-ignore
    onNodeAnchorDragStart: new Set(),
// @ts-ignore
    onNodeAnchorDrop: new Set(),
// @ts-ignore

// @ts-ignore
    /**
// @ts-ignore
     * MarqueeGraphEvents
// @ts-ignore
     */
// @ts-ignore
    onGroupDragStart: new Set(),
// @ts-ignore
    onGroupDrop: new Set(),
// @ts-ignore
  } as const satisfies GraphEventBus
// @ts-ignore

// @ts-ignore
  return eventBus
}

// @ts-ignore
export type BaseGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when a node or edge is added or removed from the graph
// @ts-ignore
   */
// @ts-ignore
  onStructureChange: (nodes: GNode[], edges: GEdge[]) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when a node is added to the graph
// @ts-ignore
   */
// @ts-ignore
  onNodeAdded: (node: GNode, options: AddNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when multiple nodes are added to the graph as a group
// @ts-ignore
   */
// @ts-ignore
  onBulkNodeAdded: (nodes: GNode[], options: AddNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when a node is removed from the graph
// @ts-ignore
   */
// @ts-ignore
  onNodeRemoved: (removedNode: GNode, removedEdges: GEdge[], options: RemoveNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when multiple nodes are removed from the graph as a group
// @ts-ignore
   */
// @ts-ignore
  onBulkNodeRemoved: (removedNodes: GNode[], removedEdges: GEdge[], options: RemoveNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when a node is moved to a new position on the canvas
// @ts-ignore
   */
// @ts-ignore
  onNodeMoved: (node: GNode, options: MoveNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when multiple nodes are moved to new positions on the canvas in as a group
// @ts-ignore
   */
// @ts-ignore
  onBulkNodeMoved: (nodes: GNode[], options: MoveNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when an edge is added to the graph
// @ts-ignore
   */
// @ts-ignore
  onEdgeAdded: (edge: GEdge, options: AddEdgeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when multiple edges are added to the graph as a group
// @ts-ignore
   */
// @ts-ignore
  onBulkEdgeAdded: (edges: GEdge[], options: AddEdgeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when an edge is removed from the graph
// @ts-ignore
   */
// @ts-ignore
  onEdgeRemoved: (edge: GEdge, options: RemoveEdgeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when multiple edges are removed from the graph as a group
// @ts-ignore
   */
// @ts-ignore
  onBulkEdgeRemoved: (edges: GEdge[], options: RemoveEdgeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when an edge's text label is changed
// @ts-ignore
   */
// @ts-ignore
  onEdgeLabelChange: (edge: GEdge) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the canvas is repainted
// @ts-ignore
   *
// @ts-ignore
   * WARNING: items drawn to the canvas using ctx won't be tied to graphs internal state.
// @ts-ignore
   * Use updateAggregator if you need drawn item to integrate with graph APIs
// @ts-ignore
   */
// @ts-ignore
  onRepaint: (ctx: CanvasRenderingContext2D, repaintId: string) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the node that the user is hovering over changes.
// @ts-ignore
   * undefined if the user is not hovering over a node
// @ts-ignore
   */
// @ts-ignore
  onNodeHoverChange: (newNode: GNode | undefined, oldNode: GNode | undefined) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the reset process is triggered
// @ts-ignore
   */
// @ts-ignore
  onGraphReset: () => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the canvas is clicked on (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onClick: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user clicks the mouse button on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onMouseDown: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user releases the mouse button on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onMouseUp: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user moves the mouse on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onMouseMove: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the canvas is double clicked on (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onDblClick: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the canvas is right clicked on (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onContextMenu: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when a key is pressed down on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onKeyDown: (ev: KeyboardEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when a key is released on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onKeyUp: (ev: KeyboardEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the graph theme is changed
// @ts-ignore
   */
// @ts-ignore
  onThemeChange: (diff: DeepPartial<GraphTheme>) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the settings of the graph are changed
// @ts-ignore
   */
// @ts-ignore
  onSettingsChange: (diff: DeepPartial<GraphSettings>) => void;
}

// @ts-ignore
export type HistoryGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when the undo action is triggered
// @ts-ignore
   */
// @ts-ignore
  onUndo: (historyRecord: HistoryRecord, options: UndoHistoryOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the redo action is triggered
// @ts-ignore
   */
// @ts-ignore
  onRedo: (historyRecord: HistoryRecord, options: RedoHistoryOptions) => void;
}

// @ts-ignore
export type FocusGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when the set of focused items changes
// @ts-ignore
   */
// @ts-ignore
  onFocusChange: (newItemIds: Set<string>, oldItemId: Set<string>) => void;
}

// @ts-ignore
export type DraggableGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when the user initiates a drag on a node
// @ts-ignore
   */
// @ts-ignore
  onNodeDragStart: (node: GNode) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user drops a node
// @ts-ignore
   */
// @ts-ignore
  onNodeDrop: (node: GNode) => void;
}

// @ts-ignore
export type NodeAnchorGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when the user initiates a drag on a node anchor
// @ts-ignore
   */
// @ts-ignore
  onNodeAnchorDragStart: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user drops a node anchor
// @ts-ignore
   */
// @ts-ignore
  onNodeAnchorDrop: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
}

// @ts-ignore
export type MarqueeGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when the user starts a marquee drag
// @ts-ignore
   */
// @ts-ignore
  onGroupDragStart: (nodes: GNode[], startingCoordinates: Coordinate) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user drops a marquee drag
// @ts-ignore
   */
// @ts-ignore
  onGroupDrop: (nodes: GNode[], endCoordinates: Coordinate) => void;
}

// @ts-ignore
export type UserEditableGraphEventMap = {}

// @ts-ignore
export type CollaborativeGraphEventMap = {}

// @ts-ignore
export type LabelledItem = { label: string };

// @ts-ignore
type PropsNeededFromGraph = 'edges' | 'getNode' | 'getEdge' | 'getTheme' | 'settings'

// @ts-ignore
export type SupportedNodeShapes = 'circle' | 'square'

// @ts-ignore
export type SelectControls = ReturnType<typeof selectFromGraph>;

// @ts-ignore
export type BaseGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether to display edge labels
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  displayEdgeLabels: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * whether edge labels should be editable
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  edgeLabelsEditable: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * a setter for edge labels - takes the user inputted string and returns a string that will
// @ts-ignore
   * be set as the edge label or returns undefined if the edge label should not be set
// @ts-ignore
   * @default function tries converting the user input to a number
// @ts-ignore
   */
// @ts-ignore
  edgeInputToLabel: (input: string) => string | undefined;
// @ts-ignore
  /**
// @ts-ignore
   * a function that returns a new label for a node when a new node is created.
// @ts-ignore
   * if null, new nodes will be generated alphabetically: A, B, C, ... Z, AA, AB, ...
// @ts-ignore
   * @default null
// @ts-ignore
   */
// @ts-ignore
  newNodeLabelGetter: null | (() => string);
// @ts-ignore
  /**
// @ts-ignore
   * whether the graph is directed, if true, all edges are directed, else all edges are undirected
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  isGraphDirected: boolean;
}

// @ts-ignore
export type FocusGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * if false, no items on the graph can be focused
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  focusable: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * a list of item ids that cannot be focused
// @ts-ignore
   * @default []
// @ts-ignore
   */
// @ts-ignore
  focusBlacklist: string[];
}

// @ts-ignore
export type DraggableGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether the graph is draggable
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  draggable: boolean;
}

// @ts-ignore
export type NodeAnchorGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether node anchors are enabled
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  nodeAnchors: boolean
}

// @ts-ignore
export type MarqueeGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether marquee selection is enabled
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  marquee: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * the types of graph items that can be marquee-selected
// @ts-ignore
   * @default ['node', 'edge']
// @ts-ignore
   */
// @ts-ignore
  marqueeSelectableGraphTypes: SchemaItem['graphType'][];
}

// @ts-ignore
export type UserEditableGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether the user can edit the graph
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  userEditable: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * the default label assigned to edges when created using the UI
// @ts-ignore
   * @default 1
// @ts-ignore
   */
// @ts-ignore
  userAddedEdgeLabel: string,
// @ts-ignore
  /**
// @ts-ignore
   * whether to allow self loops.
// @ts-ignore
   * relevant on directed graphs where a node can have an edge to itself
// @ts-ignore
   * @default false
// @ts-ignore
   */
// @ts-ignore
  userAddedEdgeRuleNoSelfLoops: boolean,
// @ts-ignore
  /**
// @ts-ignore
   * whether to allow only one edge per path between two nodes.
// @ts-ignore
   * relevant on directed graphs where multiple edges can exist between two nodes
// @ts-ignore
   * @default false
// @ts-ignore
   */
// @ts-ignore
  userAddedEdgeRuleOneEdgePerPath: boolean,
}

// @ts-ignore
export type PersistentGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether the graph is persistent
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  persistent: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * the key to use for storing the graph in local storage
// @ts-ignore
   * @default "graph"
// @ts-ignore
   */
// @ts-ignore
  persistentStorageKey: string,
// @ts-ignore
  /**
// @ts-ignore
   * whether to track theme changes
// @ts-ignore
   * @default false
// @ts-ignore
   */
// @ts-ignore
  persistentTrackTheme: boolean,
// @ts-ignore
  /**
// @ts-ignore
   * whether to track settings changes
// @ts-ignore
   * @default false
// @ts-ignore
   */
// @ts-ignore
  persistentTrackSettings: boolean,
}

// @ts-ignore
export type CollaborativeGraphSettings = {}

// @ts-ignore
export type GraphSettings = (
// @ts-ignore
  BaseGraphSettings &
// @ts-ignore
  FocusGraphSettings &
// @ts-ignore
  DraggableGraphSettings &
// @ts-ignore
  NodeAnchorGraphSettings &
// @ts-ignore
  MarqueeGraphSettings &
// @ts-ignore
  UserEditableGraphSettings &
// @ts-ignore
  PersistentGraphSettings &
// @ts-ignore
  CollaborativeGraphSettings
// @ts-ignore
)
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * the default settings for a graph instance
// @ts-ignore
 */
// @ts-ignore
export const DEFAULT_GRAPH_SETTINGS = {
// @ts-ignore
  ...DEFAULT_BASE_SETTINGS,
// @ts-ignore
  ...DEFAULT_FOCUS_SETTINGS,
// @ts-ignore
  ...DEFAULT_DRAGGABLE_SETTINGS,
// @ts-ignore
  ...DEFAULT_NODE_ANCHOR_SETTINGS,
// @ts-ignore
  ...DEFAULT_MARQUEE_SETTINGS,
// @ts-ignore
  ...DEFAULT_USER_EDITABLE_SETTINGS,
// @ts-ignore
  ...DEFAULT_PERSISTENT_SETTINGS,
// @ts-ignore
  ...DEFAULT_COLLABORATIVE_SETTINGS,
// @ts-ignore
} as const satisfies GraphSettings

// @ts-ignore
type ModifiedExtract<T, U, R = never> = T extends U ? T : R

// @ts-ignore
type FuncExtract<T, U> = ModifiedExtract<T, U, () => void>

// @ts-ignore
type ThemeParams<T extends keyof GraphTheme> = Parameters<FuncExtract<GraphTheme[T], Function>>

// @ts-ignore
type ResolvedThemeParams<T extends keyof GraphTheme> = ThemeParams<T> extends []
// @ts-ignore
  ? [] : Exclude<ThemeParams<T>, []>;
// @ts-ignore

// @ts-ignore

// @ts-ignore
export const getThemeResolver = (
// @ts-ignore
  theme: Ref<Partial<GraphTheme>>,
// @ts-ignore
  themeMap: FullThemeMap,
// @ts-ignore
) => <
// @ts-ignore
  T extends keyof GraphTheme,
// @ts-ignore
  K extends ResolvedThemeParams<T>
// @ts-ignore
>(
// @ts-ignore
  prop: T,
// @ts-ignore
  ...args: K
// @ts-ignore
) => {
// @ts-ignore
    const themeMapEntry = themeMap[prop].findLast((themeMapEntryItem: FullThemeMap[T][number]) => {
// @ts-ignore
      const themeGetterOrValue = themeMapEntryItem.value
// @ts-ignore
      const themeValue = getValue<typeof themeGetterOrValue, K>(
// @ts-ignore
        themeGetterOrValue,
// @ts-ignore
        ...args
// @ts-ignore
      ) as UnwrapMaybeGetter<GraphTheme[T]>
// @ts-ignore
      return themeValue ?? false
// @ts-ignore
    })
// @ts-ignore
    const getter = themeMapEntry?.value ?? theme.value[prop]
// @ts-ignore
    if (!getter) throw new Error(`Theme property "${prop}" not found`)
// @ts-ignore
    return getValue<typeof getter, K>(getter, ...args) as UnwrapMaybeGetter<GraphTheme[T]>
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * describes the function that gets a value from a theme inquiry
// @ts-ignore
 */
// @ts-ignore
export type ThemeGetter = ReturnType<typeof getThemeResolver>

// @ts-ignore
export type GraphTheme = GraphThemeImport
// @ts-ignore
export type GraphThemeKey = keyof GraphTheme
// @ts-ignore

// @ts-ignore
export const THEMES = {
// @ts-ignore
  light: LIGHT_THEME,
// @ts-ignore
  dark: DARK_THEME,
// @ts-ignore
  girl: GIRL_THEME,
// @ts-ignore
} as const satisfies Record<string, GraphTheme>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * gets the theme attributes for a GNode at the point in time the function is called
// @ts-ignore
 *
// @ts-ignore
 * @param getTheme - the theme getter function
// @ts-ignore
 * @param node - the node to get the theme for
// @ts-ignore
 * @returns the theme attributes for the node
// @ts-ignore
 */
// @ts-ignore
export const resolveThemeForNode = (getTheme: ThemeGetter, node: GNode): BaseGraphNodeTheme => ({
// @ts-ignore
  nodeSize: getTheme('nodeSize', node),
// @ts-ignore
  nodeBorderWidth: getTheme('nodeBorderWidth', node),
// @ts-ignore
  nodeColor: getTheme('nodeColor', node),
// @ts-ignore
  nodeBorderColor: getTheme('nodeBorderColor', node),
// @ts-ignore
  nodeTextSize: getTheme('nodeTextSize', node),
// @ts-ignore
  nodeTextColor: getTheme('nodeTextColor', node),
// @ts-ignore
  nodeText: getTheme('nodeText', node),
// @ts-ignore
  nodeShape: getTheme('nodeShape', node),
// @ts-ignore
})
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * gets the theme attributes for a GEdge at the point in time the function is called
// @ts-ignore
 *
// @ts-ignore
 * @param getTheme - the theme getter function
// @ts-ignore
 * @param edge - the edge to get the theme for
// @ts-ignore
 * @returns the theme attributes for the edge
// @ts-ignore
 */
// @ts-ignore
export const resolveThemeForEdge = (getTheme: ThemeGetter, edge: GEdge): BaseGraphEdgeTheme => ({
// @ts-ignore
  edgeWidth: getTheme('edgeWidth', edge),
// @ts-ignore
  edgeColor: getTheme('edgeColor', edge),
// @ts-ignore
  edgeText: getTheme('edgeText', edge),
// @ts-ignore
  edgeTextSize: getTheme('edgeTextSize', edge),
// @ts-ignore
  edgeTextColor: getTheme('edgeTextColor', edge),
// @ts-ignore
  edgeTextFontWeight: getTheme('edgeTextFontWeight', edge),
// @ts-ignore
})

// @ts-ignore
export type NonColorGraphThemes = Pick<
// @ts-ignore
  GraphTheme,
// @ts-ignore
  'nodeShape' |
// @ts-ignore
  'nodeSize' |
// @ts-ignore
  'nodeBorderWidth' |
// @ts-ignore
  'nodeTextSize' |
// @ts-ignore
  'nodeAnchorRadius' |
// @ts-ignore
  'edgeWidth' |
// @ts-ignore
  'edgeTextSize' |
// @ts-ignore
  'nodeText' |
// @ts-ignore
  'edgeText' |
// @ts-ignore
  'edgeTextFontWeight' |
// @ts-ignore
  'linkPreviewWidth'
// @ts-ignore
>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * themes that do not depend on color scheme
// @ts-ignore
 */
// @ts-ignore
export const NON_COLOR_THEMES: NonColorGraphThemes = {
// @ts-ignore
  nodeShape: 'circle',
// @ts-ignore
  nodeSize: 35,
// @ts-ignore
  nodeBorderWidth: 8,
// @ts-ignore
  nodeTextSize: 24,
// @ts-ignore
  // Math.ceil(Math.sqrt(nodeSize) * 2)
// @ts-ignore
  nodeAnchorRadius: Math.ceil(Math.sqrt(35) * 2),
// @ts-ignore
  edgeWidth: 10,
// @ts-ignore
  edgeTextSize: 20,
// @ts-ignore
  nodeText: ({ label }) => label,
// @ts-ignore
  edgeText: ({ label }) => label,
// @ts-ignore
  edgeTextFontWeight: 'bold',
// @ts-ignore
  linkPreviewWidth: 10,
}

// @ts-ignore
export type UITheme = {
// @ts-ignore
  primaryColor: string,
// @ts-ignore
  primaryTextColor: string,
// @ts-ignore
  secondaryColor: string,
// @ts-ignore
  secondaryTextColor: string,
// @ts-ignore
  tertiaryColor: string,
// @ts-ignore
  tertiaryTextColor: string,
}

// @ts-ignore
export type BaseGraphNodeTheme = {
// @ts-ignore
  nodeSize: number,
// @ts-ignore
  nodeBorderWidth: number,
// @ts-ignore
  nodeColor: string,
// @ts-ignore
  nodeBorderColor: string,
// @ts-ignore
  nodeText: string,
// @ts-ignore
  nodeTextSize: number,
// @ts-ignore
  nodeTextColor: string,
// @ts-ignore
  nodeShape: SupportedNodeShapes,
}

// @ts-ignore
export type BaseGraphEdgeTheme = {
// @ts-ignore
  edgeColor: string,
// @ts-ignore
  edgeWidth: number,
// @ts-ignore
  edgeText: string,
// @ts-ignore
  edgeTextSize: number,
// @ts-ignore
  edgeTextColor: string,
// @ts-ignore
  edgeTextFontWeight: TextFontWeight,
}

// @ts-ignore
export type BaseGraphTheme = WrapWithNodeGetter<BaseGraphNodeTheme> & WrapWithEdgeGetter<BaseGraphEdgeTheme> & {
// @ts-ignore
  graphBgColor: string,
// @ts-ignore
  graphBgPatternColor: string,
}

// @ts-ignore
export type HistoryGraphTheme = {}

// @ts-ignore
export type DraggableGraphTheme = {}

// @ts-ignore
export type MarqueeGraphTheme = {
// @ts-ignore
  marqueeSelectionBoxColor: string,
// @ts-ignore
  marqueeSelectionBoxBorderColor: string,
// @ts-ignore
  marqueeEncapsulatedNodeBoxColor: string,
// @ts-ignore
  marqueeEncapsulatedNodeBoxBorderColor: string,
}

// @ts-ignore
export type UserEditableGraphTheme = {}

// @ts-ignore
export type CollaborativeGraphTheme = {}

// @ts-ignore
export type MaybeGetterOrVoid<T> = MaybeGetter<UnwrapMaybeGetter<T> | void, MaybeGetterParams<T>>

// @ts-ignore
type WrapWithEdgeGetter<T extends Record<string, any>> = {
// @ts-ignore
  [K in keyof T]: EdgeGetterOrValue<T[K]>
}

// @ts-ignore
export type ThemeMapEntry<T extends keyof GraphTheme> = {
// @ts-ignore
  value: MaybeGetterOrVoid<GraphTheme[T]>,
// @ts-ignore
  useThemeId: string,
}

// @ts-ignore
export type FullThemeMap = {
// @ts-ignore
  [K in keyof GraphTheme]: ThemeMapEntry<K>[]
}

// @ts-ignore
export type PartialThemeMap = Partial<FullThemeMap>

// @ts-ignore
type ThemeableGraph = Pick<Graph, 'themeMap'>

// @ts-ignore
export type TutorialStepForEvent<T extends GraphEvent> = {
// @ts-ignore
  /**
// @ts-ignore
   * the hint to display to the user in order to complete the step
// @ts-ignore
   */
// @ts-ignore
  hint: string;
// @ts-ignore
  /**
// @ts-ignore
   * the event that triggers a dismiss inquiry, if its just the event itself (T), then the step will be dismissed
// @ts-ignore
   * upon invocation of the event via event bus, if its an object, then the step will be dismissed upon invocation
// @ts-ignore
   * of the event and only if the predicate returns true
// @ts-ignore
   */
// @ts-ignore
  dismiss: T | {
// @ts-ignore
    event: T,
// @ts-ignore
    /**
// @ts-ignore
     * @param args the arguments passed to the event handler as defined in the event map
// @ts-ignore
     * @returns true if the step should be dismissed
// @ts-ignore
     */
// @ts-ignore
    predicate: (...args: Parameters<GraphEventMap[T]>) => boolean
// @ts-ignore
  };
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * describes a step that will resolve after a set amount of time
// @ts-ignore
 */
// @ts-ignore
export type TimeoutStep = {
// @ts-ignore
  hint: string,
// @ts-ignore
  dismiss: 'onTimeout',
// @ts-ignore
  /**
// @ts-ignore
   * time to wait before the next step, in milliseconds
// @ts-ignore
   */
// @ts-ignore
  after: number,
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
type SharedStepProps = {
// @ts-ignore
  /**
// @ts-ignore
   * the text shown to the user in order to help guide them along
// @ts-ignore
   */
// @ts-ignore
  hint: string,
// @ts-ignore
  /**
// @ts-ignore
   * describes the precondition option for a tutorial step.
// @ts-ignore
   * a precondition allows the implementer to run a function before the step is shown.
// @ts-ignore
   * its boolean return acts just as a predicate would act as defined in base tutorial step.
// @ts-ignore
   * if the precondition returns true, its like the condition for going to the next step is
// @ts-ignore
   * already met, so the step will be skipped.
// @ts-ignore
   */
// @ts-ignore
  precondition?: (graph: Graph) => boolean,
// @ts-ignore
  /**
// @ts-ignore
   * callback to run when the step is initialized.
// @ts-ignore
   * runs before precondition
// @ts-ignore
   */
// @ts-ignore
  onInit?: () => void,
// @ts-ignore
  /**
// @ts-ignore
   * callback to run when the step is dismissed
// @ts-ignore
   */
// @ts-ignore
  onDismiss?: () => void,
// @ts-ignore
  /**
// @ts-ignore
   * describes options for highlighting an element.
// @ts-ignore
   * passing a string will highlight the element with the id
// @ts-ignore
   */
// @ts-ignore
  highlightElement?: string | {
// @ts-ignore
    /**
// @ts-ignore
     * id of the element to highlight
// @ts-ignore
     */
// @ts-ignore
    id?: string;
// @ts-ignore
    /**
// @ts-ignore
     * css class name to apply to the element
// @ts-ignore
     * @default 'element-highlight'
// @ts-ignore
     */
// @ts-ignore
    className?: string;
// @ts-ignore
  }
}

// @ts-ignore
export type IntervalStep = {
// @ts-ignore
  hint: string,
// @ts-ignore
  dismiss: 'onInterval' | {
// @ts-ignore
    event: 'onInterval',
// @ts-ignore
    /**
// @ts-ignore
     * @param iteration the number of times the interval has been called
// @ts-ignore
     * @returns true if the step should be dismissed
// @ts-ignore
     */
// @ts-ignore
    predicate: (iteration: number) => boolean
// @ts-ignore
  },
// @ts-ignore
  /**
// @ts-ignore
   * time to wait before the next evaluation, in milliseconds
// @ts-ignore
   * @default 1000 milliseconds
// @ts-ignore
   */
// @ts-ignore
  interval?: number,
}

// @ts-ignore
export type GraphEventStep = {
// @ts-ignore
  [K in GraphEvent]: TutorialStepForEvent<K>
// @ts-ignore
}[GraphEvent];
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * describes a step in a tutorial sequence
// @ts-ignore
 */
// @ts-ignore
export type TutorialStep = (
// @ts-ignore
  GraphEventStep |
// @ts-ignore
  TimeoutStep |
// @ts-ignore
  IntervalStep
// @ts-ignore
) & SharedStepProps;
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * describes a list of tutorial steps that will be executed in order from index 0 to n - 1
// @ts-ignore
 */
// @ts-ignore
export type TutorialSequence = TutorialStep[];
// @ts-ignore

// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * time to wait (in milliseconds) between the dismissal of a step and the initialization of the next step
// @ts-ignore
 */
// @ts-ignore
export const DELAY_UNTIL_NEXT_STEP = 1000;
// @ts-ignore

// @ts-ignore
export const TUTORIAL_THEME_ID = 'tutorial'
// @ts-ignore

// @ts-ignore
export type TutorialControls = {
// @ts-ignore
  /**
// @ts-ignore
   * skip forward to the next step of the tutorial.
// @ts-ignore
   * wont do anything if the current step is the last step
// @ts-ignore
   */
// @ts-ignore
  nextStep: () => void
// @ts-ignore
  /**
// @ts-ignore
   * skip backward to the previous step of the tutorial.
// @ts-ignore
   * wont do anything if the current step is -1.
// @ts-ignore
   */
// @ts-ignore
  prevStep: () => void
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * an array of all the steps in the tutorial
// @ts-ignore
   */
// @ts-ignore
  sequence: Ref<TutorialSequence>
// @ts-ignore
  /**
// @ts-ignore
   * the current step in the tutorial sequence. ranges from -1 to sequence.value.length.
// @ts-ignore
   * where -1 is the state before the tutorial has begun and sequence.value.length is the
// @ts-ignore
   * state after the tutorial has completed.
// @ts-ignore
   */
// @ts-ignore
  step: ComputedRef<number>
// @ts-ignore
  /**
// @ts-ignore
   * set the current step of the tutorial
// @ts-ignore
   * @param step the step to set the tutorial to
// @ts-ignore
   * @throws if step is not within the bounds of the sequence (-1 to sequence.value.length)
// @ts-ignore
   */
// @ts-ignore
  setStep: (step: number) => void
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * start the tutorial. this will begin the tutorial from step 0
// @ts-ignore
   */
// @ts-ignore
  start: () => void
// @ts-ignore
  /**
// @ts-ignore
   * stop the tutorial. this will end the tutorial and reset all state
// @ts-ignore
   */
// @ts-ignore
  stop: () => void
// @ts-ignore
  /**
// @ts-ignore
   * pause the tutorial. no progress can be made while the tutorial is paused
// @ts-ignore
   */
// @ts-ignore
  paused: Ref<boolean>
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * whether the tutorial is currently active.
// @ts-ignore
   * changes to true when start is called and false when stop is called
// @ts-ignore
   */
// @ts-ignore
  isActive: ComputedRef<boolean>
// @ts-ignore
  /**
// @ts-ignore
   * whether the tutorial is over.
// @ts-ignore
   * true when the step is sequence.value.length
// @ts-ignore
   */
// @ts-ignore
  isOver: ComputedRef<boolean>
// @ts-ignore
  /**
// @ts-ignore
   * whether the tutorial has begun.
// @ts-ignore
   * true when the step is -1
// @ts-ignore
   */
// @ts-ignore
  hasBegun: ComputedRef<boolean>
}

// @ts-ignore
export type UseGraph = typeof useGraph

// @ts-ignore
export type Graph = ReturnType<UseGraph>

// @ts-ignore
export type GraphOptions = {
// @ts-ignore
  theme: Partial<GraphTheme>;
// @ts-ignore
  settings: Partial<GraphSettings>;
}

// @ts-ignore
export type GNode = {
// @ts-ignore
  /**
// @ts-ignore
   * unique identifier for the node
// @ts-ignore
   */
// @ts-ignore
  id: string,
// @ts-ignore
  /**
// @ts-ignore
   * it reflects what the user sees in the UI.
// @ts-ignore
   * recommended to be unique.
// @ts-ignore
   */
// @ts-ignore
  label: string,
// @ts-ignore
  /**
// @ts-ignore
   * the x position of the node on the canvas
// @ts-ignore
   */
// @ts-ignore
  x: number,
// @ts-ignore
  /**
// @ts-ignore
   * the y position of the node on the canvas
// @ts-ignore
   */
// @ts-ignore
  y: number,
}

// @ts-ignore
export type GEdge = {
// @ts-ignore
  /**
// @ts-ignore
   * unique identifier for the edge
// @ts-ignore
   */
// @ts-ignore
  id: string,
// @ts-ignore
  /**
// @ts-ignore
   * id of the node that the edge is coming from
// @ts-ignore
   */
// @ts-ignore
  to: string,
// @ts-ignore
  /**
// @ts-ignore
   * id of the node that the edge is going to
// @ts-ignore
   */
// @ts-ignore
  from: string,
// @ts-ignore
  /**
// @ts-ignore
   * the text label that appears on the edge - NOT IMPLEMENTED
// @ts-ignore
   */
// @ts-ignore
  label: string,
}

// @ts-ignore
export type Aggregator = SchemaItem[]

// @ts-ignore
export type UpdateAggregator = (aggregator: Aggregator) => Aggregator

// @ts-ignore
export type RemoveAnyArray<T extends any[]> = T extends ['!!!-@-NOT-A-TYPE-@-!!!'][] ? never : T

// @ts-ignore
export type MaybeGetter<T, K extends any[] = []> = T | ((...arg: K) => T)

// @ts-ignore
export type NodeGetterOrValue<T> = MaybeGetter<T, [GNode]>
// @ts-ignore
export type EdgeGetterOrValue<T> = MaybeGetter<T, [GEdge]>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes the value of a MaybeGetter
// @ts-ignore
*/
// @ts-ignore
export type UnwrapMaybeGetter<T> = T extends MaybeGetter<infer U, infer _> ? U : T
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes the parameters of a MaybeGetter
// @ts-ignore
*/
// @ts-ignore
export type MaybeGetterParams<T> = RemoveAnyArray<T extends MaybeGetter<infer _, infer K> ? K : []>
// @ts-ignore

// @ts-ignore
type EventNames = keyof HTMLElementEventMap
// @ts-ignore

// @ts-ignore
type FilterEventNames<T> = {
// @ts-ignore
  [K in EventNames]: HTMLElementEventMap[K] extends T ? K : never
// @ts-ignore
}[EventNames]
// @ts-ignore

// @ts-ignore
type MouseEventNames = FilterEventNames<MouseEvent>
// @ts-ignore
type KeyboardEventNames = FilterEventNames<KeyboardEvent>
// @ts-ignore

// @ts-ignore
type EventMap<T extends EventNames, E> = Record<T, (ev: E) => void>
// @ts-ignore

// @ts-ignore
export type MouseEventMap = EventMap<MouseEventNames, MouseEvent>
// @ts-ignore
export type KeyboardEventMap = EventMap<KeyboardEventNames, KeyboardEvent>
// @ts-ignore

// @ts-ignore
export type MouseEventEntries = [keyof MouseEventMap, (ev: MouseEvent) => void][]
// @ts-ignore
export type KeyboardEventEntries = [keyof KeyboardEventMap, (ev: KeyboardEvent) => void][]
// @ts-ignore

// @ts-ignore
type BaseGraphTypes = 'node' | 'edge'
// @ts-ignore
type MarqueeGraphTypes = 'marquee-box' | 'encapsulated-node-box'
// @ts-ignore
type NodeAnchorGraphTypes = 'node-anchor' | 'link-preview'
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes a schema item that can be fed into the aggregator in order to be rendered on the canvas
// @ts-ignore
 */
// @ts-ignore
export type SchemaItem = {
// @ts-ignore
  /**
// @ts-ignore
   * unique identifier for the schema item
// @ts-ignore
   */
// @ts-ignore
  id: string,
// @ts-ignore
  /**
// @ts-ignore
   * the type of graph data this schema item represents
// @ts-ignore
   */
// @ts-ignore
  graphType: BaseGraphTypes | NodeAnchorGraphTypes | MarqueeGraphTypes,
// @ts-ignore
  /**
// @ts-ignore
   * determines the order in which this schema item is rendered
// @ts-ignore
   * on the canvas. The lower the number, the higher the priority, the higher the priority,
// @ts-ignore
   * the earlier the item is rendered on the canvas.
// @ts-ignore
   * (items with a lower priority score will appear visually underneath those with a higher score)
// @ts-ignore
   */
// @ts-ignore
  priority: number,
// @ts-ignore
  /**
// @ts-ignore
   * the magic shape instance that will be rendered on the canvas
// @ts-ignore
   */
// @ts-ignore
  shape: Shape,
}

// @ts-ignore
export type AdjacencyList = Record<string, string[]>;

// @ts-ignore
export type FullNodeAdjacencyList = Record<string, GNode[]>;

// @ts-ignore
export type AnnotationOptions = Partial<{
// @ts-ignore
  color: string;
// @ts-ignore
  brushWeight: number;
// @ts-ignore
  eraserBrushWeight: number;
// @ts-ignore
}>;
// @ts-ignore

// @ts-ignore
export type Action = {
// @ts-ignore
  type: "draw" | "erase";
// @ts-ignore
  color: string;
// @ts-ignore
  brushWeight: number;
// @ts-ignore
  points: Coordinate[];
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export const ANNOTATION_DEFAULTS = {
// @ts-ignore
  color: "red",
// @ts-ignore
  brushWeight: 3,
// @ts-ignore
  eraserBrushWeight: 50,
// @ts-ignore
};

// @ts-ignore
export type GraphPlaygroundControls = {
// @ts-ignore
  theme: boolean,
// @ts-ignore
  tutorial: boolean,
// @ts-ignore
  collab: boolean,
// @ts-ignore
  settings: boolean,
// @ts-ignore
  buttons: boolean,
}

// @ts-ignore
export type DijkstrasAlgorithm = ReturnType<typeof dijkstras>;
// @ts-ignore
export type DijkstrasTrace = ReturnType<DijkstrasAlgorithm>;
// @ts-ignore
type TraceNodeDistance = { id: string; distance: number };
// @ts-ignore
type TraceExploredNode = { id: string; distance: number };
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * serializable infinity value for node distance
// @ts-ignore
 */
// @ts-ignore
export const INF = 999999;
// @ts-ignore

// @ts-ignore
const dijkstras = (graph: Graph) => (startingNodeId: GNode['id']) => {
// @ts-ignore

// @ts-ignore
  const distanceArr = graph.nodes.value.map(
// @ts-ignore
    (n) =>
// @ts-ignore
    ({
// @ts-ignore
      id: n.id,
// @ts-ignore
      distance: INF,
// @ts-ignore
    } satisfies TraceNodeDistance)
// @ts-ignore
  );
// @ts-ignore

// @ts-ignore
  // assign distance 0 to source
// @ts-ignore
  distanceArr.filter((n) => n.id === startingNodeId)[0].distance = 0;
// @ts-ignore

// @ts-ignore
  let priorityQueue = [...distanceArr];
// @ts-ignore
  const exploredNodes: TraceExploredNode[] = [{ id: startingNodeId, distance: 0 }];
// @ts-ignore
  const nodeParentMap = new Map<string, string>();
// @ts-ignore

// @ts-ignore
  // initialize trace with first source without any nodes explored
// @ts-ignore
  const trace = [
// @ts-ignore
    {
// @ts-ignore
      source: { id: startingNodeId, distance: 0 },
// @ts-ignore
      exploredNodes: JSON.parse(
// @ts-ignore
        JSON.stringify(exploredNodes)
// @ts-ignore
      ) as TraceExploredNode[],
// @ts-ignore
      distances: JSON.parse(JSON.stringify(distanceArr)) as TraceNodeDistance[],
// @ts-ignore
      nodeParentMap: new Map(nodeParentMap),
// @ts-ignore
    },
// @ts-ignore
  ];
// @ts-ignore

// @ts-ignore
  // iterate through priority queue
// @ts-ignore
  while (priorityQueue.length !== 0) {
// @ts-ignore
    // grab node with least-distance
// @ts-ignore
    const sourceNode = priorityQueue.reduce(
// @ts-ignore
      (acc, cur) => (cur.distance < acc.distance ? cur : acc),
// @ts-ignore
      { id: "", distance: Infinity }
// @ts-ignore
    );
// @ts-ignore

// @ts-ignore
    // remove that node
// @ts-ignore
    priorityQueue = priorityQueue.filter((e) => e.id !== sourceNode.id);
// @ts-ignore

// @ts-ignore
    // don't iterate through nodes with no ingoing edges
// @ts-ignore
    if (
// @ts-ignore
      getInboundEdges(sourceNode.id, graph).length === 0 &&
// @ts-ignore
      sourceNode.id !== startingNodeId
// @ts-ignore
    )
// @ts-ignore
      continue;
// @ts-ignore

// @ts-ignore
    // iterate through source's neighbors
// @ts-ignore
    getOutboundEdges(sourceNode.id, graph).forEach((edge) => {
// @ts-ignore
      // updates distance of neighbor if new distance is less than old
// @ts-ignore
      const newDistanceIsLess =
// @ts-ignore
        distanceArr.filter((e) => e.id === edge.from)[0].distance +
// @ts-ignore
        Number(edge.label) <
// @ts-ignore
        distanceArr.filter((e) => e.id === edge.to)[0].distance;
// @ts-ignore
      if (newDistanceIsLess) {
// @ts-ignore
        const newDistance =
// @ts-ignore
          distanceArr.filter((e) => e.id === edge.from)[0].distance +
// @ts-ignore
          Number(edge.label);
// @ts-ignore
        distanceArr.filter((e) => e.id === edge.to)[0].distance = newDistance;
// @ts-ignore

// @ts-ignore
        // idk if this should be outside if or not
// @ts-ignore
        const neighborAlreadyExplored = exploredNodes
// @ts-ignore
          .map((n) => n.id)
// @ts-ignore
          .includes(edge.to);
// @ts-ignore
        if (!neighborAlreadyExplored)
// @ts-ignore
          exploredNodes.push({ id: edge.to, distance: newDistance });
// @ts-ignore

// @ts-ignore
        nodeParentMap.set(edge.to, sourceNode.id);
// @ts-ignore
      }
// @ts-ignore
    });
// @ts-ignore
    trace.push({
// @ts-ignore
      source: sourceNode,
// @ts-ignore
      exploredNodes: JSON.parse(
// @ts-ignore
        JSON.stringify(exploredNodes)
// @ts-ignore
      ) as TraceExploredNode[],
// @ts-ignore
      distances: JSON.parse(JSON.stringify(distanceArr)) as TraceNodeDistance[],
// @ts-ignore
      nodeParentMap: new Map(nodeParentMap),
// @ts-ignore
    });
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  // push an empty source to give the impression that there are no more nodes to check
// @ts-ignore
  trace.push({
// @ts-ignore
    source: { id: "", distance: 0 },
// @ts-ignore
    exploredNodes: JSON.parse(
// @ts-ignore
      JSON.stringify(exploredNodes)
// @ts-ignore
    ) as TraceExploredNode[],
// @ts-ignore
    distances: JSON.parse(JSON.stringify(distanceArr)) as TraceNodeDistance[],
// @ts-ignore
    nodeParentMap: new Map(nodeParentMap),
// @ts-ignore
  });
// @ts-ignore

// @ts-ignore
  return trace;
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export const useDijkstra = (graph: Graph) => {
// @ts-ignore
  const trace = ref<DijkstrasTrace>([]);
// @ts-ignore
  const getDijkstrasTrace = dijkstras(graph);
// @ts-ignore

// @ts-ignore
  // TODO - make this be a ref that a user can write to
// @ts-ignore
  // const startingNodeId = ref<GNode['id'] | undefined>();
// @ts-ignore
  const startingNodeId = computed(() => {
// @ts-ignore
    const nodeLabelledA = graph.nodes.value.find((n) => n.label === "A");
// @ts-ignore
    return nodeLabelledA?.id;
// @ts-ignore
  })
// @ts-ignore

// @ts-ignore
  const update = () => {
// @ts-ignore
    if (!startingNodeId.value) return
// @ts-ignore
    const startingNode = graph.getNode(startingNodeId.value);
// @ts-ignore
    if (!startingNode) return
// @ts-ignore
    trace.value = getDijkstrasTrace(startingNode.id);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  graph.subscribe("onStructureChange", update);
// @ts-ignore
  graph.subscribe("onEdgeLabelChange", update);
// @ts-ignore
  graph.subscribe("onGraphReset", update);
// @ts-ignore

// @ts-ignore
  update();
// @ts-ignore

// @ts-ignore
  return { trace };
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export type DijkstraSimulatorControls = SimulationControls<DijkstrasTrace>

// @ts-ignore
export type MarkupSize = typeof MARKUP_SIZES[number];

// @ts-ignore
type ColorMapKey = GNode['id'] | GEdge['id'];
// @ts-ignore
type ColorMapValue = Color;
// @ts-ignore
export type ColorMap = Map<ColorMapKey, ColorMapValue>;
// @ts-ignore

// @ts-ignore
export const useMarkupColorizer = (graph: Graph) => {
// @ts-ignore
  const { setTheme, removeAllThemes } = useTheme(graph, MARKUP_USETHEME_ID);
// @ts-ignore

// @ts-ignore
  const colorMap = useLocalStorage('markup-color-map', new Map<ColorMapKey, ColorMapValue>());
// @ts-ignore

// @ts-ignore
  // go through all keys in the colorMap and remove inactive nodes/edges
// @ts-ignore
  // for (const key of colorMap.value.keys()) {
// @ts-ignore
  //   if (!graph.nodes.value[key] && !graph.edges.value[key]) {
// @ts-ignore
  //     colorMap.value.delete(key);
// @ts-ignore
  //   }
// @ts-ignore
  // }
// @ts-ignore

// @ts-ignore
  const colorNode = (node: GNode) => {
// @ts-ignore
    const color = colorMap.value.get(node.id);
// @ts-ignore
    if (!color) return;
// @ts-ignore
    return getValue(graph.theme.value.nodeColor, node);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const colorNodeBorder = (node: GNode) => {
// @ts-ignore
    const color = colorMap.value.get(node.id);
// @ts-ignore
    if (!color) return;
// @ts-ignore
    if (graph.isFocused(node.id)) return adjustHex(color, 30);
// @ts-ignore
    return color;
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const colorEdge = (edge: GEdge) => {
// @ts-ignore
    const color = colorMap.value.get(edge.id);
// @ts-ignore
    if (!color) return;
// @ts-ignore
    if (graph.isFocused(edge.id)) return adjustHex(color, 30);
// @ts-ignore
    return color;
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const colorize = () => {
// @ts-ignore
    setTheme('nodeColor', colorNode);
// @ts-ignore

// @ts-ignore
    setTheme('nodeBorderColor', colorNodeBorder);
// @ts-ignore
    setTheme('nodeFocusBorderColor', colorNodeBorder);
// @ts-ignore
    setTheme('nodeAnchorColor', colorNodeBorder);
// @ts-ignore
    setTheme('nodeAnchorColorWhenParentFocused', colorNodeBorder);
// @ts-ignore
    setTheme('edgeColor', colorEdge);
// @ts-ignore

// @ts-ignore
    setTheme('marqueeSelectionBoxColor', colors.TRANSPARENT)
// @ts-ignore
    setTheme('marqueeEncapsulatedNodeBoxBorderColor', colors.WHITE + '80')
// @ts-ignore
    setTheme('marqueeEncapsulatedNodeBoxColor', colors.TRANSPARENT)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const decolorize = () => {
// @ts-ignore
    removeAllThemes();
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    colorize,
// @ts-ignore
    decolorize,
// @ts-ignore
    colorMap,
// @ts-ignore
  };
}

// @ts-ignore
export type MarkupColorizerControls = ReturnType<typeof useMarkupColorizer>;

// @ts-ignore
type SizeMapKey = GNode['id'] | GEdge['id'];
// @ts-ignore
type SizeMapValue = MarkupSize;
// @ts-ignore
export type SizeMap = Map<SizeMapKey, SizeMapValue>;
// @ts-ignore

// @ts-ignore
export const useMarkupSizer = (graph: Graph) => {
// @ts-ignore
  const { setTheme, removeAllThemes } = useTheme(graph, MARKUP_USETHEME_ID);
// @ts-ignore

// @ts-ignore
  const sizeMap = useLocalStorage('markup-size-map', new Map<SizeMapKey, SizeMapValue>());
// @ts-ignore

// @ts-ignore
  const sizeNode = (node: GNode) => {
// @ts-ignore
    const size = sizeMap.value.get(node.id);
// @ts-ignore
    if (!size) return;
// @ts-ignore
    return SIZE_TO_RADIUS[size];
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const sizeEdge = (edge: GEdge) => {
// @ts-ignore
    const size = sizeMap.value.get(edge.id);
// @ts-ignore
    if (!size) return;
// @ts-ignore
    return SIZE_TO_WIDTH[size];
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const size = () => {
// @ts-ignore
    setTheme('nodeSize', sizeNode);
// @ts-ignore
    setTheme('edgeWidth', sizeEdge);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const desize = () => {
// @ts-ignore
    removeAllThemes();
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    size,
// @ts-ignore
    desize,
// @ts-ignore
    sizeMap
// @ts-ignore
  };
// @ts-ignore
};

// @ts-ignore
export type AdjacencyMap = Map<number, number[]>;

// @ts-ignore
export type Parent = Map<string, string>

// @ts-ignore
export type MSTSimulationControls = SimulationControls<GEdge[]>;
// @ts-ignore
export const MST_ALGORITHMS = ["kruskal", "prim"] as const;
// @ts-ignore
export type MSTAlgorithm = typeof MST_ALGORITHMS[number];
// @ts-ignore

// @ts-ignore
export const useMSTSimulation = (
// @ts-ignore
  graph: Graph,
// @ts-ignore
  currentAlgorithm: Ref<MSTAlgorithm>
// @ts-ignore
): MSTSimulationControls => {
// @ts-ignore

// @ts-ignore
  const kruskalTrace = useKruskal(graph);
// @ts-ignore
  const primsTrace = usePrim(graph);
// @ts-ignore

// @ts-ignore
  const trace = computed(() => {
// @ts-ignore
    if (currentAlgorithm.value === "prim") return primsTrace.value;
// @ts-ignore
    else return kruskalTrace.value;
// @ts-ignore
  });
// @ts-ignore

// @ts-ignore
  const step = ref(0);
// @ts-ignore
  const paused = ref(true);
// @ts-ignore
  const playbackSpeed = ref(1_500);
// @ts-ignore
  const active = ref(false);
// @ts-ignore
  const interval = ref<NodeJS.Timeout | undefined>();
// @ts-ignore

// @ts-ignore
  const hasBegun = computed(() => step.value > 0);
// @ts-ignore
  const isOver = computed(() => step.value === trace.value.length + 1);
// @ts-ignore

// @ts-ignore
  const traceAtStep = computed(() => trace.value.slice(0, step.value));
// @ts-ignore

// @ts-ignore
  const { colorize, decolorize } = useMSTColorizer(graph, traceAtStep);
// @ts-ignore

// @ts-ignore
  const start = () => {
// @ts-ignore
    paused.value = false;
// @ts-ignore
    active.value = true;
// @ts-ignore
    step.value = 0;
// @ts-ignore
    colorize();
// @ts-ignore
    interval.value = setInterval(() => {
// @ts-ignore
      if (isOver.value || paused.value) return;
// @ts-ignore
      nextStep();
// @ts-ignore
    }, playbackSpeed.value);
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const stop = () => {
// @ts-ignore
    if (interval.value) clearInterval(interval.value);
// @ts-ignore
    active.value = false;
// @ts-ignore
    decolorize();
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const nextStep = () => {
// @ts-ignore
    if (isOver.value) return;
// @ts-ignore
    step.value++;
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const prevStep = () => {
// @ts-ignore
    if (!hasBegun.value) return;
// @ts-ignore
    step.value--;
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const setStep = (newStep: number) => {
// @ts-ignore
    if (newStep < -1 || newStep > trace.value.length) return;
// @ts-ignore
    step.value = newStep;
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    nextStep,
// @ts-ignore
    prevStep,
// @ts-ignore
    setStep,
// @ts-ignore

// @ts-ignore
    trace: computed(() => trace.value),
// @ts-ignore
    step: computed(() => step.value),
// @ts-ignore

// @ts-ignore
    start,
// @ts-ignore
    stop,
// @ts-ignore
    paused,
// @ts-ignore
    playbackSpeed,
// @ts-ignore

// @ts-ignore
    isOver,
// @ts-ignore
    hasBegun,
// @ts-ignore
    isActive: computed(() => active.value),
// @ts-ignore
    // progress: computed(() => `${step.value} / ${trace.value.length}`),
// @ts-ignore
  };
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export type FlowTrace = Record<GEdge['id'], number>[]

// @ts-ignore
export type EdgeThickenerControls = ReturnType<typeof useEdgeThickener>;

// @ts-ignore
export type FlowProperties = ReturnType<typeof useFlowProperties>;

// @ts-ignore
export type FlowSimulationControls = SimulationControls<FlowTrace>

// @ts-ignore
export type SourceSinkControls = ReturnType<typeof useSourceSinkControls>;

// @ts-ignore
export type AlgoName = keyof typeof algos

// @ts-ignore
export type Trace = string[]

// @ts-ignore
export type BFSLevelRecord = Record<GNode['id'], number>;

// @ts-ignore
export type Arrow = Line

// @ts-ignore
export type Circle = {
// @ts-ignore
  at: Coordinate,
// @ts-ignore
  radius: number,
// @ts-ignore
  color?: string,
// @ts-ignore
  stroke?: Stroke,
// @ts-ignore
  textArea?: TextAreaNoLocation,
}

// @ts-ignore
export type Cross = {
// @ts-ignore
  at: Coordinate
// @ts-ignore
  size: number
// @ts-ignore
  rotation?: number
// @ts-ignore
  color?: string
// @ts-ignore
  lineWidth?: number
// @ts-ignore
  borderRadius?: number
}

// @ts-ignore
export type Line = {
// @ts-ignore
  start: Coordinate,
// @ts-ignore
  end: Coordinate,
// @ts-ignore
  width?: number,
// @ts-ignore
  textArea?: TextAreaNoLocation,
// @ts-ignore
  /**
// @ts-ignore
   * offsetFromCenter is used to position text. By default, text is centered on the line.
// @ts-ignore
   * If -10, text will be on the line but 10 units below the center.
// @ts-ignore
   * If 10, text will be on the line but 10 units above the center.
// @ts-ignore
   */
// @ts-ignore
  textOffsetFromCenter?: number,
// @ts-ignore
  color?: string,
}

// @ts-ignore
export type Rect = {
// @ts-ignore
  at: Coordinate
// @ts-ignore
  width: number
// @ts-ignore
  height: number
// @ts-ignore
  color?: string
// @ts-ignore
  stroke?: Stroke
// @ts-ignore
  textArea?: TextAreaNoLocation
// @ts-ignore
  borderRadius?: number
// @ts-ignore
  rotation?: number
}

// @ts-ignore
export type Square = {
// @ts-ignore
  at: Coordinate
// @ts-ignore
  size: number
// @ts-ignore
  color?: string
// @ts-ignore
  stroke?: Stroke
// @ts-ignore
  textArea?: TextAreaNoLocation
// @ts-ignore
  borderRadius?: number
// @ts-ignore
  rotation?: number
}

// @ts-ignore
export type Triangle = {
// @ts-ignore
  point1: Coordinate,
// @ts-ignore
  point2: Coordinate,
// @ts-ignore
  point3: Coordinate,
// @ts-ignore
  color?: string,
}

// @ts-ignore
export type BoundingBox = Pick<Rect, 'at' | 'width' | 'height'>

// @ts-ignore
export type ShapeName = 'circle' | 'line' | 'square' | 'rect' | 'triangle' | 'arrow' | 'uturn' | 'cross'

// @ts-ignore
export type Coordinate = {
// @ts-ignore
  x: number,
// @ts-ignore
  y: number,
}

// @ts-ignore
export type TextAreaNoLocation = {
// @ts-ignore
  /**
// @ts-ignore
   * the text areas inner text
// @ts-ignore
   */
// @ts-ignore
  text: Text,
// @ts-ignore
  /**
// @ts-ignore
   * the color of the text area
// @ts-ignore
   */
// @ts-ignore
  color?: string,
// @ts-ignore
  /**
// @ts-ignore
   * the color of the text area when it is engaged
// @ts-ignore
   * IE is converted to a textarea html element for user interaction
// @ts-ignore
   */
// @ts-ignore
  activeColor?: string,
}

// @ts-ignore
export type TextArea = {
// @ts-ignore
  at: Coordinate,
// @ts-ignore
} & TextAreaNoLocation
// @ts-ignore

// @ts-ignore
export type TextFontWeight = 'lighter' | 'normal' | 'bold' | 'bolder'
// @ts-ignore

// @ts-ignore
// the text displayed in the text area
// @ts-ignore
export type Text = {
// @ts-ignore
  content: string,
// @ts-ignore
  fontSize?: number,
// @ts-ignore
  fontWeight?: TextFontWeight,
// @ts-ignore
  color?: string,
}

// @ts-ignore
export type Stroke = {
// @ts-ignore
  color: string,
// @ts-ignore
  width: number,
// @ts-ignore
    /**
// @ts-ignore
   * For dashed border
// @ts-ignore
   * 
// @ts-ignore
   * @params
// @ts-ignore
   *
// @ts-ignore
   * dash: [dashLength, gapLength]
// @ts-ignore
   * 
// @ts-ignore
  */
// @ts-ignore
    dash?: [number, number]
}

// @ts-ignore
export type UTurn = {
// @ts-ignore
  spacing: number,
// @ts-ignore
  at: Coordinate,
// @ts-ignore
  upDistance: number,
// @ts-ignore
  downDistance: number,
// @ts-ignore
  rotation: number,
// @ts-ignore
  lineWidth: number,
// @ts-ignore
  color?: string,
// @ts-ignore
  textArea?: TextAreaNoLocation
}

// @ts-ignore
export type MainPageInfo = {
// @ts-ignore
  /**
// @ts-ignore
   * the name of the menu item
// @ts-ignore
   */
// @ts-ignore
  name: string,
// @ts-ignore
  /**
// @ts-ignore
   *
// @ts-ignore
   */
// @ts-ignore
  description: string,
// @ts-ignore
  /**
// @ts-ignore
   * an image to display in the menu
// @ts-ignore
   */
// @ts-ignore
  thumbnail: string,
}

// @ts-ignore
export type SimulationDeclaration = {
// @ts-ignore
  /**
// @ts-ignore
   * the name of the simulation, user facing
// @ts-ignore
   */
// @ts-ignore
  name: string,
// @ts-ignore
  /**
// @ts-ignore
   * the description of the simulation, user facing
// @ts-ignore
   */
// @ts-ignore
  description: string,
// @ts-ignore
  /**
// @ts-ignore
   * an image to display in the simulation selection
// @ts-ignore
   */
// @ts-ignore
  thumbnail: string,
// @ts-ignore
  /**
// @ts-ignore
   * a predicate to determine if the simulation can run on the given graph.
// @ts-ignore
   * returning a string indicates that the simulation cannot run and the string, user facing,
// @ts-ignore
   * is the reason why it cannot. returning true indicates that the simulation can run.
// @ts-ignore
   */
// @ts-ignore
  canRun?: () => true | string,
// @ts-ignore
  /**
// @ts-ignore
   * the controls for the simulation returned by your products useSimulation instance
// @ts-ignore
   */
// @ts-ignore
  controls: SimulationControls,
// @ts-ignore
  /**
// @ts-ignore
   * runs when the simulation is opened or started by the user.
// @ts-ignore
   * use this to prepare the simulation experience by activating colorizers, prompting
// @ts-ignore
   * user for starting nodes, etc.
// @ts-ignore
   */
// @ts-ignore
  onInit?: () => Promise<void> | void,
// @ts-ignore
  /**
// @ts-ignore
   * runs when the simulation is closed or stopped by the user.
// @ts-ignore
   * use this to deactivate colorizers or other visual effects that were activated
// @ts-ignore
   * in `onInit` or during the runtime of the simulation.
// @ts-ignore
   */
// @ts-ignore
  onDismiss?: () => Promise<void> | void,
}

// @ts-ignore
export type SimulationDeclarationGetter = (graph: Graph) => SimulationDeclaration[]

// @ts-ignore
export type ProductInfo = {
// @ts-ignore
  /**
// @ts-ignore
   * consumed by vue-router in order to add it as an available route
// @ts-ignore
   */
// @ts-ignore
  route: RouteRecordRaw,
// @ts-ignore
  /**
// @ts-ignore
   * the name of the product.
// @ts-ignore
   * used as document title
// @ts-ignore
   */
// @ts-ignore
  name: string,
// @ts-ignore
  /**
// @ts-ignore
   * the description of the product
// @ts-ignore
   */
// @ts-ignore
  description: string,
// @ts-ignore
  /**
// @ts-ignore
   * a unique identifier for the product, cannot contain spaces or special characters
// @ts-ignore
   */
// @ts-ignore
  productId: string,
// @ts-ignore
  /**
// @ts-ignore
   * if defined, the product will be added to the main menu
// @ts-ignore
   * with the properties defined here
// @ts-ignore
   */
// @ts-ignore
  menu?: MainPageInfo,
// @ts-ignore
  /**
// @ts-ignore
   * if defined, this products simulations will be exposed to other products
// @ts-ignore
   */
// @ts-ignore
  simulations?: SimulationDeclarationGetter,
}

// @ts-ignore
export type SimulationControls<T extends any[] = any[]> = {
// @ts-ignore
  /**
// @ts-ignore
   * skip forward to the next step.
// @ts-ignore
   * wont do anything if the current step is trace.length
// @ts-ignore
   */
// @ts-ignore
  nextStep: () => void
// @ts-ignore
  /**
// @ts-ignore
   * skip backward to the previous step.
// @ts-ignore
   * wont do anything if the current step is -1
// @ts-ignore
   */
// @ts-ignore
  prevStep: () => void
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * the current trace of the algorithm for which the simulation is being run.
// @ts-ignore
   */
// @ts-ignore
  trace: ComputedRef<T>
// @ts-ignore
  /**
// @ts-ignore
   * the current step of the simulation.
// @ts-ignore
   * ranges from -1 to trace.length where -1 is the state before the algorithm has begun
// @ts-ignore
   * and trace.length is the state after the algorithm has completed.
// @ts-ignore
   */
// @ts-ignore
  step: ComputedRef<number>
// @ts-ignore
  /**
// @ts-ignore
   * set the current step of the simulation
// @ts-ignore
   * @param step the step to set the simulation to
// @ts-ignore
   * @throws if step is not within the bounds of the trace (-1 to trace.length)
// @ts-ignore
   */
// @ts-ignore
  setStep: (step: number) => void
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * start the simulation. this will begin the simulation from step -1
// @ts-ignore
   */
// @ts-ignore
  start: () => void
// @ts-ignore
  /**
// @ts-ignore
   * stop the simulation. this will end the simulation and reset all state
// @ts-ignore
   */
// @ts-ignore
  stop: () => void
// @ts-ignore
  /**
// @ts-ignore
   * pause the simulation. keeps the playback interval running but stops the step from incrementing
// @ts-ignore
   */
// @ts-ignore
  paused: Ref<boolean>
// @ts-ignore
  /**
// @ts-ignore
   * time, in milliseconds, between each step firing.
// @ts-ignore
   */
// @ts-ignore
  playbackSpeed: Ref<number>
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * whether the simulation is currently active.
// @ts-ignore
   * changes to true when start is called and false when stop is called
// @ts-ignore
   */
// @ts-ignore
  isActive: ComputedRef<boolean>
// @ts-ignore
  /**
// @ts-ignore
   * whether the simulation is over.
// @ts-ignore
   * true when the step is trace.length
// @ts-ignore
   */
// @ts-ignore
  isOver: ComputedRef<boolean>
// @ts-ignore
  /**
// @ts-ignore
   * whether the simulation has begun.
// @ts-ignore
   * true when the step is greater than -1
// @ts-ignore
   */
// @ts-ignore
  hasBegun: ComputedRef<boolean>
}

// @ts-ignore
type ProgressThemeOptions = {
// @ts-ignore
  backgroundColor: string;
// @ts-ignore
  progressColor: string;
// @ts-ignore
  easeTime: number;
// @ts-ignore
  borderRadius: number;
// @ts-ignore
  progressEasing: "linear" | "ease-in-out";
}

// @ts-ignore
export type ProgressOptions = {
// @ts-ignore
  theme?: Partial<ProgressThemeOptions>;
// @ts-ignore
  startProgress: number;
// @ts-ignore
  currentProgress: number;
// @ts-ignore
  endProgress: number;
// @ts-ignore
  setProgress: (progress: number) => void
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export const PROGRESS_DEFAULTS = {
// @ts-ignore
  backgroundColor: "white",
// @ts-ignore
  progressColor: "green",
// @ts-ignore
  easeTime: 250,
// @ts-ignore
  progressEasing: "ease-in-out",
// @ts-ignore
  borderRadius: 0,
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export type Color = string;

// @ts-ignore
export type DeepPartial<T> = {
// @ts-ignore
  [K in keyof T]?: K extends Record<any, any>
// @ts-ignore
  ? DeepPartial<T[K]>
// @ts-ignore
  : T[K];
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * make every key in an object required including nested objects
// @ts-ignore
 */
// @ts-ignore
export type DeepRequired<T> = {
// @ts-ignore
  [K in keyof T]-?: T[K] extends Record<any, any>
// @ts-ignore
  ? DeepRequired<T[K]>
// @ts-ignore
  : T[K];
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * makes only certain keys K in an object T optional
// @ts-ignore
 */
// @ts-ignore
export type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * helper types for nested keys
// @ts-ignore
 */
// @ts-ignore
type AcceptableKeys = string | number | symbol
// @ts-ignore
type AcceptableObject = Record<AcceptableKeys, any>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * get a clean union of all paths in an object
// @ts-ignore
 */
// @ts-ignore
export type NestedKeys<T extends AcceptableObject> = T extends AcceptableObject ? {
// @ts-ignore
  [K in keyof T]: K | (
// @ts-ignore
    Extract<T[K], AcceptableObject> extends AcceptableObject
// @ts-ignore
    ? K extends string
// @ts-ignore
    // @ts-ignore this works
// @ts-ignore
    ? `${K}.${NestedKeys<Required<T[K]>>}` : never : never
// @ts-ignore
  )
// @ts-ignore
}[keyof T] : never
// @ts-ignore

// @ts-ignore
type OnlyObj<T> = Extract<T, object>
// @ts-ignore

// @ts-ignore
type OnlyObjNested<T> = {
// @ts-ignore
  [K in keyof T]: OnlyObj<T[K]> extends never ? T[K] : OnlyObj<T[K]>
}

// @ts-ignore
type ExecuteDeepValue<T, Path extends string> =
// @ts-ignore
  Path extends `${infer Key}.${infer Rest}`
// @ts-ignore
  ? Key extends keyof T
// @ts-ignore
  ? ExecuteDeepValue<T[Key], Rest>
// @ts-ignore
  : never
// @ts-ignore
  : Path extends keyof T
// @ts-ignore
  ? T[Path]
// @ts-ignore
  : never;
// @ts-ignore

// @ts-ignore
export type DeepValue<T, Path extends string> = ExecuteDeepValue<OnlyObjNested<T>, Path>