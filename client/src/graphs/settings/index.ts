import { fractionToDecimal } from "@utils/fracDecConverter/fracDec";

/**
 * BASE GRAPH SETTINGS
 */
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
   * a setter for edge labels - takes the user inputted string and returns a string that will
   * be set as the edge label or returns undefined if the edge label should not be set
   * @default function tries converting the user input to a number
   */
  edgeInputToLabel: (input: string) => string | undefined;
}

export const DEFAULT_BASE_SETTINGS: BaseGraphSettings = {
  displayEdgeLabels: true,
  edgeLabelsEditable: true,
  edgeInputToLabel: (input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return
    const decimalNum = fractionToDecimal(trimmed)?.toFixed(2)
    if (decimalNum === "Infinity") return '∞'
    else if (decimalNum === "-Infinity") return '-∞'
    else if (decimalNum === undefined && isNaN(Number(trimmed))) return
    return decimalNum ?? trimmed
  }
}

/**
 * FOCUS GRAPH SETTINGS
 */
export type FocusGraphSettings = {
  /**
   * if false, no items on the graph can be focused
   */
  focusable: boolean;
  /**
   * a list of item ids that cannot be focused
   */
  focusBlacklist: string[];
}

export const DEFAULT_FOCUS_SETTINGS: FocusGraphSettings = {
  focusable: true,
  focusBlacklist: [],
}

/**
 * DRAGGABLE GRAPH SETTINGS
 */
export type DraggableGraphSettings = {
  /**
   * whether the graph is draggable
   * @default true
   */
  draggable: boolean;
}

export const DEFAULT_DRAGGABLE_SETTINGS: DraggableGraphSettings = {
  draggable: true,
}

/**
 * NODE ANCHOR GRAPH SETTINGS
 */
export type NodeAnchorGraphSettings = {
  /**
   * whether node anchors are enabled
   * @default true
   */
  nodeAnchors: boolean
}

export const DEFAULT_NODE_ANCHOR_SETTINGS: NodeAnchorGraphSettings = {
  nodeAnchors: true
}

/**
 * MARQUEE GRAPH SETTINGS
 */
export type MarqueeGraphSettings = {}

export const DEFAULT_MARQUEE_SETTINGS: MarqueeGraphSettings = {}

/**
 * USER EDITABLE GRAPH SETTINGS
 */
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
   * the default label assigned to edges when created using the UI
   * @default 1
   */
  userEditableAddedEdgeLabel: string,
}

export const DEFAULT_USER_EDITABLE_SETTINGS: UserEditableGraphSettings = {
  userEditable: true,
  userEditableAddedEdgeType: 'directed',
  userEditableAddedEdgeLabel: "1",
}

/**
 * PERSISTENT GRAPH SETTINGS
 */
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

export const DEFAULT_PERSISTENT_SETTINGS: PersistentGraphSettings = {
  persistent: true,
  persistentStorageKey: 'graph',
  persistentTrackTheme: false,
  persistentTrackSettings: false,
}

/**
 * COLLABORATIVE GRAPH SETTINGS
 */
export type CollaborativeGraphSettings = {}

export const DEFAULT_COLLABORATIVE_SETTINGS: CollaborativeGraphSettings = {}

/**
 * represents all settings on a graph instance
 */
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