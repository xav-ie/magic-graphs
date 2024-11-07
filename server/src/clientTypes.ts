type GraphButtonIdMap = typeof GRAPH_BUTTON_ID;
type GraphButtonId = GraphButtonIdMap[keyof GraphButtonIdMap];

/**
 * @describes a button that can be added to the graph toolbar
 */
export type GButton = {
  cond?: () => boolean,
  label: () => string,
  action: () => void,
  color: () => string,
  id: GraphButtonId,
}

export type BaseGraph = ReturnType<typeof useBaseGraph>

export type FocusOption = {
  /**
   * whether to focus the newly added item via useFocusGraph
   * @default true
   */
  focus: boolean
}

export type BroadcastOption = {
  /**
   * whether to broadcast the newly added node to
   * connected collaborators via useCollaborativeGraph (socket.io)
   * @default true
   */
  broadcast: boolean
}

export type RemoveNodeOptions = BroadcastOption

export type AddEdgeOptions = FocusOption & BroadcastOption

export type RemoveEdgeOptions = BroadcastOption

export type MoveNodeOptions = BroadcastOption

export type Collaborator = {
  id: string
  name: string
  color: string
  mousePosition: { x: number, y: number }
}

export type ToServerCollaboratorMove = {
  x: number
  y: number
}

export type ToClientCollaboratorMove = {
  id: Collaborator['id']
  x: number
  y: number
}

export type CollaboratorMap = Record<Collaborator['id'], Collaborator>

export type GraphState = {
  nodes: GNode[],
  edges: GEdge[]
}

export interface GraphEvents {
  nodeAdded: (node: GNode) => void
  nodeRemoved: (nodeId: GNode['id']) => void
  nodeMoved: (node: GNode) => void

  edgeAdded: (edge: GEdge) => void
  edgeRemoved: (edgeId: GEdge['id']) => void
  edgeWeightEdited: (edgeId: GEdge['id'], weight: number) => void

  collaboratorJoined: (collaborator: Collaborator) => void
  collaboratorLeft: (collaboratorId: Collaborator['id']) => void

  toServerCollaboratorMoved: (collaboratorMove: ToServerCollaboratorMove) => void
  toClientCollaboratorMoved: (collaboratorMove: ToClientCollaboratorMove) => void

  joinRoom: (
    joinOptions: Collaborator & { roomId: string },
    joinWithGraphState: GraphState | null,
    mapCallback: (collabMap: CollaboratorMap, graphState: GraphState) => void
  ) => void

  leaveRoom: (confirmationCallback: () => void) => void
}

export type Id = SchemaItem['id']
export type MaybeId = Id | undefined

export type FocusedItem = {
  type: 'node',
  item: GNode,
} | {
  type: 'edge',
  item: GEdge,
}

export type SelectionBox = Pick<Rect, 'at' | 'width' | 'height'>

export type NodeAnchor = {
  /**
   * the x-coordinate of the anchor
   */
  x: number,
  /**
   * the y-coordinate of the anchor
   */
  y: number,
  /**
   * the direction of the anchor relative to the parent node.
   * ie the north anchor is the one that spawns above the node
   */
  direction: 'north' | 'east' | 'south' | 'west',
  /**
   * the unique id of the anchor
   */
  id: string,
}

export type AdjacencyList = Record<string, string[]>;

export type GraphEventMap = ImportedGraphEventMap

export type EventMapToEventBus<T> = Record<keyof T, Set<any>>

export type GraphEventBus = EventMapToEventBus<GraphEventMap>;

export type GraphEvent = keyof GraphEventMap;

type PermissiveParams<T> = T extends (...args: infer P) => any ? P : never;

export type GenerateSubscriber<
  T extends GraphEventMap = GraphEventMap
> = typeof generateSubscriber<T>;

export type Subscriber<
  T extends GraphEventMap = GraphEventMap
> = ReturnType<GenerateSubscriber<T>>['subscribe'];

export type Unsubscriber<
  T extends GraphEventMap = GraphEventMap
> = ReturnType<GenerateSubscriber<T>>['unsubscribe'];

export type Emitter<
  T extends GraphEventMap = GraphEventMap
> = ReturnType<GenerateSubscriber<T>>['emit'];

