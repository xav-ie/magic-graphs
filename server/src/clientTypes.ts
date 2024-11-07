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
   * whether to focus the newly added item via useFocusGraph
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  focus: boolean
}

// @ts-ignore
export type BroadcastOption = {
// @ts-ignore
  /**
// @ts-ignore
   * whether to broadcast the newly added node to
// @ts-ignore
   * connected collaborators via useCollaborativeGraph (socket.io)
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  broadcast: boolean
}

// @ts-ignore
export type AddNodeOptions = FocusOption & BroadcastOption

// @ts-ignore
export type RemoveNodeOptions = BroadcastOption

// @ts-ignore
export type AddEdgeOptions = FocusOption & BroadcastOption

// @ts-ignore
export type RemoveEdgeOptions = BroadcastOption

// @ts-ignore
export type MoveNodeOptions = BroadcastOption

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
  edgeWeightEdited: (edgeId: GEdge['id'], weight: number) => void
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
export type Id = SchemaItem['id']
// @ts-ignore
export type MaybeId = Id | undefined
// @ts-ignore

// @ts-ignore
export type FocusedItem = {
// @ts-ignore
  type: 'node',
// @ts-ignore
  item: GNode,
// @ts-ignore
} | {
// @ts-ignore
  type: 'edge',
// @ts-ignore
  item: GEdge,
}

// @ts-ignore
export type ValidFocusableTypes = SchemaItem['graphType'] & FocusedItem['type']

// @ts-ignore
export type SelectionBox = Pick<Rect, 'at' | 'width' | 'height'>

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
export type AdjacencyList = Record<string, string[]>;

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
  const eventBus: GraphEventBus = {
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
    onNodeRemoved: new Set(),
// @ts-ignore
    onNodeMoved: new Set(),
// @ts-ignore

// @ts-ignore
    onEdgeAdded: new Set(),
// @ts-ignore
    onEdgeRemoved: new Set(),
// @ts-ignore
    onEdgeWeightChange: new Set(),
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
    onKeydown: new Set(),
// @ts-ignore

// @ts-ignore
    onThemeChange: new Set(),
// @ts-ignore
    onSettingsChange: new Set(),
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
  }
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
   * when a node is removed from the graph
// @ts-ignore
   */
// @ts-ignore
  onNodeRemoved: (node: GNode, options: RemoveNodeOptions) => void;
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
   * when an edge is added to the graph
// @ts-ignore
   */
// @ts-ignore
  onEdgeAdded: (edge: GEdge, options: AddEdgeOptions) => void;
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
   * when an edge's weight is changed
// @ts-ignore
   */
// @ts-ignore
  onEdgeWeightChange: (edge: GEdge) => void;
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
  onKeydown: (ev: KeyboardEvent) => void;
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
export type FocusGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when the focus item (ie nodes or edges) changes.
// @ts-ignore
   * undefined if the user is not focusing on an item
// @ts-ignore
   */
// @ts-ignore
  onFocusChange: (newItemId: string | undefined, oldItemId: string | undefined) => void;
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
export type MarqueeGraphEventMap = {}

// @ts-ignore
export type PersistentGraphEventMap = {}

// @ts-ignore
export type GraphEventMap = (
// @ts-ignore
  BaseGraphEventMap &
// @ts-ignore
  FocusGraphEventMap &
// @ts-ignore
  DraggableGraphEventMap &
// @ts-ignore
  NodeAnchorGraphEventMap &
// @ts-ignore
  MarqueeGraphEventMap &
// @ts-ignore
  UserEditableGraphEventMap &
// @ts-ignore
  PersistentGraphEventMap &
// @ts-ignore
  CollaborativeGraphEventMap
// @ts-ignore
)

// @ts-ignore
export type SupportedNodeShapes = 'circle' | 'square'

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
   * a setter for edge weights, takes the inputted string and returns a number that will
// @ts-ignore
   * be set as the edge weight or undefined if the edge weight should not be set
// @ts-ignore
   * @default function that attempts to parse the input as a number and if successful returns the number
// @ts-ignore
   */
// @ts-ignore
  edgeInputToWeight: (input: string) => number | undefined;
}

// @ts-ignore
export type FocusGraphSettings = {}

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
export type MarqueeGraphSettings = {}

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
   * the type of edge to add when creating an edge between nodes
// @ts-ignore
   * @default "directed"
// @ts-ignore
   */
