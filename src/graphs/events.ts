import type { BaseGraphEvents } from "@graph/compositions/useBaseGraph";

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