/**
 * @returns an empty event bus with all events initialized to empty sets
 */
export const getInitialEventBus = () => {
  const eventBus: GraphEventBus = {
    /**
     * BaseGraphEvents
     */
    onStructureChange: new Set(),

    onNodeAdded: new Set(),
    onNodeRemoved: new Set(),
    onNodeMoved: new Set(),

    onEdgeAdded: new Set(),
    onEdgeRemoved: new Set(),
    onEdgeWeightChange: new Set(),

    onRepaint: new Set(),
    onNodeHoverChange: new Set(),
    onGraphReset: new Set(),

    onClick: new Set(),
    onMouseDown: new Set(),
    onMouseUp: new Set(),
    onMouseMove: new Set(),
    onDblClick: new Set(),
    onContextMenu: new Set(),

    onKeydown: new Set(),

    onThemeChange: new Set(),
    onSettingsChange: new Set(),

    /**
     * FocusGraphEvents
     */
    onFocusChange: new Set(),

    /**
     * DraggableGraphEvents
     */
    onNodeDragStart: new Set(),
    onNodeDrop: new Set(),

    /**
     * NodeAnchorGraphEvents
     */
    onNodeAnchorDragStart: new Set(),
    onNodeAnchorDrop: new Set(),
  }

  return eventBus
}

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

export type SupportedNodeShapes = 'circle' | 'square'

export type BaseGraphSettings = {
  /**
   * whether to display edge labels
   * @default true
   */
  displayEdgeLabels: boolean;
  /**
   * whether edge labels should be editable
   * @default true
   */
  edgeLabelsEditable: boolean;
  /**
   * a setter for edge weights, takes the inputted string and returns a number that will
   * be set as the edge weight or undefined if the edge weight should not be set
   * @default function that attempts to parse the input as a number and if successful returns the number
   */
  edgeInputToWeight: (input: string) => number | undefined;
}

export type FocusGraphSettings = {}

export type DraggableGraphSettings = {
  /**
   * whether the graph is draggable
   * @default true
   */
  draggable: boolean;
}

export type NodeAnchorGraphSettings = {
  /**
   * whether node anchors are enabled
   * @default true
   */
  nodeAnchors: boolean
}

export type MarqueeGraphSettings = {}

export type UserEditableGraphSettings = {
  /**
   * whether the user can edit the graph
   * @default true
   */
  userEditable: boolean;
  /**
   * the type of edge to add when creating an edge between nodes
   * @default "directed"
   */
  userEditableAddedEdgeType: 'directed' | 'undirected',
  /**
   * the default weight to assign to edges when created using the UI
   * @default 1
   */
  userEditableAddedEdgeWeight: number,
}

export type PersistentGraphSettings = {
  /**
   * whether the graph is persistent
   * @default true
   */
  persistent: boolean;
  /**
   * the key to use for storing the graph in local storage
   * @default "graph"
   */
  persistentStorageKey: string,
  /**
   * whether to track theme changes
   * @default false
   */
  persistentTrackTheme: boolean,
  /**
   * whether to track settings changes
   * @default false
   */
  persistentTrackSettings: boolean,
}

export type CollaborativeGraphSettings = {}

export type GraphSettings = (
  BaseGraphSettings &
  FocusGraphSettings &
  DraggableGraphSettings &
  NodeAnchorGraphSettings &
  MarqueeGraphSettings &
  UserEditableGraphSettings &
  PersistentGraphSettings &
  CollaborativeGraphSettings
)

/**
 * the default settings for a graph instance
 */
export const DEFAULT_GRAPH_SETTINGS = {
  ...DEFAULT_BASE_SETTINGS,
  ...DEFAULT_FOCUS_SETTINGS,
  ...DEFAULT_DRAGGABLE_SETTINGS,
  ...DEFAULT_NODE_ANCHOR_SETTINGS,
  ...DEFAULT_MARQUEE_SETTINGS,
  ...DEFAULT_USER_EDITABLE_SETTINGS,
  ...DEFAULT_PERSISTENT_SETTINGS,
  ...DEFAULT_COLLABORATIVE_SETTINGS,
} as const satisfies GraphSettings

type ModifiedExtract<T, U, R = never> = T extends U ? T : R