// @ts-ignore
  userEditableAddedEdgeType: 'directed' | 'undirected',
// @ts-ignore
  /**
// @ts-ignore
   * the default weight to assign to edges when created using the UI
// @ts-ignore
   * @default 1
// @ts-ignore
   */
// @ts-ignore
  userEditableAddedEdgeWeight: number,
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
  nodeFocusColor: getTheme('nodeFocusColor', node),
// @ts-ignore
  nodeFocusBorderColor: getTheme('nodeFocusBorderColor', node),
// @ts-ignore
  nodeTextSize: getTheme('nodeTextSize', node),
// @ts-ignore
  nodeTextColor: getTheme('nodeTextColor', node),
// @ts-ignore
  nodeFocusTextColor: getTheme('nodeFocusTextColor', node),
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
  edgeTextSize: getTheme('edgeTextSize', edge),
// @ts-ignore
  edgeTextColor: getTheme('edgeTextColor', edge),
// @ts-ignore
  edgeFocusColor: getTheme('edgeFocusColor', edge),
// @ts-ignore
  edgeFocusTextColor: getTheme('edgeFocusTextColor', edge),
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
  nodeFocusColor: string,
// @ts-ignore
  nodeFocusBorderColor: string,
// @ts-ignore
  nodeText: string,
// @ts-ignore
  nodeFocusTextColor: string,
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
  edgeTextSize: number,
// @ts-ignore
  edgeTextColor: string,
// @ts-ignore
  edgeFocusTextColor: string,
// @ts-ignore
  edgeTextFontWeight: TextFontWeight,
// @ts-ignore
  edgeFocusColor: string,
}

// @ts-ignore
export type BaseGraphTheme = WrapWithNodeGetter<BaseGraphNodeTheme> & WrapWithEdgeGetter<BaseGraphEdgeTheme> & {
// @ts-ignore
  graphBgColor: string,
// @ts-ignore
  graphBgPatternColor: string,
}

// @ts-ignore
export type FocusGraphTheme = {}

// @ts-ignore
export type NodeAnchorGraphTheme = {
// @ts-ignore
  nodeAnchorRadius: NodeGetterOrValue<number>;
// @ts-ignore
  nodeAnchorColor: NodeGetterOrValue<string>;
// @ts-ignore
  nodeAnchorColorWhenParentFocused: NodeGetterOrValue<string>;
// @ts-ignore
  linkPreviewColor: MaybeGetter<string, [GNode, NodeAnchor]>;
// @ts-ignore
  linkPreviewWidth: MaybeGetter<number, [GNode, NodeAnchor]>;
}

// @ts-ignore
export type MarqueeGraphTheme = {}

// @ts-ignore
export type PersistentGraphTheme = {}

// @ts-ignore
export type GraphTheme = (
// @ts-ignore
  BaseGraphTheme &
// @ts-ignore
  FocusGraphTheme &
// @ts-ignore
  DraggableGraphTheme &
// @ts-ignore
  NodeAnchorGraphTheme &
// @ts-ignore
  MarqueeGraphTheme &
// @ts-ignore
  UserEditableGraphTheme &
// @ts-ignore
  PersistentGraphTheme &
// @ts-ignore
  CollaborativeGraphTheme
// @ts-ignore
)
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * decomposes MaybeGetter<T, K> such that it turns T into T | void
// @ts-ignore
 */
// @ts-ignore
export type MaybeGetterOrVoid<T> = MaybeGetter<UnwrapMaybeGetter<T> | void, MaybeGetterParams<T>>
// @ts-ignore

// @ts-ignore
type WrapWithNodeGetter<T extends Record<string, any>> = {
// @ts-ignore
  [K in keyof T]: NodeGetterOrValue<T[K]>
}

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
type ThemeableGraph = Pick<Graph, 'themeMap' | 'repaint'>

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
export type TutorialControls = ReturnType<typeof useBasicsTutorial>;

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
// @ts-ignore

// @ts-ignore
  weight: number,
// @ts-ignore
  type: 'directed' | 'undirected',
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
type MarqueeGraphTypes = 'marquee-selection-box'
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
export type UseAggregatorOptions = {
// @ts-ignore
  canvas: Ref<HTMLCanvasElement | null | undefined>
// @ts-ignore
  emit: GraphEventEmitter
}

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
}

// @ts-ignore
export type AdjacencyMap = Map<number, number[]>;

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
}

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