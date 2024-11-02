import {
  ref,
  computed,
  watch,
} from 'vue'
import type { Ref } from 'vue'
import type {
  GNode,
  GEdge,
  GraphOptions
} from '@graph/types'
import { useUserEditableGraph } from '@graph/compositions/useUserEditableGraph'
import type {
  UserEditableGraphOptions,
  UserEditableGraphSettings,
  UserEditableGraphTheme
} from '@graph/compositions/useUserEditableGraph'
import type { DraggableGraphEvents } from './useDraggableGraph'

export type PersistentGraphTheme = UserEditableGraphTheme
export type PersistSettings = {
  /**
   * the key to use for storing the graph in local storage
   * @default "graph"
   */
  storageKey: string,
  /**
   * whether to track theme changes
   * @default false
   */
  trackTheme: boolean,
  /**
   * whether to track settings changes
   * @default false
   */
  trackSettings: boolean,
}

export const defaultPersistSettings = {
  storageKey: 'graph',
  trackTheme: false,
  trackSettings: false,
} as const

export type PersistentGraphSettings = UserEditableGraphSettings & {
  persistent: boolean | Partial<PersistSettings>
}

export const defaultPersistentGraphSettings = {
  persistent: true,
} as const

export type PersistentGraphOptions = GraphOptions<UserEditableGraphTheme, PersistentGraphSettings>

const resolvePersistSettings = (settings: PersistentGraphSettings) => {
  if (settings.persistent === false) return null
  if (settings.persistent === true) return defaultPersistSettings
  return {
    ...defaultPersistSettings,
    ...settings.persistent
  }
}

/**
 * extends the useGraph interface to include capabilities for storing and retrieving a graph from local storage.
 *
 * LIMITATION: the graph is stored in local storage as a JSON string. This means that functions and other non-serializable
 * properties will not be stored. This is especially important for graph themes.
 *
 * @param canvas
 * @param options
 * @returns
 */
export const usePersistentGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {

  const graph = useUserEditableGraph(canvas, options)

  // return graph

  const settings = ref<PersistentGraphSettings>(Object.assign(graph.settings.value, {
    ...defaultPersistentGraphSettings,
    ...options.settings,
  }))

  const persistSettings = computed(() => resolvePersistSettings(settings.value))
  const storageKey = computed(() => persistSettings.value?.storageKey ?? defaultPersistSettings.storageKey)

  const nodeStorage = {
    get: () => JSON.parse(localStorage.getItem(storageKey.value + '-nodes') ?? '[]'),
    set: (nodes: GNode[]) => localStorage.setItem(storageKey.value + '-nodes', JSON.stringify(nodes))
  }

  const edgeStorage = {
    get: () => JSON.parse(localStorage.getItem(storageKey.value + '-edges') ?? '[]'),
    set: (edges: GEdge[]) => localStorage.setItem(storageKey.value + '-edges', JSON.stringify(edges))
  }

  const themeStorage = {
    get: () => JSON.parse(localStorage.getItem(storageKey.value + '-theme') ?? '{}'),
    set: (theme: UserEditableGraphTheme) => localStorage.setItem(storageKey.value + '-theme', JSON.stringify(theme))
  }

  const settingsStorage = {
    get: () => JSON.parse(localStorage.getItem(storageKey.value + '-settings') ?? '{}'),
    set: (settings: UserEditableGraphSettings) => localStorage.setItem(storageKey.value + '-settings', JSON.stringify(settings))
  }

  const trackGraphState = () => {
    nodeStorage.set(graph.nodes.value)
    edgeStorage.set(graph.edges.value)
  }

  let previousKey = storageKey.value
  const trackOptions = () => {
    const currentKey = storageKey.value

    // trackOptions was triggered by a change in the storage key, so we cannot update storage
    if (previousKey !== currentKey) {
      previousKey = currentKey
      return
    }

    if (persistSettings.value?.trackTheme) {
      themeStorage.set(graph.theme.value)
    }

    if (persistSettings.value?.trackSettings) {
      settingsStorage.set(settings.value)
    }

    previousKey = currentKey
  }

  const load = () => {
    graph.nodes.value = nodeStorage.get()
    graph.edges.value = edgeStorage.get()

    // wait for the next microtask to ensure caller of useGraph has a chance to sub to onStructureChange
    queueMicrotask(() => {
      graph.eventBus.onStructureChange.forEach(fn => fn(graph.nodes.value, graph.edges.value))
    })

    if (persistSettings.value?.trackTheme) {
      graph.theme.value = Object.assign(graph.theme.value, themeStorage.get())
    }

    if (persistSettings.value?.trackSettings) {
      settings.value = Object.assign(settings.value, settingsStorage.get())
    }

    setTimeout(() => graph.repaint('persistent-graph/load')(), 10)
  }

  const trackChangeEvents: (keyof DraggableGraphEvents)[] = [
    'onStructureChange',
    'onNodeDrop',
    'onGraphReset',
    'onEdgeWeightChange',
  ]

  const trackOptionsEvents: (keyof DraggableGraphEvents)[] = [
    'onThemeChange',
    'onSettingsChange',
  ]

  const listenForOptionsEvents = () => {
    trackOptionsEvents.forEach(event => graph.subscribe(event, trackOptions))
  }

  const stopListeningForOptionsEvents = () => {
    trackOptionsEvents.forEach(event => graph.unsubscribe(event, trackOptions))
  }

  const listenForGraphStateEvents = () => {
    trackChangeEvents.forEach(event => graph.subscribe(event, trackGraphState))
  }

  const stopListeningForGraphStateEvents = () => {
    trackChangeEvents.forEach(event => graph.unsubscribe(event, trackGraphState))
  }

  const stopListeningForEvents = () => {
    stopListeningForOptionsEvents()
    stopListeningForGraphStateEvents()
  }

  watch(persistSettings, (newSettings, oldSettings) => {
    stopListeningForEvents()

    const graphPersistenceTurnedOff = !newSettings
    if (graphPersistenceTurnedOff) return

    // persistent was false, but now it is true
    if (!oldSettings) {
      load()
    }

    // persistent was true, so we had to check if the storage key changed
    // to ensure we dont load the same graph twice
    if (oldSettings && newSettings.storageKey !== oldSettings.storageKey) {
      load()
    }

    listenForGraphStateEvents()

    if (newSettings.trackSettings || newSettings.trackTheme) {
      listenForOptionsEvents()
    }
  }, {
    immediate: true,
    deep: true
  })

  return {
    ...graph,
    settings,
  }
}