type FuncExtract<T, U> = ModifiedExtract<T, U, () => void>

type ThemeParams<T extends keyof GraphTheme> = Parameters<FuncExtract<GraphTheme[T], Function>>

type ResolvedThemeParams<T extends keyof GraphTheme> = ThemeParams<T> extends []
  ? [] : Exclude<ThemeParams<T>, []>;


export const getThemeResolver = (
  theme: Ref<Partial<GraphTheme>>,
  themeMap: FullThemeMap,
) => <
  T extends keyof GraphTheme,
  K extends ResolvedThemeParams<T>
>(
  prop: T,
  ...args: K
) => {
    const themeMapEntry = themeMap[prop].findLast((themeMapEntryItem: FullThemeMap[T][number]) => {
      const themeGetterOrValue = themeMapEntryItem.value
      const themeValue = getValue<typeof themeGetterOrValue, K>(
        themeGetterOrValue,
        ...args
      ) as UnwrapMaybeGetter<GraphTheme[T]>
      return themeValue ?? false
    })
    const getter = themeMapEntry?.value ?? theme.value[prop]
    if (!getter) throw new Error(`Theme property "${prop}" not found`)
    return getValue<typeof getter, K>(getter, ...args) as UnwrapMaybeGetter<GraphTheme[T]>
  }

/**
 * describes the function that gets a value from a theme inquiry
 */
export type ThemeGetter = ReturnType<typeof getThemeResolver>

export type GraphTheme = GraphThemeImport
export type GraphThemeKey = keyof GraphTheme

export const THEMES = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
} as const satisfies Record<string, GraphTheme>

/**
 * gets the theme attributes for a GNode at the point in time the function is called
 *
 * @param getTheme - the theme getter function
 * @param node - the node to get the theme for
 * @returns the theme attributes for the node
 */
export const resolveThemeForNode = (getTheme: ThemeGetter, node: GNode): BaseGraphNodeTheme => ({
  nodeSize: getTheme('nodeSize', node),
  nodeBorderWidth: getTheme('nodeBorderWidth', node),
  nodeColor: getTheme('nodeColor', node),
  nodeBorderColor: getTheme('nodeBorderColor', node),
  nodeFocusColor: getTheme('nodeFocusColor', node),
  nodeFocusBorderColor: getTheme('nodeFocusBorderColor', node),
  nodeTextSize: getTheme('nodeTextSize', node),
  nodeTextColor: getTheme('nodeTextColor', node),
  nodeFocusTextColor: getTheme('nodeFocusTextColor', node),
  nodeText: getTheme('nodeText', node),
  nodeShape: getTheme('nodeShape', node),
})

/**
 * gets the theme attributes for a GEdge at the point in time the function is called
 *
 * @param getTheme - the theme getter function
 * @param edge - the edge to get the theme for
 * @returns the theme attributes for the edge
 */
export const resolveThemeForEdge = (getTheme: ThemeGetter, edge: GEdge): BaseGraphEdgeTheme => ({
  edgeWidth: getTheme('edgeWidth', edge),
  edgeColor: getTheme('edgeColor', edge),
  edgeTextSize: getTheme('edgeTextSize', edge),
  edgeTextColor: getTheme('edgeTextColor', edge),
  edgeFocusColor: getTheme('edgeFocusColor', edge),
  edgeFocusTextColor: getTheme('edgeFocusTextColor', edge),
  edgeTextFontWeight: getTheme('edgeTextFontWeight', edge),
})

export type NonColorGraphThemes = Pick<
  GraphTheme,
  'nodeShape' |
  'nodeSize' |
  'nodeBorderWidth' |
  'nodeTextSize' |
  'nodeAnchorRadius' |
  'edgeWidth' |
  'edgeTextSize' |
  'nodeText' |
  'edgeTextFontWeight' |
  'linkPreviewWidth'
>

/**
 * themes that do not depend on color scheme
 */
export const NON_COLOR_THEMES: NonColorGraphThemes = {
  nodeShape: 'circle',
  nodeSize: 35,
  nodeBorderWidth: 8,
  nodeTextSize: 24,
  // Math.ceil(Math.sqrt(nodeSize) * 2)
  nodeAnchorRadius: Math.ceil(Math.sqrt(35) * 2),
  edgeWidth: 10,
  edgeTextSize: 20,
  nodeText: ({ label }) => label,
  edgeTextFontWeight: 'bold',
  linkPreviewWidth: 10,
}

