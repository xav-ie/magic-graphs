import type { MaybeGetter } from './useGraphTypes'
import type { UseGraphEventBusCallbackMappings, MappingsToEventBus } from './useGraphBase'

export const getValue = <T, K extends any[]>(value: MaybeGetter<T, K>, ...args: K) => {
  if (typeof value === 'function') {
    return (value as (...args: K) => T)(...args)
  }
  return value
}

/*
  generates a "subscribe" function for the event bus
  in order to registering new events
*/
export const generateSubscriber = <T extends UseGraphEventBusCallbackMappings>(
  eventBus: MappingsToEventBus<T>
) => <K extends keyof T>(
  event: K,
  fn: T[K]
) => eventBus[event].push(fn)