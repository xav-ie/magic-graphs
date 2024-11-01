import type { GEdge, GNode } from "@graph/types";
import type { DeepPartial } from "@utils/types";
import type { PersistentGraphSettings } from "./compositions/usePersistentGraph";
import type { GraphTheme } from "./themes/types";

export type BaseGraphEvents = {
  /* graph dataflow events */
  onStructureChange: (nodes: GNode[], edges: GEdge[]) => void;
  onFocusChange: (newItemId: string | undefined, oldItemId: string | undefined) => void;
  onNodeAdded: (node: GNode) => void;
  onNodeRemoved: (node: GNode) => void;

  onEdgeAdded: (edge: GEdge) => void;
  onEdgeRemoved: (edge: GEdge) => void;

  onEdgeWeightChange: (edge: GEdge) => void;

  /*
    @description - this event is called when the graph needs to be redrawn
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
  // TODO - PersistentGraphSettings is the top layer
  // TODO - but should be replaced with an alias to the top layer for clarity
  onSettingsChange: (diff: DeepPartial<PersistentGraphSettings>) => void;
}

/**
 * turns a type that maps an events callback fn type to an actual event bus
 */
export type MappingsToEventBus<T> = Record<keyof T, any[]>

/**
  generates a "subscribe" and "unsubscribe" function for the event bus
  in order to registering and deregistering graph events in a type-safe manner
*/
export const generateSubscriber = <T extends BaseGraphEvents>(eventBus: MappingsToEventBus<T>) => ({
  subscribe: <K extends keyof T>(event: K, fn: T[K]) => {
    eventBus[event].push(fn)
  },
  unsubscribe: <K extends keyof T>(event: K, fn: T[K]) => {
    eventBus[event] = eventBus[event].filter((f: T[K]) => f !== fn)
  },
})

export const getInitialEventBus = () => ({
  onStructureChange: [],
  onFocusChange: [],
  onNodeAdded: [],
  onNodeRemoved: [],
  onEdgeAdded: [],
  onEdgeRemoved: [],
  onEdgeWeightChange: [],
  onRepaint: [],
  onNodeHoverChange: [],
  onGraphReset: [],
  onClick: [],
  onMouseDown: [],
  onMouseUp: [],
  onMouseMove: [],
  onDblClick: [],
  onContextMenu: [],
  onKeydown: [],
  onThemeChange: [],
  onSettingsChange: [],
} as MappingsToEventBus<BaseGraphEvents>)