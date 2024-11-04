import type { BaseGraphEvents, GraphEvents } from './types'

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

export const getInitialEventBus = () => {
  const eventBus: MappingsToEventBus<GraphEvents> = {
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