export type BaseGraphNodeTheme = {
  nodeSize: number,
  nodeBorderWidth: number,
  nodeColor: string,
  nodeBorderColor: string,
  nodeFocusColor: string,
  nodeFocusBorderColor: string,
  nodeText: string,
  nodeFocusTextColor: string,
  nodeTextSize: number,
  nodeTextColor: string,
  nodeShape: SupportedNodeShapes,
}

export type BaseGraphTheme = WrapWithNodeGetter<BaseGraphNodeTheme> & WrapWithEdgeGetter<BaseGraphEdgeTheme> & {
  graphBgColor: string,
  graphBgPatternColor: string,
}

export type DraggableGraphTheme = {}

export type NodeAnchorGraphTheme = {
  nodeAnchorRadius: NodeGetterOrValue<number>;
  nodeAnchorColor: NodeGetterOrValue<string>;
  nodeAnchorColorWhenParentFocused: NodeGetterOrValue<string>;
  linkPreviewColor: MaybeGetter<string, [GNode, NodeAnchor]>;
  linkPreviewWidth: MaybeGetter<number, [GNode, NodeAnchor]>;
}

export type UserEditableGraphTheme = {}

export type PersistentGraphTheme = {}

export type CollaborativeGraphTheme = {}

export type GraphTheme = (
  BaseGraphTheme &
  FocusGraphTheme &
  DraggableGraphTheme &
  NodeAnchorGraphTheme &
  MarqueeGraphTheme &
  UserEditableGraphTheme &
  PersistentGraphTheme &
  CollaborativeGraphTheme
)

/**
 * decomposes MaybeGetter<T, K> such that it turns T into T | void
 */
export type MaybeGetterOrVoid<T> = MaybeGetter<UnwrapMaybeGetter<T> | void, MaybeGetterParams<T>>

type WrapWithNodeGetter<T extends Record<string, any>> = {
  [K in keyof T]: NodeGetterOrValue<T[K]>
}

export type ThemeMapEntry<T extends keyof GraphTheme> = {
  value: MaybeGetterOrVoid<GraphTheme[T]>,
  useThemeId: string,
}

export type PartialThemeMap = Partial<FullThemeMap>

type ThemeableGraph = Pick<Graph, 'themeMap' | 'repaint'>

export type TutorialStepForEvent<T extends GraphEvent> = {
  /**
   * the hint to display to the user in order to complete the step
   */
  hint: string;
  /**
   * the event that triggers a dismiss inquiry, if its just the event itself (T), then the step will be dismissed
   * upon invocation of the event via event bus, if its an object, then the step will be dismissed upon invocation
   * of the event and only if the predicate returns true
   */
  dismiss: T | {
    event: T,
    /**
     * @param args the arguments passed to the event handler as defined in the event map
     * @returns true if the step should be dismissed
     */
    predicate: (...args: Parameters<GraphEventMap[T]>) => boolean
  };
};

/**
 * describes a step that will resolve after a set amount of time
 */
export type TimeoutStep = {
  hint: string,
  dismiss: 'onTimeout',
  /**
   * time to wait before the next step, in milliseconds
   */
  after: number,
};

type SharedStepProps = {
  /**
   * the text shown to the user in order to help guide them along
   */
  hint: string,
  /**
   * describes the precondition option for a tutorial step.
   * a precondition allows the implementer to run a function before the step is shown.
   * its boolean return acts just as a predicate would act as defined in base tutorial step.
   * if the precondition returns true, its like the condition for going to the next step is
   * already met, so the step will be skipped.
   */
  precondition?: (graph: Graph) => boolean,
  /**
   * callback to run when the step is initialized.
   * runs before precondition
   */
  onInit?: () => void,
  /**
   * callback to run when the step is dismissed
   */
  onDismiss?: () => void,
  /**
   * describes options for highlighting an element.
   * passing a string will highlight the element with the id
   */
  highlightElement?: string | {
    /**
     * id of the element to highlight
     */
    id?: string;
    /**
     * css class name to apply to the element
     * @default 'element-highlight'
     */
    className?: string;
  }
}

