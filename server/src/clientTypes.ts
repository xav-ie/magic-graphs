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
export type EditEdgeLabelOptions = BroadcastOption & HistoryOption

// @ts-ignore
export type GraphAtMousePosition = {
// @ts-ignore
  /**
// @ts-ignore
   * coordinates translated to the graph's coordinate system
// @ts-ignore
   */
// @ts-ignore
  coords: Coordinate,
// @ts-ignore
  /**
// @ts-ignore
   * the schema items at the coordinates of the mouse
// @ts-ignore
   */
// @ts-ignore
  items: SchemaItem[],
}

// @ts-ignore
export type GraphMouseEvent = DeepReadonly<GraphAtMousePosition> & {
// @ts-ignore
  /**
// @ts-ignore
   * the native browser event that triggered this graph event
// @ts-ignore
   */
// @ts-ignore
  event: MouseEvent,
}

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
export type Cursor =
// @ts-ignore
  | "auto"
// @ts-ignore
  | "default"
// @ts-ignore
  | "none"
// @ts-ignore
  | "context-menu"
// @ts-ignore
  | "help"
// @ts-ignore
  | "pointer"
// @ts-ignore
  | "progress"
// @ts-ignore
  | "wait"
// @ts-ignore
  | "cell"
// @ts-ignore
  | "crosshair"
// @ts-ignore
  | "text"
// @ts-ignore
  | "vertical-text"
// @ts-ignore
  | "alias"
// @ts-ignore
  | "copy"
// @ts-ignore
  | "move"
// @ts-ignore
  | "no-drop"
// @ts-ignore
  | "not-allowed"
// @ts-ignore
  | "grab"
// @ts-ignore
  | "grabbing"
// @ts-ignore
  | "e-resize"
// @ts-ignore
  | "n-resize"
// @ts-ignore
  | "ne-resize"
// @ts-ignore
  | "nw-resize"
// @ts-ignore
  | "s-resize"
// @ts-ignore
  | "se-resize"
// @ts-ignore
  | "sw-resize"
// @ts-ignore
  | "w-resize"
// @ts-ignore
  | "ew-resize"
// @ts-ignore
  | "ns-resize"
// @ts-ignore
  | "nesw-resize"
// @ts-ignore
  | "nwse-resize"
// @ts-ignore
  | "col-resize"
// @ts-ignore
  | "row-resize"
// @ts-ignore
  | "all-scroll"
// @ts-ignore
  | "zoom-in"
// @ts-ignore
  | "zoom-out"
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * manages the cursor type when hovering over the graph
// @ts-ignore
 *
// @ts-ignore
 * @param subscribe - the event subscriber
// @ts-ignore
 * @param canvas - the canvas element
// @ts-ignore
 * @param graphAtMousePosition - the graph items at the mouse position
// @ts-ignore
 * @returns the cursor manager
// @ts-ignore
 */
