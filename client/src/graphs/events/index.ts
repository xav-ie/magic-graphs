import type { GraphEventMap as ImportedGraphEventMap } from './types'

/**
 * a complete mapping of all graph events to their callback functions
 */
export type GraphEventMap = ImportedGraphEventMap

/**
 * turns a type that maps an events callback fn type to an actual event bus
 */
export type EventMapToEventBus<T> = Record<keyof T, Set<any>>

export type GraphEventBus = EventMapToEventBus<GraphEventMap>;

export type GraphEvent = keyof GraphEventMap;

/**
 * a version of Parameters<T> that removes constraints on T
 */
type PermissiveParams<T> = T extends (...args: infer P) => any ? P : never;

/**
  generates a "subscribe" and "unsubscribe" function for the event bus
  in order to registering, deregistering and broadcast graph events in a type-safe manner
*/
export const generateSubscriber = <T extends GraphEventMap>(eventBus: EventMapToEventBus<T>) => ({
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