export type IntervalStep = {
  hint: string,
  dismiss: 'onInterval' | {
    event: 'onInterval',
    /**
     * @param iteration the number of times the interval has been called
     * @returns true if the step should be dismissed
     */
    predicate: (iteration: number) => boolean
  },
  /**
   * time to wait before the next evaluation, in milliseconds
   * @default 1000 milliseconds
   */
  interval?: number,
}

export type GraphEventStep = {
  [K in GraphEvent]: TutorialStepForEvent<K>
}[GraphEvent];

/**
 * describes a step in a tutorial sequence
 */
export type TutorialStep = (
  GraphEventStep |
  TimeoutStep |
  IntervalStep
) & SharedStepProps;

/**
 * describes a list of tutorial steps that will be executed in order from index 0 to n - 1
 */
export type TutorialSequence = TutorialStep[];


/**
 * time to wait (in milliseconds) between the dismissal of a step and the initialization of the next step
 */
export const DELAY_UNTIL_NEXT_STEP = 1000;

export const TUTORIAL_THEME_ID = 'tutorial'

export type TutorialControls = ReturnType<typeof useBasicsTutorial>;

export type UseGraph = typeof useGraph

export type Graph = ReturnType<UseGraph>

export type GraphOptions = {
  theme: Partial<GraphTheme>;
  settings: Partial<GraphSettings>;
}

export type GNode = {
  id: string,
  /**
   * it reflects what the user sees in the UI.
   * recommended to be unique.
   */
  label: string,
  /**
   * the x position of the node on the canvas
   */
  x: number,
  /**
   * the y position of the node on the canvas
   */
  y: number,
}

export type GEdge = {
  id: string,
  /**
   * id of the node that the edge is coming from
   */
  to: string,
  /**
   * id of the node that the edge is going to
   */
  from: string,
  /**
   * the text label that appears on the edge - NOT IMPLEMENTED
   */
  label: string,

  weight: number,
  type: 'directed' | 'undirected',
}

export type Aggregator = SchemaItem[]

export type UpdateAggregator = (aggregator: Aggregator) => Aggregator

export type RemoveAnyArray<T extends any[]> = T extends ['!!!-@-NOT-A-TYPE-@-!!!'][] ? never : T

export type MaybeGetter<T, K extends any[] = []> = T | ((...arg: K) => T)

export type NodeGetterOrValue<T> = MaybeGetter<T, [GNode]>
export type EdgeGetterOrValue<T> = MaybeGetter<T, [GEdge]>

/**
 * @describes the value of a MaybeGetter
*/
export type UnwrapMaybeGetter<T> = T extends MaybeGetter<infer U, infer _> ? U : T

/**
 * @describes the parameters of a MaybeGetter
*/
export type MaybeGetterParams<T> = RemoveAnyArray<T extends MaybeGetter<infer _, infer K> ? K : []>

type EventNames = keyof HTMLElementEventMap

type FilterEventNames<T> = {
  [K in EventNames]: HTMLElementEventMap[K] extends T ? K : never
}[EventNames]

type MouseEventNames = FilterEventNames<MouseEvent>
type KeyboardEventNames = FilterEventNames<KeyboardEvent>

type EventMap<T extends EventNames, E> = Record<T, (ev: E) => void>

export type MouseEventMap = EventMap<MouseEventNames, MouseEvent>
export type KeyboardEventMap = EventMap<KeyboardEventNames, KeyboardEvent>

export type MouseEventEntries = [keyof MouseEventMap, (ev: MouseEvent) => void][]
export type KeyboardEventEntries = [keyof KeyboardEventMap, (ev: KeyboardEvent) => void][]

type BaseGraphTypes = 'node' | 'edge'
type MarqueeGraphTypes = 'marquee-selection-box'
type NodeAnchorGraphTypes = 'node-anchor' | 'link-preview'

/**
 * @describes a schema item that can be fed into the aggregator in order to be rendered on the canvas
 */
