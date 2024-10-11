import type { MaybeGetter } from './types'
import type { UseGraphEventBusCallbackMappings, MappingsToEventBus } from './useGraphBase'

/*
  unwraps MaybeGetter type into a value of type T
*/
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

/*
  generates id. Every item on the canvas must have an id
*/
export const generateId = () => Math.random().toString(36).substring(2, 9)