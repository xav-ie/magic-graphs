export type GButton = {
  cond?: () => boolean,
  label: () => string,
  action: () => void,
  color: () => string,
  id: GraphButtonId,
}

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

export type FocusedItem = {
  type: 'node',
  item: GNode,
}

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

export type BaseGraphEdgeTheme = {
  edgeColor: string,
  edgeWidth: number,
  edgeTextSize: number,
  edgeTextColor: string,
  edgeFocusTextColor: string,
  edgeTextFontWeight: TextFontWeight,
  edgeFocusColor: string,
}

export type FocusGraphTheme = {}

export type DraggableGraphTheme = {}

export type NodeAnchorGraphTheme = {
  nodeAnchorRadius: NodeGetterOrValue<number>;
  nodeAnchorColor: NodeGetterOrValue<string>;
  nodeAnchorColorWhenParentFocused: NodeGetterOrValue<string>;
  linkPreviewColor: MaybeGetter<string, [GNode, NodeAnchor]>;
  linkPreviewWidth: MaybeGetter<number, [GNode, NodeAnchor]>;
}

export type MarqueeGraphTheme = {}

export type UserEditableGraphTheme = {}

export type PersistentGraphTheme = {}

export type CollaborativeGraphTheme = {}

export type FullThemeMap = {
  [K in keyof GraphTheme]: ThemeMapEntry<K>[]
}

export type TimeoutStep = {
  hint: string,
  dismiss: 'onTimeout',
  /**
   * time to wait before the next step, in milliseconds
   */
  after: number,
}

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
}

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

export type Coordinate = {
  x: number,
  y: number,
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
}

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