export type SchemaItem = {
  /**
   * unique identifier for the schema item
   */
  id: string,
  /**
   * the type of graph data this schema item represents
   */
  graphType: BaseGraphTypes | NodeAnchorGraphTypes | MarqueeGraphTypes,
  /**
   * determines the order in which this schema item is rendered
   * on the canvas. The lower the number, the higher the priority, the higher the priority,
   * the earlier the item is rendered on the canvas.
   * (items with a lower priority score will appear visually underneath those with a higher score)
   */
  priority: number,
  /**
   * the magic shape instance that will be rendered on the canvas
   */
  shape: Shape,
}

export type UseAggregatorOptions = {
  canvas: Ref<HTMLCanvasElement | null | undefined>
  emit: GraphEventEmitter
}

export type GraphPlaygroundControls = {
  theme: boolean,
  tutorial: boolean,
  collab: boolean,
  settings: boolean,
}

export type AdjacencyMap = Map<number, number[]>;

type Color
} from "@colors";
import { TRANSIENT_COLOR } from "./colors";
import { useMarkovChainSCC } from "./useSCC";
import type { GNode, Graph } from "@graph/types";

const defaultColors = [
  color.RED,
  color.YELLOW,
  color.GREEN,
  color.BLUE,
  color.INDIGO,
  color.PURPLE,
  color.PINK,
];

export const markovSccColorizer = (
  graph: Graph,
  colors: Color[] = defaultColors
) => {

  const adjList = computed(() => nodesEdgesToAdjList(graph.nodes.value, graph.edges.value));

  const { markovClasses, nodeToConnectedComponentMap } = useMarkovChainSCC(adjList);
  const transientStates = computed(() => markovClasses.value.transientClasses.flat());

  const getColor = (node: GNode) => {
    const label = Number(node.label);
    if (transientStates.value.includes(label)) return TRANSIENT_COLOR;
    const componentIndex = nodeToConnectedComponentMap.value.get(label);
    if (componentIndex === undefined) return TRANSIENT_COLOR;
    return colors[componentIndex % colors.length];
  }

  graph.theme.value.nodeBorderColor = getColor;
  graph.theme.value.nodeAnchorColor = getColor;
  graph.theme.value.nodeAnchorColorWhenParentFocused = getColor;
  graph.theme.value.nodeFocusBorderColor = getColor;
  graph.theme.value.nodeFocusColor = GRAY_800;
}

export type AlgoName = keyof typeof algos

export type Trace = string[]

export type BFSLevelRecord = Record<GNode['id'], number>;

export type Arrow = Line

export type Circle = {
  at: Coordinate,
  radius: number,
  color?: string,
  stroke?: Stroke,
  textArea?: TextAreaNoLocation,
}

export type Cross = {
  at: Coordinate
  size: number
  rotation?: number
  color?: string
  lineWidth?: number
  borderRadius?: number
}

export type Line = {
  start: Coordinate,
  end: Coordinate,
  width?: number,
  textArea?: TextAreaNoLocation,
  /**
   * offsetFromCenter is used to position text. By default, text is centered on the line.
   * If -10, text will be on the line but 10 units below the center.
   * If 10, text will be on the line but 10 units above the center.
   */
  textOffsetFromCenter?: number,
  color?: string,
}

export type Rect = {
  at: Coordinate
  width: number
  height: number
  color?: string
  stroke?: Stroke
  textArea?: TextAreaNoLocation
  borderRadius?: number
  rotation?: number
}

export type Square = {
  at: Coordinate
  size: number
  color?: string
  stroke?: Stroke
  textArea?: TextAreaNoLocation
  borderRadius?: number
  rotation?: number
}

export type Triangle = {
  point1: Coordinate,
  point2: Coordinate,
  point3: Coordinate,
  color?: string,
}

export type ShapeName = 'circle' | 'line' | 'square' | 'rect' | 'triangle' | 'arrow' | 'uturn' | 'cross'

