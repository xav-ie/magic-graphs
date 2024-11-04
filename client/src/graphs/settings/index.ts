import { fractionToDecimal } from "@utils/fracDecConverter/fracDec";


/**
 * BASE GRAPH SETTINGS
 */

export type OnlyBaseGraphSettings = {
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

export const DEFAULT_BASE_SETTINGS: OnlyBaseGraphSettings = {
  displayEdgeLabels: true,
  edgeLabelsEditable: true,
  edgeInputToWeight: (input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return
    const decimalNum = fractionToDecimal(trimmed)?.toFixed(2)
    return Number(decimalNum ?? trimmed)
  }
}

export type BaseGraphSettings = OnlyBaseGraphSettings


/**
 * FOCUS GRAPH SETTINGS
 */

export type OnlyFocusGraphSettings = {}

export const DEFAULT_FOCUS_SETTINGS: OnlyFocusGraphSettings = {}

export type FocusGraphSettings = BaseGraphSettings


/**
 * DRAGGABLE GRAPH SETTINGS
 */

export type OnlyDraggableGraphSettings = {
  /**
   * whether the graph is draggable
   * @default true
   */
  draggable: boolean;
}

export const DEFAULT_DRAGGABLE_SETTINGS: OnlyDraggableGraphSettings = {
  draggable: true,
}

export type DraggableGraphSettings = FocusGraphSettings & OnlyDraggableGraphSettings


/**
 * NODE ANCHOR GRAPH SETTINGS
 */

export type OnlyNodeAnchorGraphSettings = {
  /**
   * whether node anchors are enabled
   * @default true
   */
  nodeAnchors: boolean
}

export const DEFAULT_NODE_ANCHOR_SETTINGS: OnlyNodeAnchorGraphSettings = {
  nodeAnchors: true
}

export type NodeAnchorGraphSettings = DraggableGraphSettings & OnlyNodeAnchorGraphSettings


/**
 * MARQUEE GRAPH SETTINGS
 */

export type OnlyMarqueeGraphSettings = {}

export const DEFAULT_MARQUEE_SETTINGS: OnlyMarqueeGraphSettings = {}

export type MarqueeGraphSettings = NodeAnchorGraphSettings & OnlyMarqueeGraphSettings


/**
 * USER EDITABLE GRAPH SETTINGS
 */

export type OnlyUserEditableGraphSettings = {
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

export const DEFAULT_USER_EDITABLE_SETTINGS: OnlyUserEditableGraphSettings = {
  userEditable: true,
  userEditableAddedEdgeType: 'directed',
  userEditableAddedEdgeWeight: 1,
}

export type UserEditableGraphSettings = MarqueeGraphSettings & OnlyUserEditableGraphSettings


/**
 * PERSISTENT GRAPH SETTINGS
 */

export type OnlyPersistentGraphSettings = {
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

export const DEFAULT_PERSISTENT_SETTINGS: OnlyPersistentGraphSettings = {
  persistent: true,
  persistentStorageKey: 'graph',
  persistentTrackTheme: false,
  persistentTrackSettings: false,
}

export type PersistentGraphSettings = UserEditableGraphSettings & OnlyPersistentGraphSettings


/**
 * COLLABORATIVE GRAPH SETTINGS
 */

export type OnlyCollaborativeGraphSettings = {}

export const DEFAULT_COLLABORATIVE_SETTINGS: OnlyCollaborativeGraphSettings = {}

export type CollaborativeGraphSettings = PersistentGraphSettings & OnlyCollaborativeGraphSettings