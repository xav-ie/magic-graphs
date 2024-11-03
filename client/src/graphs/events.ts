import type { GEdge, GNode } from "@graph/types";
import type { PersistentGraphSettings } from "@graph/compositions/usePersistentGraph";
import type {
  AddNodeOptions,
  RemoveNodeOptions,
  MoveNodeOptions,
  AddEdgeOptions,
  RemoveEdgeOptions,
} from "@graph/baseGraphAPIs";
import type { GraphTheme } from "@graph/themes/types";
import type { DeepPartial } from "@utils/types";

export type BaseGraphEvents = {
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
  // TODO - PersistentGraphSettings is the top layer
  // TODO - but should be replaced with an alias to the top layer for clarity
  onSettingsChange: (diff: DeepPartial<PersistentGraphSettings>) => void;
}

/**
 * turns a type that maps an events callback fn type to an actual event bus
 */
export type MappingsToEventBus<T> = Record<keyof T, Set<any>>

/**
 * a version of Parameters<T> that removes constraints on T
 */
type PermissiveParams<T> = T extends (...args: infer P) => any ? P : never;

/**
  generates a "subscribe" and "unsubscribe" function for the event bus
  in order to registering, deregistering and broadcast graph events in a type-safe manner
*/
export const generateSubscriber = <T extends BaseGraphEvents>(eventBus: MappingsToEventBus<T>) => ({
  subscribe: <K extends keyof T>(event: K, fn: T[K]) => eventBus[event].add(fn),
  unsubscribe: <K extends keyof T>(event: K, fn: T[K]) => eventBus[event].delete(fn),
  emit: <K extends keyof T>(event: K, ...args: PermissiveParams<T[K]>) => {
    for (const fn of eventBus[event]) {
      fn(...args)
    }
  }
})

/**
 * helper types for graph event architecture
 */
export type GenerateSubscriber<T extends BaseGraphEvents> = typeof generateSubscriber<T>;
export type Subscriber<T extends BaseGraphEvents> = ReturnType<GenerateSubscriber<T>>['subscribe'];
export type Unsubscriber<T extends BaseGraphEvents> = ReturnType<GenerateSubscriber<T>>['unsubscribe'];
export type Emitter<T extends BaseGraphEvents> = ReturnType<GenerateSubscriber<T>>['emit'];

export type BaseGraphSubscriber = Subscriber<BaseGraphEvents>;
export type BaseGraphUnsubscriber = Unsubscriber<BaseGraphEvents>;
export type BaseGraphEmitter = Emitter<BaseGraphEvents>;

export const getInitialEventBus = () => ({
  onStructureChange: new Set(),
  onFocusChange: new Set(),

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
} as MappingsToEventBus<BaseGraphEvents>)