export type Shape = {
  /**
   * a unique identifier for the shape
   */
  id: string,

  /**
   * the name of the shape type, ie 'circle', 'line', etc
   */
  name: ShapeName,

  /**
   * draws the entire shape including text.
   * this is the default use case
   */
  draw: (ctx: CanvasRenderingContext2D) => void,

  /**
   * draws just the shape ignoring all text properties
   */
  drawShape: (ctx: CanvasRenderingContext2D) => void,

  /**
   * draws the text area of the shape (ie both matte and text)
   */
  drawTextArea?: (ctx: CanvasRenderingContext2D) => void,

  /**
   * only draws the matte of the text area
   */
  drawTextAreaMatte?: (ctx: CanvasRenderingContext2D) => void,

  /**
   * only draws the text content of the text area
   */
  drawText?: (ctx: CanvasRenderingContext2D) => void,

  /**
   * returns true if the point is within the shape or text area of the shape
   */
  hitbox: (point: Coordinate) => boolean,

  /**
   * returns true if the point is within the area of the shape
   */
  shapeHitbox: (point: Coordinate) => boolean,

  /**
   * returns true if the point is within the text area of the shape
   */
  textHitbox?: (point: Coordinate) => boolean,

  /**
   * activates the text area of the shape
   */
  activateTextArea?: (handler: (str: string) => void) => void,
}

export type TextAreaNoLocation = {
  /**
   * the text areas inner text
   */
  text: Text,
  /**
   * the color of the text area
   */
  color?: string,
  /**
   * the color of the text area when it is engaged
   * IE is converted to a textarea html element for user interaction
   */
  activeColor?: string,
}

export type TextArea = {
  at: Coordinate,
} & TextAreaNoLocation

export type TextFontWeight = 'lighter' | 'normal' | 'bold' | 'bolder'

// the text displayed in the text area
export type Text = {
  content: string,
  fontSize?: number,
  fontWeight?: TextFontWeight,
  color?: string,
}

export type Stroke = {
  color: string,
  width: number,
}

export type UTurn = {
  spacing: number,
  at: Coordinate,
  upDistance: number,
  downDistance: number,
  rotation: number,
  lineWidth: number,
  color?: string,
  textArea?: TextAreaNoLocation
}

export type MainPageInfo = {
  /**
   * the name of the menu item
   */
  name: string,
  /**
   *
   */
  description: string,
  /**
   * an image to display in the menu
   */
  thumbnail: string,
}

export type ProductInfo = {
  /**
   * consumed by vue-router in order to add it as an available route
   */
  route: RouteRecordRaw,
  /**
   * the name of the product.
   * used as document title
   */
  name: string,
  /**
   * the description of the product
   */
  description: string,
  /**
   * a unique identifier for the product, cannot contain spaces or special characters
   */
  productId: string,
  /**
   * if defined, the product will be added to the main menu
   * with the properties defined here
   */
  menu?: MainPageInfo,
}

export type Color = string;

interface Array<T> {
    findLast<S extends T>(
      predicate: (value: T, index: number, array: T[]) => value is S,
      thisArg?: any
    ): S | undefined;
    findLast(
      predicate: (value: T, index: number, array: T[]) => unknown,
      thisArg?: any
    ): T | undefined;
    findLastIndex(
      predicate: (value: T, index: number, array: T[]) => unknown,
      thisArg?: any
    ): number;
  }
}

export type DeepPartial<T> = {
  [K in keyof T]?: K extends Record<any, any>
  ? DeepPartial<T[K]>
  : T[K];
};

/**
 * make every key in an object required including nested objects
 */
export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends Record<any, any>
  ? DeepRequired<T[K]>
  : T[K];
};

/**
 * makes only certain keys K in an object T optional
 */
export type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * helper types for nested keys
 */
type AcceptableKeys = string | number | symbol
type AcceptableObject = Record<AcceptableKeys, any>

/**
 * get a clean union of all paths in an object
 */
export type NestedKeys<T extends AcceptableObject> = T extends AcceptableObject ? {
  [K in keyof T]: K | (
    Extract<T[K], AcceptableObject> extends AcceptableObject
    ? K extends string
    // @ts-ignore this works
    ? `${K}.${NestedKeys<Required<T[K]>>}` : never : never
  )
}[keyof T] : never

type OnlyObj<T> = Extract<T, object>

type OnlyObjNested<T> = {
  [K in keyof T]: OnlyObj<T[K]> extends never ? T[K] : OnlyObj<T[K]>
}

export type DeepValue<T, Path extends string> = ExecuteDeepValue<OnlyObjNested<T>, Path>