// @ts-ignore
export const useGraphCursor = ({
// @ts-ignore
  subscribe,
// @ts-ignore
  canvas,
// @ts-ignore
  graphAtMousePosition,
// @ts-ignore
}: {
// @ts-ignore
  subscribe: Subscriber;
// @ts-ignore
  canvas: Ref<HTMLCanvasElement | null | undefined>;
// @ts-ignore
  graphAtMousePosition: Ref<GraphAtMousePosition>;
// @ts-ignore
}) => {
// @ts-ignore
  const isMouseDown = ref(false)
// @ts-ignore
  const graphCursorDisabled = ref(false)
// @ts-ignore

// @ts-ignore
  const graphToCursorMap = ref<Partial<Record<SchemaItem['graphType'], Cursor>>>({
// @ts-ignore
    'node': 'grab',
// @ts-ignore
    'edge': 'pointer',
// @ts-ignore
    'node-anchor': 'grab',
// @ts-ignore
    'encapsulated-node-box': 'move',
// @ts-ignore
  })
// @ts-ignore

// @ts-ignore
  const isItemSelectable = ref<(item: SchemaItem) => boolean>()
// @ts-ignore
  const inSelectMode = computed(() => !!isItemSelectable.value)
// @ts-ignore

// @ts-ignore
  const activateCursorSelectMode = (predicate: (item: SchemaItem) => boolean) => {
// @ts-ignore
    isItemSelectable.value = predicate
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const deactivateCursorSelectMode = () => {
// @ts-ignore
    isItemSelectable.value = undefined
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const getCursorType = (item: SchemaItem | undefined) => {
// @ts-ignore
    if (!item) return 'default'
// @ts-ignore

// @ts-ignore
    if (inSelectMode.value) {
// @ts-ignore
      const isSelectable = isItemSelectable.value?.(item) ?? false
// @ts-ignore
      return isSelectable ? 'pointer' : 'default'
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    const cursor = graphToCursorMap.value[item.graphType] ?? 'default'
// @ts-ignore
    if (cursor === 'grab' && isMouseDown.value) return 'grabbing'
// @ts-ignore

// @ts-ignore
    return cursor
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const changeCursorType = ({ items }: Pick<GraphMouseEvent, 'items'>) => {
// @ts-ignore
    if (!canvas.value || graphCursorDisabled.value) return
// @ts-ignore
    const topItem = items.at(-1)
// @ts-ignore
    canvas.value.style.cursor = getCursorType(topItem)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  subscribe('onMouseDown', (ev) => {
// @ts-ignore
    isMouseDown.value = true
// @ts-ignore
    changeCursorType(ev)
// @ts-ignore
  })
// @ts-ignore

// @ts-ignore
  subscribe('onMouseUp', (ev) => {
// @ts-ignore
    isMouseDown.value = false
// @ts-ignore
    changeCursorType(ev)
// @ts-ignore
  })
// @ts-ignore

// @ts-ignore
  subscribe('onMouseMove', changeCursorType)
// @ts-ignore

// @ts-ignore
  watch(graphToCursorMap, () => {
// @ts-ignore
    changeCursorType({
// @ts-ignore
      items: graphAtMousePosition.value.items
// @ts-ignore
    })
// @ts-ignore
  }, { deep: true })
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    /**
// @ts-ignore
     * maps graph schema item types to browser cursor.
// @ts-ignore
     * changing this mapping will change the cursor type when hovering over the graph.
// @ts-ignore
     */
// @ts-ignore
    graphToCursorMap,
// @ts-ignore
    /**
// @ts-ignore
     * activates a cursor select mode, where only the schema items that pass the
// @ts-ignore
     * `predicate` will receive a pointer cursor.
// @ts-ignore
     * everything else will receive the default cursor as long as this mode is active.
// @ts-ignore
     * @param predicate - a predicate that determines, given a schema item, whether it is selectable.
// @ts-ignore
     * @example activateCursorSelectMode((item) => item.graphType === 'node')
// @ts-ignore
     * // in select mode
// @ts-ignore
     * // only nodes will receive a pointer cursor
// @ts-ignore
     */
// @ts-ignore
    activateCursorSelectMode,
// @ts-ignore
    /**
// @ts-ignore
     * deactivates the cursor select mode. to be called after `activateCursorSelectMode`.
// @ts-ignore
     * @example activateCursorSelectMode((item) => item.graphType === 'node')
// @ts-ignore
     * // in select mode
// @ts-ignore
     * deactivateCursorSelectMode()
// @ts-ignore
     * // no longer in select mode
// @ts-ignore
     */
// @ts-ignore
    deactivateCursorSelectMode,
// @ts-ignore
    /**
// @ts-ignore
     * when the graph cursor is disabled, the cursor will always be the default cursor.
// @ts-ignore
     */
// @ts-ignore
    graphCursorDisabled,
// @ts-ignore
  }
// @ts-ignore
};

// @ts-ignore
export type UseNodeEdgeMap = typeof useNodeEdgeMap
// @ts-ignore
export type NodeMap = ReturnType<UseNodeEdgeMap>['nodeIdToNodeMap']
// @ts-ignore
export type EdgeMap = ReturnType<UseNodeEdgeMap>['edgeIdToEdgeMap']

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
export type GraphPlaygroundButton = {
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
type ConnectOptions = {
// @ts-ignore
  /**
// @ts-ignore
   * graph instance for the collab system to write new nodes/edges to when received
// @ts-ignore
   * and to read from when sending new nodes/edges to other collaborators
// @ts-ignore
   */
// @ts-ignore
  graph: Graph,
// @ts-ignore
  /**
// @ts-ignore
   * room id to connect to
// @ts-ignore
   */
// @ts-ignore
  roomId: string,
// @ts-ignore
  /**
// @ts-ignore
   * product id that the graph belongs to
// @ts-ignore
   */
// @ts-ignore
  productId: ProductInfo['productId']
}

// @ts-ignore
type SocketListenOptions = {
// @ts-ignore
  graph: Graph,
// @ts-ignore
  collaborators: Ref<CollaboratorMap>
}

// @ts-ignore
export type CollaboratorProfile = {
// @ts-ignore
  /**
// @ts-ignore
   * the display name of the collaborator
// @ts-ignore
   */
// @ts-ignore
  name: string
// @ts-ignore
  /**
// @ts-ignore
   * the display color of the collaborator
// @ts-ignore
   */
// @ts-ignore
  color: string
}

// @ts-ignore
export type Collaborator = {
// @ts-ignore
  /**
// @ts-ignore
   * unique id for the collaborator, tied to their socket id
// @ts-ignore
   */
// @ts-ignore
  id: string
// @ts-ignore
  /**
// @ts-ignore
   * the current mouse coordinates of the collaborator on the canvas
// @ts-ignore
   */
// @ts-ignore
  mousePosition: { x: number, y: number }
// @ts-ignore
  /**
// @ts-ignore
   * the id of the product that the collaborator is currently active on
// @ts-ignore
   */
// @ts-ignore
  productId: ProductInfo['productId']
// @ts-ignore
} & CollaboratorProfile
// @ts-ignore

// @ts-ignore
export type CollaboratorMove = {
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
export type GraphSocketEvents = {
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
}

// @ts-ignore
export type CollabSocketEvents = {
// @ts-ignore
  collaboratorJoined: (collaborator: Collaborator) => void
// @ts-ignore
  collaboratorLeft: (collaboratorId: Collaborator['id']) => void
// @ts-ignore
  collaboratorMoved: (collaboratorMove: CollaboratorMove) => void
}

// @ts-ignore
export type ConnectionSocketEvents = {
// @ts-ignore
  joinRoom: (
// @ts-ignore
    joinOptions: {
// @ts-ignore
      roomId: string,
// @ts-ignore
      me: Collaborator,
// @ts-ignore
      graphState: GraphState
// @ts-ignore
    },
// @ts-ignore
    mapCallback: (collabMap: CollaboratorMap, graphState: GraphState) => void
// @ts-ignore
  ) => void
// @ts-ignore

// @ts-ignore
  leaveRoom: (confirmationCallback: () => void) => void
}

// @ts-ignore
export type SocketEvents = GraphSocketEvents & CollabSocketEvents & ConnectionSocketEvents

// @ts-ignore
export type GraphSocket = Socket<SocketEvents, SocketEvents>

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
    onEdgeLabelEdited: new Set(),
// @ts-ignore

// @ts-ignore
    onRepaint: new Set(),
// @ts-ignore
    onNodeHoverChange: new Set(),
// @ts-ignore

// @ts-ignore
    onGraphLoaded: new Set(),
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
   * when one of the following occurs:
// @ts-ignore
   * - a node is {@link Graph.addNode | added} or {@link Graph.removeNode | removed}
// @ts-ignore
   * - an edge is {@link Graph.addEdge | added} or {@link Graph.removeEdge | removed}
// @ts-ignore
   * - an edge label is {@link Graph.editEdgeLabel | edited}
// @ts-ignore
   * - the {@link Graph.load | graph load} api is invoked with new nodes and edges
// @ts-ignore
   * - the {@link Graph.reset | graph reset} api is invoked clearing all nodes and edges
// @ts-ignore
   */
// @ts-ignore
  onStructureChange: () => void;
// @ts-ignore
  /**
// @ts-ignore
   * when a node is {@link Graph.addNode | added} to the graph
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
   * when a node is {@link Graph.removeNode | removed} from the graph
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
   * when a node is {@link Graph.moveNode | moved} to a new position on the canvas
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
   * when an edge is {@link Graph.addEdge | added} to the graph
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
   * when an edge is {@link Graph.removeEdge | removed} from the graph
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
   * when an edge's text label is {@link Graph.editEdgeLabel | edited}
// @ts-ignore
   */
// @ts-ignore
  onEdgeLabelEdited: (edge: GEdge, oldLabel: GEdge['label'], options: EditEdgeLabelOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the canvas is repainted
// @ts-ignore
   *
// @ts-ignore
   * **WARNING** items drawn to the canvas using ctx won't be tied to graphs internal state.
// @ts-ignore
   * see {@link Graph.updateAggregator | `updateAggregator`} if you need drawn item to integrate with graph APIs
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
   * when the graph is {@link Graph.load | loaded} with new nodes and edges.
// @ts-ignore
   */
// @ts-ignore
  onGraphLoaded: () => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the graph has {@link Graph.reset | reset} and all nodes and edges have been removed
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
  onClick: (ev: GraphMouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user clicks the mouse button on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onMouseDown: (ev: GraphMouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user releases the mouse button on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onMouseUp: (ev: GraphMouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user moves the mouse on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onMouseMove: (ev: GraphMouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the canvas is double clicked on (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onDblClick: (ev: GraphMouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the canvas is right clicked on (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onContextMenu: (ev: GraphMouseEvent) => void;
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
   * when the {@link Graph.themeName | theme} of the graph has changed
// @ts-ignore
   */
// @ts-ignore
  onThemeChange: (newTheme: GraphThemeName, oldTheme: GraphThemeName) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the {@link Graph.settings | settings} of the graph have changed
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
export type AnnotationGraphEventMap = {}

// @ts-ignore
export type GraphEventMap = (
// @ts-ignore
  BaseGraphEventMap &
// @ts-ignore
  HistoryGraphEventMap &
// @ts-ignore
  FocusGraphEventMap &
// @ts-ignore
  DraggableGraphEventMap &
// @ts-ignore
  NodeAnchorGraphEventMap &
// @ts-ignore
  MarqueeGraphEventMap &
// @ts-ignore
  PersistentGraphEventMap
// @ts-ignore
)

// @ts-ignore
export type LabelledItem = { label: string };

// @ts-ignore
export type NodeAnchorControls = ReturnType<typeof useNodeAnchors>

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
type AnnotationHistoryRecord = {
// @ts-ignore
  action: 'add' | 'remove',
// @ts-ignore
  annotations: Annotation[]
}

// @ts-ignore
export type GraphAnnotationControls = ReturnType<typeof useAnnotations>

// @ts-ignore
export type Annotation = Scribble & { id: string }

// @ts-ignore
export type GraphNodeDragControls = ReturnType<typeof useNodeDrag>

// @ts-ignore
export type ActiveDragNode = {
// @ts-ignore
  node: GNode,
// @ts-ignore
  coords: Coordinate,
}

// @ts-ignore
export type GraphFocusControls = ReturnType<typeof useFocus>

// @ts-ignore
export type GraphHistoryControls = ReturnType<typeof useHistory>;

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
export type GEdgeLabelEditRecord = {
// @ts-ignore
  graphType: 'edge',
// @ts-ignore
  data: {
// @ts-ignore
    id: GEdge['id'],
// @ts-ignore
    from: GEdge['label'],
// @ts-ignore
    to: GEdge['label']
// @ts-ignore
  }
}

// @ts-ignore
export type GNodeRecord = {
// @ts-ignore
  graphType: 'node',
// @ts-ignore
  data: GNode
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
export type EditRecord = {
// @ts-ignore
  /**
// @ts-ignore
   * the action that was taken in order to create this record.
// @ts-ignore
   */
// @ts-ignore
  action: 'edit',
// @ts-ignore
  /**
// @ts-ignore
   * the items that were affected by the action.
// @ts-ignore
   */
// @ts-ignore
  affectedItems: GEdgeLabelEditRecord[];
}

// @ts-ignore
export type HistoryRecord = AddRemoveRecord | MoveRecord | EditRecord;

// @ts-ignore
export type RedoHistoryOptions = FocusOption;

// @ts-ignore
export type GraphMarqueeControls = ReturnType<typeof useMarquee>

// @ts-ignore
export type GraphPersistentControls = ReturnType<typeof usePersistent>;

// @ts-ignore
type PropsNeededFromGraph = 'edges' | 'getNode' | 'getEdge' | 'getTheme' | 'settings'

// @ts-ignore
export type SupportedNodeShapes = 'circle' | 'square'

// @ts-ignore
export type SelectFromGraphOptions = {
// @ts-ignore
  /**
// @ts-ignore
   * only items that satisfy this predicate will be selectable.
// @ts-ignore
   * if left undefined, all items in the graph will be selectable
// @ts-ignore
   * @default () => true
// @ts-ignore
   */
// @ts-ignore
  predicate: (item: SchemaItem) => boolean;
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * default predicate for `selectFromGraph`
// @ts-ignore
 */
// @ts-ignore
const DEFAULT_PREDICATE = () => true;
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * waits for the user to click on an item in the graph and resolves to the selected item
// @ts-ignore
 * or undefined if the cancel handler is invoked
// @ts-ignore
 *
// @ts-ignore
 * @param graph the graph to select from
// @ts-ignore
 * @param options options for the selection process
// @ts-ignore
 * @returns a promise that resolves to the selected item or undefined if the selection was cancelled
// @ts-ignore
 * @example const { selectedItemPromise, cancelSelection } = selectFromGraph(graph);
// @ts-ignore
 * const selectedItem = await selectedItemPromise;
// @ts-ignore
 * if (!selectedItem) return; // selection was cancelled
// @ts-ignore
 * // selection resolved. do something with the selected item
// @ts-ignore
 */
// @ts-ignore
export const selectFromGraph = (graph: Graph, {
// @ts-ignore
  predicate = DEFAULT_PREDICATE,
// @ts-ignore
}: Partial<SelectFromGraphOptions> = {}) => {
// @ts-ignore
  let resolver: (value: SchemaItem | PromiseLike<SchemaItem> | undefined) => void;
// @ts-ignore

// @ts-ignore
  const selectedItemPromise = new Promise<SchemaItem | undefined>((res) => resolver = res);
// @ts-ignore

// @ts-ignore
  const onClick = ({ items }: GraphMouseEvent) => {
// @ts-ignore
    const topItem = items.at(-1);
// @ts-ignore
    if (!topItem || !predicate(topItem)) return;
// @ts-ignore
    resolve(topItem);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const initialInteractive = graph.settings.value.interactive;
// @ts-ignore
  const initialFocusable = graph.settings.value.focusable;
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * initializes the selection process
// @ts-ignore
   */
// @ts-ignore
  const init = () => {
// @ts-ignore
    graph.subscribe('onClick', onClick);
// @ts-ignore
    graph.settings.value.interactive = false;
// @ts-ignore
    graph.settings.value.focusable = false;
// @ts-ignore
    const cursorPredicate = predicate === DEFAULT_PREDICATE ? ((item: SchemaItem) => !!item) : predicate;
// @ts-ignore
    graph.activateCursorSelectMode(cursorPredicate);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * cleans up the selection process
// @ts-ignore
   */
// @ts-ignore
  const cleanup = () => {
// @ts-ignore
    graph.unsubscribe('onClick', onClick);
// @ts-ignore
    graph.settings.value.interactive = initialInteractive;
// @ts-ignore
    graph.settings.value.focusable = initialFocusable;
// @ts-ignore
    graph.deactivateCursorSelectMode();
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * resolves the selection process and returns the selected item from the promise
// @ts-ignore
   */
// @ts-ignore
  const resolve = (item: SchemaItem) => {
// @ts-ignore
    cleanup();
// @ts-ignore
    resolver(item);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * cancels the selection process and returns undefined from the promise (public)
// @ts-ignore
   */
// @ts-ignore
  const cancelSelection = () => {
// @ts-ignore
    cleanup();
// @ts-ignore
    resolver(undefined);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  init();
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    /**
// @ts-ignore
     * resolves to the selected item or undefined if the
// @ts-ignore
     * selection was cancelled by calling the cancel handler
// @ts-ignore
     */
// @ts-ignore
    selectedItemPromise,
// @ts-ignore
    cancelSelection,
// @ts-ignore
  };
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export type SelectControls = ReturnType<typeof selectFromGraph>;

// @ts-ignore
export type BaseGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether to display {@link GEdge.label | edge labels}
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  displayEdgeLabels: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * whether {@link GEdge.label | edge labels} should be editable
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  edgeLabelsEditable: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * a setter for {@link GEdge.label | edge labels} - takes the user inputted string and returns a string that will
// @ts-ignore
   * be set as the edge label or returns undefined if the edge label should not be set
// @ts-ignore
   * @default (input) => {
// @ts-ignore
   * // tries converting the user input to a number
// @ts-ignore
   * }
// @ts-ignore
   */
// @ts-ignore
  edgeInputToLabel: (input: string) => string | undefined;
// @ts-ignore
  /**
// @ts-ignore
   * a function that returns the {@link GNode.label | label} for a node when a new node is created.
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
   * if false, no {@link SchemaItem | item} on the graph can be focused
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  focusable: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * a list of {@link SchemaItem.id | item ids} that cannot be focused
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
   * whether the nodes on the graph are draggable
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
   * whether node anchors are enabled, if true, anchors will spawn around nodes while hovered
// @ts-ignore
   * enabling edge creation
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
export type InteractiveGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether the user can create, edit and delete nodes and edges.
// @ts-ignore
   * when disabled, also disables graph settings: `nodeAnchors` and `edgeLabelsEditable`
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  interactive: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * the default {@link GEdge.label | label} assigned to edges when created using the UI
// @ts-ignore
   * @default '1'
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
   * whether the nodes and edges of the graph will be saved in {@link localStorage | local storage}
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  persistent: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * the key used for saving the graph in {@link localStorage | local storage}
// @ts-ignore
   * @default "graph"
// @ts-ignore
   */
// @ts-ignore
  persistentStorageKey: string,
// @ts-ignore
  /**
// @ts-ignore
   * set of node or edge ids that will not be saved through graph persistence
// @ts-ignore
   * @default new Set()
// @ts-ignore
   */
// @ts-ignore
  persistentBlacklist: Set<GNode['id'] | GEdge['id']>
}

// @ts-ignore
export type ShortcutGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether to enable keyboard shortcuts for the graph
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  shortcuts: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * BINDING: Mac: Meta+Z, Windows: Control+Z
// @ts-ignore
   *
// @ts-ignore
   * if false, the undo shortcut will be disabled, if set to a function,
// @ts-ignore
   * the function will be called when the undo shortcut is pressed
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  shortcutUndo: boolean | (() => void);
// @ts-ignore
  /**
// @ts-ignore
   * BINDING: Mac: Shift+Meta+Z, Windows: Shift+Control+Z
// @ts-ignore
   *
// @ts-ignore
   * if false, the redo shortcut will be disabled, if set to a function,
// @ts-ignore
   * the function will be called when the redo shortcut is pressed
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  shortcutRedo: boolean | (() => void);
// @ts-ignore
  /**
// @ts-ignore
   * BINDING: Mac: Meta+A, Windows: Control+A
// @ts-ignore
   *
// @ts-ignore
   * if false, the select all shortcut will be disabled, if set to a function,
// @ts-ignore
   * the function will be called when the select all shortcut is pressed
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  shortcutSelectAll: boolean | (() => void);
// @ts-ignore
  /**
// @ts-ignore
   * BINDING: Mac: Backspace, Windows: Backspace
// @ts-ignore
   *
// @ts-ignore
   * if false, the delete shortcut will be disabled, if set to a function,
// @ts-ignore
   * the function will be called when the delete shortcut is pressed
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  shortcutDelete: boolean | (() => void);
// @ts-ignore
  /**
// @ts-ignore
   * BINDING: Mac: Escape, Windows: Escape
// @ts-ignore
   *
// @ts-ignore
   * if false, the escape shortcut will be disabled, if set to a function,
// @ts-ignore
   * the function will be called when the escape shortcut is pressed
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  shortcutEscape: boolean | (() => void);
}

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
  InteractiveGraphSettings &
// @ts-ignore
  PersistentGraphSettings &
// @ts-ignore
  ShortcutGraphSettings
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
  ...DEFAULT_INTERACTIVE_SETTINGS,
// @ts-ignore
  ...DEFAULT_PERSISTENT_SETTINGS,
// @ts-ignore
  ...DEFAULT_SHORTCUT_SETTINGS,
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
  themeName: Ref<GraphThemeName>,
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
      return themeValue !== undefined
// @ts-ignore
    })
// @ts-ignore
    const getter = themeMapEntry?.value ?? THEMES[themeName.value][prop]
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
 * the function that gets a value from a theme inquiry
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
export type GraphThemeName = keyof typeof THEMES
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
  GraphThemeRaw,
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
export type AnnotationGraphTheme = {}

// @ts-ignore
export type GraphTheme = (
// @ts-ignore
  BaseGraphTheme &
// @ts-ignore
  HistoryGraphTheme &
// @ts-ignore
  FocusGraphTheme &
// @ts-ignore
  DraggableGraphTheme &
// @ts-ignore
  NodeAnchorGraphTheme &
// @ts-ignore
  MarqueeGraphTheme &
// @ts-ignore
  PersistentGraphTheme
// @ts-ignore
)
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * the raw theme object without any getters
// @ts-ignore
 */
// @ts-ignore
export type GraphThemeRaw = {
// @ts-ignore
  // nodeText and edgeText are special cases which must remain as getters
// @ts-ignore
  [K in keyof GraphTheme]: K extends 'nodeText' | 'edgeText' ? GraphTheme[K] : UnwrapMaybeGetter<GraphTheme[K]>
}

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
type GraphColors = {
// @ts-ignore
  primary: string
// @ts-ignore
  secondary: string
// @ts-ignore
  tertiary: string
// @ts-ignore
  contrast: string
// @ts-ignore
  text: string,
// @ts-ignore
  brand: string
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export const ThemeToGraphColors: Record<GraphThemeName, GraphColors> = {
// @ts-ignore
  light: {
// @ts-ignore
    primary: colors.GRAY_300,
// @ts-ignore
    secondary: colors.GRAY_200,
// @ts-ignore
    tertiary: colors.GRAY_400,
// @ts-ignore
    contrast: colors.GRAY_800,
// @ts-ignore
    text: colors.GRAY_900,
// @ts-ignore
    brand: 'magic'
// @ts-ignore
  },
// @ts-ignore
  dark: {
// @ts-ignore
    primary: colors.GRAY_800,
// @ts-ignore
    secondary: colors.GRAY_700,
// @ts-ignore
    tertiary: colors.GRAY_900,
// @ts-ignore
    contrast: colors.GRAY_200,
// @ts-ignore
    text: colors.GRAY_100,
// @ts-ignore
    brand: 'magic'
// @ts-ignore
  },
// @ts-ignore
  girl: {
// @ts-ignore
    primary: colors.PINK_700,
// @ts-ignore
    secondary: colors.PINK_600,
// @ts-ignore
    tertiary: colors.PINK_800,
// @ts-ignore
    contrast: colors.PINK_200,
// @ts-ignore
    text: colors.WHITE,
// @ts-ignore
    brand: 'girl-magic'
// @ts-ignore
  }
}

// @ts-ignore
export type PreferredGraphTheme = GraphThemeName | 'auto'

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
   * the text label that appears on the edge
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
export type EdgeGetterOrValue<T> = MaybeGetter<T, [GEdge]>

// @ts-ignore
type MarqueeGraphTypes = 'marquee-box' | 'encapsulated-node-box'
// @ts-ignore
type NodeAnchorGraphTypes = 'node-anchor' | 'link-preview'
// @ts-ignore
type AnnotationGraphTypes = 'annotation'
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * an item that can be fed into the `aggregator` in order to be rendered on the canvas
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
   * the type of graph data this schema item represents (node, edge, etc.)
// @ts-ignore
   */
// @ts-ignore
  graphType: BaseGraphTypes | NodeAnchorGraphTypes | MarqueeGraphTypes | AnnotationGraphTypes,
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
   * the {@link Shape | shape} instance that will be rendered on the canvas
// @ts-ignore
   */
// @ts-ignore
  shape: Shape,
}

// @ts-ignore
export type AdjacencyList = Record<string, string[]>;

// @ts-ignore
export type FullNodeAdjacencyList = Record<GNode['id'], GNode[]>;

// @ts-ignore
export type WeightedAdjacencyList = Record<GNode['id'], (GNode & {
// @ts-ignore
  /**
// @ts-ignore
   * the weight of the edge that connects the key node to the neighbor node
// @ts-ignore
   */
// @ts-ignore
  weight: number
// @ts-ignore
})[]>;
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * creates an adjacency list mapping node ids to nodes along with a added field `weight` that
// @ts-ignore
 * represents the weight of the edge connecting them
// @ts-ignore
 *
// @ts-ignore
 * @param graph the graph instance
// @ts-ignore
 * @param fallbackWeight the weight between two adjacent nodes if the label of the edge connecting them
// @ts-ignore
 * cannot be parsed as a number. defaults to 1
// @ts-ignore
 * @returns an adjacency list using ids of nodes as keys and the full node objects with weights as values
// @ts-ignore
 * @example getWeightedAdjacencyList(graph)
// @ts-ignore
 * // {
// @ts-ignore
 * //   'abc123': [{ id: 'def456', label: 'B', weight: 1, x: 0, y: 0 }],
// @ts-ignore
 * //   'def456': [{ id: 'abc123', label: 'A', weight: 1, x: 100, y: 100 }]
// @ts-ignore
 * // }
// @ts-ignore
 */
// @ts-ignore
export const getWeightedAdjacencyList = (graph: Graph, fallbackWeight = 1) => {
// @ts-ignore
  const adjList = getAdjacencyList(graph);
// @ts-ignore
  const adjListEntries = Object.entries(adjList);
// @ts-ignore

// @ts-ignore
  return adjListEntries.reduce<WeightedAdjacencyList>((acc, [keyNodeId, toNodeIds]) => {
// @ts-ignore
    acc[keyNodeId] = toNodeIds.map(toNodeId => ({
// @ts-ignore
      ...graph.getNode(toNodeId)!,
// @ts-ignore
      weight: getWeightBetweenNodes(keyNodeId, toNodeId, graph, fallbackWeight)
// @ts-ignore
    }))
// @ts-ignore
    return acc;
// @ts-ignore
  }, {});
}

// @ts-ignore
export type TransitionMatrix = number[][];

// @ts-ignore
export type GraphPlaygroundControls = {
// @ts-ignore
  theme: boolean,
// @ts-ignore
  tutorial: boolean,
// @ts-ignore
  settings: boolean,
// @ts-ignore
  buttons: boolean,
}

// @ts-ignore
export type DijkstrasTrace = ReturnType<typeof dijkstras>;
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
export const dijkstras = (graph: Graph, startingNodeId: GNode['id']) => {
// @ts-ignore
  const { getInboundEdges, getOutboundEdges } = graph.helpers;
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
      getInboundEdges(sourceNode.id).length === 0 &&
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
    getOutboundEdges(sourceNode.id).forEach((edge) => {
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
export type DijkstraSimulationRunner = SimulationRunner<DijkstrasTrace>;

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
  // TODO
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
    return graph.baseTheme.value.nodeColor;
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
  const encapsulatedNodeBoxBorderColor = () => {
// @ts-ignore
    const themes: Record<GraphThemeName, Color> = {
// @ts-ignore
      dark: colors.WHITE,
// @ts-ignore
      light: colors.BLACK,
// @ts-ignore
      girl: colors.PURPLE_800,
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    return themes[graph.themeName.value] + '80';
// @ts-ignore
  }
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
    setTheme('marqueeEncapsulatedNodeBoxBorderColor', encapsulatedNodeBoxBorderColor)
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
export type MarkupSize = typeof MARKUP_SIZES[number];

// @ts-ignore
export type AdjacencyMap = Map<number, number[]>;

// @ts-ignore
export type Parent = Map<string, string>
// @ts-ignore
export type Rank = Map<string, number>
// @ts-ignore

// @ts-ignore
export const kruskal = (graph: Graph) => {
// @ts-ignore
  const { nodes, edges } = graph;
// @ts-ignore
  const { getEdgeWeight } = graph.helpers;
// @ts-ignore

// @ts-ignore
  const find = (parent: Parent, nodeId: string): string => {
// @ts-ignore
    if (parent.get(nodeId) !== nodeId) {
// @ts-ignore
      parent.set(nodeId, find(parent, parent.get(nodeId)!));
// @ts-ignore
    }
// @ts-ignore
    return parent.get(nodeId)!;
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const union = (parent: Parent, rank: Rank, nodeA: string, nodeB: string) => {
// @ts-ignore
    const rootA = find(parent, nodeA);
// @ts-ignore
    const rootB = find(parent, nodeB);
// @ts-ignore

// @ts-ignore
    if (rootA !== rootB) {
// @ts-ignore
      const rankA = rank.get(rootA)!;
// @ts-ignore
      const rankB = rank.get(rootB)!;
// @ts-ignore

// @ts-ignore
      if (rankA < rankB) {
// @ts-ignore
        parent.set(rootA, rootB);
// @ts-ignore
      } else if (rankA > rankB) {
// @ts-ignore
        parent.set(rootB, rootA);
// @ts-ignore
      } else {
// @ts-ignore
        parent.set(rootB, rootA);
// @ts-ignore
        rank.set(rootA, rankA + 1);
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const run = () => {
// @ts-ignore
    const sortedEdges = Object.values(edges.value).sort((edgeA, edgeB) => {
// @ts-ignore
      return getEdgeWeight(edgeA.id) - getEdgeWeight(edgeB.id);
// @ts-ignore
    });
// @ts-ignore

// @ts-ignore
    const parent = new Map<string, string>();
// @ts-ignore
    const rank = new Map<string, number>();
// @ts-ignore

// @ts-ignore
    graph.nodes.value.forEach((node) => {
// @ts-ignore
      parent.set(node.id, node.id);
// @ts-ignore
      rank.set(node.id, 0);
// @ts-ignore
    });
// @ts-ignore

// @ts-ignore
    const mst: GEdge[] = [];
// @ts-ignore
    for (const edge of sortedEdges) {
// @ts-ignore
      const sourceRoot = find(parent, edge.from);
// @ts-ignore
      const targetRoot = find(parent, edge.to);
// @ts-ignore

// @ts-ignore
      if (sourceRoot !== targetRoot) {
// @ts-ignore
        mst.push(edge);
// @ts-ignore
        union(parent, rank, sourceRoot, targetRoot);
// @ts-ignore

// @ts-ignore
        if (mst.length === nodes.value.length - 1) break;
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    return mst;
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  return run();
}

// @ts-ignore
export type MSTTrace = GEdge[];
// @ts-ignore
export type MSTSimulationControls = SimulationControls<MSTTrace>;
// @ts-ignore
export type MSTSimulationRunner = SimulationRunner<MSTTrace>;
// @ts-ignore

// @ts-ignore
export const useMSTSimulationRunner = (
// @ts-ignore
  graph: Graph,
// @ts-ignore
  trace: MSTSimulationControls['trace']
// @ts-ignore
): MSTSimulationRunner => {
// @ts-ignore
  const simControls = useSimulationControls(trace);
// @ts-ignore
  const { activate, deactivate } = useSimulationTheme(graph, simControls);
// @ts-ignore
  return {
// @ts-ignore
    simControls,
// @ts-ignore
    start: () => {
// @ts-ignore
      activate();
// @ts-ignore
      simControls.start();
// @ts-ignore
    },
// @ts-ignore
    stop: () => {
// @ts-ignore
      deactivate();
// @ts-ignore
      simControls.stop();
// @ts-ignore
    },
// @ts-ignore
  }
}

// @ts-ignore
export type FlowTrace = Record<GEdge['id'], number>[]

// @ts-ignore
export type FlowSimulationControls = SimulationControls<FlowTrace>
// @ts-ignore
export type FlowSimulationRunner = SimulationRunner<FlowTrace>
// @ts-ignore

// @ts-ignore
export const useSimulationRunner = (graph: Graph): FlowSimulationRunner => {
// @ts-ignore
  const { text } = useTextTip();
// @ts-ignore

// @ts-ignore
  const {
// @ts-ignore
    activate: activeEdgeThickener,
// @ts-ignore
    deactivate: deactivateEdgeThickener
// @ts-ignore
  } = useEdgeThickener(graph, FLOW_USETHEME_ID + '-runner')
// @ts-ignore

// @ts-ignore
  const {
// @ts-ignore
    stylize: activateFlowColorizer,
// @ts-ignore
    destylize: deactivateFlowColorizer
// @ts-ignore
  } = useSourceSinkTheme(graph, FLOW_USETHEME_ID + '-runner')
// @ts-ignore

// @ts-ignore
  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)
// @ts-ignore

// @ts-ignore
  const { sourceNode, sinkNode } = state
// @ts-ignore
  const { trace } = useFordFulkerson(graph)
// @ts-ignore
  const simControls = useSimulationControls(trace, {
// @ts-ignore
    allowEditingDuringPlayback: false,
// @ts-ignore
  })
// @ts-ignore

// @ts-ignore
  const { activate: activateTheme, deactivate: deactivateTheme } = useSimulationTheme(graph, simControls)
// @ts-ignore

// @ts-ignore
  let cancelled = false;
// @ts-ignore

// @ts-ignore
  const start = async () => {
// @ts-ignore
    graph.settings.value.persistent = false;
// @ts-ignore

// @ts-ignore
    activateFlowColorizer()
// @ts-ignore
    activeEdgeThickener()
// @ts-ignore

// @ts-ignore
    if (!sourceNode.value) {
// @ts-ignore
      text.value = 'Select a source node'
// @ts-ignore
      await state.setNode(graph, sourceNode)
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    if (cancelled) return
// @ts-ignore

// @ts-ignore
    if (!sinkNode.value) {
// @ts-ignore
      text.value = 'Select a sink node'
// @ts-ignore
      await state.setNode(graph, sinkNode)
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    text.value = undefined
// @ts-ignore

// @ts-ignore
    if (cancelled) return
// @ts-ignore

// @ts-ignore
    createResidualEdges()
// @ts-ignore
    activateTheme()
// @ts-ignore

// @ts-ignore
    simControls.start()
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const stop = async () => {
// @ts-ignore
    cancelled = true
// @ts-ignore

// @ts-ignore
    state.cancelNodeSelection.value?.()
// @ts-ignore

// @ts-ignore
    simControls.stop()
// @ts-ignore
    cleanupResidualEdges()
// @ts-ignore
    deactivateTheme()
// @ts-ignore

// @ts-ignore
    deactivateFlowColorizer()
// @ts-ignore
    deactivateEdgeThickener()
// @ts-ignore

// @ts-ignore
    text.value = undefined
// @ts-ignore
    graph.settings.value.persistent = true
// @ts-ignore

// @ts-ignore
    setTimeout(() => cancelled = false, 0)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    start,
// @ts-ignore
    stop,
// @ts-ignore
    simControls,
// @ts-ignore
  }
}

// @ts-ignore
type WeightMap = Map<GEdge['id'], number>

// @ts-ignore
export type EdgeThickenerControls = ReturnType<typeof useEdgeThickener>;

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
  id?: string,
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
  id?: string,
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
  id?: string,
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
   * If -10, text will be on the line but 10 units towards the start.
// @ts-ignore
   * If 10, text will be on the line but 10 units away from the start.
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
  id?: string
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
export type Scribble = {
// @ts-ignore
  id?: string;
// @ts-ignore
  type: "draw" | "erase";
// @ts-ignore
  color?: string;
// @ts-ignore
  brushWeight?: number;
// @ts-ignore
  points: Coordinate[];
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export const SCRIBBLE_DEFAULTS = {
// @ts-ignore
  color: "red",
// @ts-ignore
  brushWeight: 3,
// @ts-ignore
} as const
// @ts-ignore

// @ts-ignore
export const ERASER_BRUSH_WEIGHT = 50
// @ts-ignore

// @ts-ignore
export const scribble = (options: Scribble): Shape => {
// @ts-ignore

// @ts-ignore
  if (options.points.length < 1) {
// @ts-ignore
    throw new Error('not enough points to draw scribble')
// @ts-ignore
  }
// @ts-ignore
  if (options.brushWeight && options.brushWeight < 1) {
// @ts-ignore
    throw new Error('brushWeight must be at least "1"')
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore

// @ts-ignore
  const shapeHitbox = scribbleHitbox(options);
// @ts-ignore
  const efficientHitbox = scribbleEfficientHitbox(options)
// @ts-ignore
  const hitbox = (point: Coordinate) => {
// @ts-ignore
    return shapeHitbox(point)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const getBoundingBox = getScribbleBoundingBox(options);
// @ts-ignore

// @ts-ignore
  const drawShape = drawScribbleWithCtx(options);
// @ts-ignore

// @ts-ignore
  const draw = (ctx: CanvasRenderingContext2D) => {
// @ts-ignore
    drawShape(ctx);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore

// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    id: options.id ?? generateId(),
// @ts-ignore
    name: 'scribble',
// @ts-ignore

// @ts-ignore
    drawShape,
// @ts-ignore
    draw,
// @ts-ignore

// @ts-ignore
    hitbox,
// @ts-ignore
    shapeHitbox,
// @ts-ignore
    efficientHitbox,
// @ts-ignore
    getBoundingBox,
// @ts-ignore
  }
}

// @ts-ignore
export type Square = {
// @ts-ignore
  id?: string
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
  id?: string;
// @ts-ignore
  point1: Coordinate;
// @ts-ignore
  point2: Coordinate;
// @ts-ignore
  point3: Coordinate;
// @ts-ignore
  color?: string;
// @ts-ignore
  stroke?: Stroke;
// @ts-ignore
  textArea?: TextAreaNoLocation;
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export const TRIANGLE_DEFAULTS = {
// @ts-ignore
  color: "black",
// @ts-ignore
} as const;
// @ts-ignore

// @ts-ignore
export const triangle = (options: Triangle): Shape => {
// @ts-ignore
  const drawShape = drawTriangleWithCtx(options);
// @ts-ignore
  const shapeHitbox = triangleHitbox(options);
// @ts-ignore
  const textHitbox = triangleTextHitbox(options);
// @ts-ignore
  const efficientHitbox = triangleEfficientHitbox(options);
// @ts-ignore
  const hitbox = (point: Coordinate) => {
// @ts-ignore
    return shapeHitbox(point); // text not implemented yet
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const getBoundingBox = getTriangleBoundingBox(options);
// @ts-ignore

// @ts-ignore
  const drawTextArea = drawTextAreaOnTriangle(options);
// @ts-ignore

// @ts-ignore
  const drawTextAreaMatte = drawTextAreaMatteOnTriangle(options);
// @ts-ignore
  const drawText = drawTextOnTriangle(options);
// @ts-ignore

// @ts-ignore
  const draw = (ctx: CanvasRenderingContext2D) => {
// @ts-ignore
    drawShape(ctx);
// @ts-ignore
    drawTextArea?.(ctx);
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    id: options.id ?? generateId(),
// @ts-ignore
    name: "triangle",
// @ts-ignore

// @ts-ignore
    draw,
// @ts-ignore
    drawShape,
// @ts-ignore
    drawTextArea,
// @ts-ignore
    drawTextAreaMatte,
// @ts-ignore
    drawText,
// @ts-ignore

// @ts-ignore
    hitbox,
// @ts-ignore
    shapeHitbox,
// @ts-ignore
    textHitbox,
// @ts-ignore
    efficientHitbox,
// @ts-ignore
    getBoundingBox,
// @ts-ignore
  };
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export type BoundingBox = Pick<Rect, 'at' | 'width' | 'height'>

// @ts-ignore
export type ShapeName = 'circle' | 'line' | 'square' | 'rect' | 'triangle' | 'arrow' | 'uturn' | 'cross' | 'scribble'

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
  id?: string,
// @ts-ignore
  at: Coordinate,
// @ts-ignore
  spacing: number,
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
   * the runner for the simulation
// @ts-ignore
   */
// @ts-ignore
  runner: SimulationRunner,
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
// @ts-ignore
  /**
// @ts-ignore
   * points to a products state, must have a `reset` method that resets the state of
// @ts-ignore
   * the product when invoked
// @ts-ignore
   */
// @ts-ignore
  state?: { reset: () => void },
}

// @ts-ignore
type GNodeTheme = {
// @ts-ignore
  color: Color;
// @ts-ignore
  textColor: Color;
}

// @ts-ignore
export type ProgressOptions = {
// @ts-ignore
  /**
// @ts-ignore
   * at the value in the 0th index, the progress bar will be empty.
// @ts-ignore
   * at the 1st index, the progress bar will be full.
// @ts-ignore
   */
// @ts-ignore
  range: [number, number];
// @ts-ignore
  /**
// @ts-ignore
   * the current value of the progress bar.
// @ts-ignore
   * should be within the range specified in the range prop.
// @ts-ignore
   */
// @ts-ignore
  progress: number;
// @ts-ignore
  /**
// @ts-ignore
   *
// @ts-ignore
   */
// @ts-ignore
  previewProgress?: number;
// @ts-ignore
  /**
// @ts-ignore
   * the time it takes, in milliseconds, for the progress bar
// @ts-ignore
   * to visually adjust to the new progress value.
// @ts-ignore
   * @default 250
// @ts-ignore
   */
// @ts-ignore
  transitionTimeMs?: number;
// @ts-ignore
  /**
// @ts-ignore
   * a css easing function used to transition the progress bar.
// @ts-ignore
   * @default "ease-in-out"
// @ts-ignore
   */
// @ts-ignore
  transitionEasing?: "linear" | "ease-in-out";
// @ts-ignore
  /**
// @ts-ignore
   * the color of the progress bar.
// @ts-ignore
   * @default colors.GRAY_200 // tailwind gray-200
// @ts-ignore
   */
// @ts-ignore
  color?: string;
// @ts-ignore
  /**
// @ts-ignore
   * called when the user clicks on the progress bar to set the progress.
// @ts-ignore
   * @param progress the new progress value.
// @ts-ignore
   */
// @ts-ignore
  onProgressSet?: (progress: number) => void
// @ts-ignore
  onHover?: (progress: number) => void
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export const PROGRESS_DEFAULTS = {
// @ts-ignore
  transitionTimeMs: 250,
// @ts-ignore
  transitionEasing: "ease-in-out",
// @ts-ignore
  color: colors.GRAY_200,
// @ts-ignore
} as const;
// @ts-ignore

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
   * wont do anything if the current step is 0
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
   * ranges from 0 to trace.length where 0 is the state before the algorithm has begun
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
   * @throws if step is not within the bounds of the trace (0 to trace.length)
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
   * true when the step is greater than 0
// @ts-ignore
   */
// @ts-ignore
  hasBegun: ComputedRef<boolean>
}

// @ts-ignore
export type SimulationRunner<T extends any[] = any[]> = {
// @ts-ignore
  /**
// @ts-ignore
   * Start the simulation
// @ts-ignore
   */
// @ts-ignore
  start: () => Promise<void> | void
// @ts-ignore
  /**
// @ts-ignore
   * Stop the simulation
// @ts-ignore
   */
// @ts-ignore
  stop: () => Promise<void> | void
// @ts-ignore
  /**
// @ts-ignore
   * The controls for the simulation
// @ts-ignore
   */
// @ts-ignore
  simControls: SimulationControls<T>
}

// @ts-ignore
type SimulationControlsOptions = {
// @ts-ignore
  /**
// @ts-ignore
   * if true, the user can edit the graph while the simulation is running
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  allowEditingDuringPlayback?: boolean
}

// @ts-ignore
export type EasingFunction =
// @ts-ignore
  | "linear"
// @ts-ignore
  | "in-out"
// @ts-ignore
  | "in"
// @ts-ignore
  | "out"
// @ts-ignore
  /**
// @ts-ignore
   * @param {number} progress the current progress
// @ts-ignore
   * @returns {number} the new progress
// @ts-ignore
   */
// @ts-ignore
  | ((progress: number) => number);
// @ts-ignore

// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 *
// @ts-ignore
 * @param {number} progress the current progress
// @ts-ignore
 * @param {EasingFunction} ease the easing function
// @ts-ignore
 * @returns
// @ts-ignore
 */
// @ts-ignore
export const easeFunction = (progress: number, ease: EasingFunction) => {
// @ts-ignore
  if (typeof ease === "function") return ease(progress);
// @ts-ignore

// @ts-ignore
  switch (ease) {
// @ts-ignore
    case "linear":
// @ts-ignore
      return progress;
// @ts-ignore
    case "in":
// @ts-ignore
      return progress * progress;
// @ts-ignore
    case "out":
// @ts-ignore
      return progress * (2 - progress);
// @ts-ignore
    case "in-out":
// @ts-ignore
      return progress < 0.5
// @ts-ignore
        ? 2 * progress * progress
// @ts-ignore
        : -1 + (4 - 2 * progress) * progress;
// @ts-ignore
    default:
// @ts-ignore
      throw new Error("invalid easing function");
// @ts-ignore
  }
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 *
// @ts-ignore
 * @param {number} startPosition the start position of the element
// @ts-ignore
 * @param {number} endPosition the end position of the element
// @ts-ignore
 * @param {number} steps the number of steps to get from `startPosition` to `endPosition`
// @ts-ignore
 * @param {EasingFunction} easing the easing function
// @ts-ignore
 * @returns {Coordinate[]} list of coordinates following the `easing` function between `startPosition` and `endPosition`
// @ts-ignore
 *
// @ts-ignore
 * @example
// @ts-ignore
 * pointInterpolation({ x: 0, y: 0 }, { x: 100, y: 50 }, 5, 'linear')
// @ts-ignore
 * // returns
// @ts-ignore
 * // {x: 20, y: 10}
// @ts-ignore
 * // {x: 40, y: 20}
// @ts-ignore
 * // {x: 60, y: 30}
// @ts-ignore
 * // {x: 80, y: 40}
// @ts-ignore
 * // {x: 100, y: 50}
// @ts-ignore
 */
// @ts-ignore
export const pointInterpolation = (
// @ts-ignore
  startPosition: Coordinate,
// @ts-ignore
  endPosition: Coordinate,
// @ts-ignore
  steps: number,
// @ts-ignore
  easing: EasingFunction = "linear"
// @ts-ignore
) => {
// @ts-ignore
  if (steps < 1) throw new Error('Steps must be greater than 0')
// @ts-ignore
  if (steps % 1 !== 0) throw new Error('Step must be integer')
// @ts-ignore

// @ts-ignore
  const result: Coordinate[] = [];
// @ts-ignore

// @ts-ignore
  for (let i = 1; i <= steps; i++) {
// @ts-ignore
    const progress = i / steps;
// @ts-ignore
    const easedProgress = easeFunction(progress, easing);
// @ts-ignore

// @ts-ignore
    const x = Math.round(startPosition.x + (endPosition.x - startPosition.x) * easedProgress);
// @ts-ignore
    const y = Math.round(startPosition.y + (endPosition.y - startPosition.y) * easedProgress);
// @ts-ignore

// @ts-ignore
    result.push({ x, y });
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return result;
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export type Color = string;

// @ts-ignore
export type CanvasCoords = ReturnType<typeof useCanvasCoords>;

// @ts-ignore
export type MaybeGetter<T, K extends any[] = []> = T | ((...arg: K) => T)

// @ts-ignore
export type UnwrapMaybeGetter<T> = T extends MaybeGetter<infer U, infer _> ? U : T

// @ts-ignore
export type MaybeGetterParams<T> = RemoveAnyArray<T extends MaybeGetter<infer _, infer K> ? K : []>

// @ts-ignore
export type ProductMap = Record<ProductInfo['productId'], ProductInfo>

// @ts-ignore
export type ProductInfoWithMenu = ProductInfo & Required<Pick<ProductInfo, "menu">>;

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
 * @example DeepRequired<{ a?: number, b?: { c?: string } }> // { a: number, b: { c: string } }
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
 * @example PartiallyPartial<{ a: number, b: string }, 'a'> // { a?: number, b: string }
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
 * @example NestedKeys<{ a: { b: { c: 5 } } }> // 'a' | 'a.b' | 'a.b.c'
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
/**
// @ts-ignore
 * get the value of a nested key in an object
// @ts-ignore
 * @example DeepValue<{ a: { b: { c: 5 } } }, 'a.b.c'> // 5
// @ts-ignore
 */
// @ts-ignore
export type DeepValue<T, Path extends string> = ExecuteDeepValue<OnlyObjNested<T>, Path>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * takes `any[]` out of a union of arrays
// @ts-ignore
 * @example RemoveAnyArray<number[] | any[]> // number[]
// @ts-ignore
 */
// @ts-ignore
export type RemoveAnyArray<T extends any[]> = T extends ['!!!-@-NOT-A-TYPE-@-!!!'][] ? never : T
// @ts-ignore

// @ts-ignore

// @ts-ignore
// HTML mouse and keyboard event types
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