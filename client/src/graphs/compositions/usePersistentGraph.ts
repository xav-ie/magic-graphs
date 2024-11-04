import { ref } from 'vue'
import type { Ref } from 'vue'
import type {
  GNode,
  GEdge,
  GraphOptions
} from '@graph/types'
import { useUserEditableGraph } from '@graph/compositions/useUserEditableGraph'
import type { DraggableGraphEvents } from './useDraggableGraph'
import { DEFAULT_PERSISTENT_SETTINGS } from '@graph/settings'
import type { PersistentGraphSettings, GraphSettings } from '@graph/settings'
import type { GraphTheme } from '@graph/themes'

export type PersistentGraphOptions = GraphOptions<PersistentGraphSettings>

/**
 * extends the useGraph interface to include capabilities for storing and retrieving a graph from local storage.
 *
 * LIMITATION: the graph is stored in local storage as a JSON string. This means that functions and
 * other non-serializable
 * properties will not be stored. This is especially important for graph themes.
 *
 * @param canvas
 * @param options
 * @returns
 */
export const usePersistentGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<PersistentGraphOptions> = {}
) => {

  const graph = useUserEditableGraph(canvas, options)

  const settings = ref<PersistentGraphSettings>(Object.assign(graph.settings.value, {
    ...DEFAULT_PERSISTENT_SETTINGS,
    ...options.settings,
  }))

  const nodeStorage = {
    get: () => JSON.parse(localStorage.getItem(settings.value.persistentStorageKey + '-nodes') ?? '[]'),
    set: (nodes: GNode[]) => {
      localStorage.setItem(
        settings.value.persistentStorageKey + '-nodes',
        JSON.stringify(nodes)
      )
    }
  }

  const edgeStorage = {
    get: () => JSON.parse(localStorage.getItem(settings.value.persistentStorageKey + '-edges') ?? '[]'),
    set: (edges: GEdge[]) => {
      localStorage.setItem(
        settings.value.persistentStorageKey + '-edges',
        JSON.stringify(edges)
      )
    }
  }

  const themeStorage = {
    get: () => JSON.parse(localStorage.getItem(settings.value.persistentStorageKey + '-theme') ?? '{}'),
    set: (graphThemes: GraphTheme) => {
      localStorage.setItem(
        settings.value.persistentStorageKey + '-theme',
        JSON.stringify(graphThemes)
      )
    }
  }

  const settingsStorage = {
    get: () => JSON.parse(localStorage.getItem(settings.value.persistentStorageKey + '-settings') ?? '{}'),
    set: (graphSettings: GraphSettings) => {
      localStorage.setItem(
        settings.value.persistentStorageKey + '-settings',
        JSON.stringify(graphSettings)
      )
    }
  }

  const trackGraphState = () => {
    nodeStorage.set(graph.nodes.value)
    edgeStorage.set(graph.edges.value)
  }

  let previousKey = settings.value.persistentStorageKey
  const trackOptions = () => {
    const currentKey = settings.value.persistentStorageKey

    // trackOptions was triggered by a change in the storage key, so we cannot update storage
    if (previousKey !== currentKey) {
      previousKey = currentKey
      return
    }

    if (settings.value.persistentTrackTheme) {
      themeStorage.set(graph.theme.value)
    }

    if (settings.value.persistentTrackSettings) {
      settingsStorage.set(settings.value)
    }

    previousKey = currentKey
  }

  const load = () => {
    graph.nodes.value = nodeStorage.get()
    graph.edges.value = edgeStorage.get()


    if (settings.value.persistentTrackTheme) {
      graph.theme.value = Object.assign(graph.theme.value, themeStorage.get())
    }

    if (settings.value.persistentTrackSettings) {
      settings.value = Object.assign(settings.value, settingsStorage.get())
    }

    // wait for the next microtask to ensure caller of useGraph has a chance to sub to onStructureChange
    queueMicrotask(() => graph.emit('onStructureChange', graph.nodes.value, graph.edges.value))

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

  graph.subscribe('onSettingsChange', (diff) => {
    stopListeningForEvents()

    // persistent was true, but now it is false
    const persistenceTurnedOff = 'persistent' in diff && !diff.persistent
    if (persistenceTurnedOff) return

    // persistent was false, but now it is true
    const persistenceTurnedOn = 'persistent' in diff && diff.persistent
    if (persistenceTurnedOn) {
      load()
      listenForGraphStateEvents()
      if (settings.value.persistentTrackSettings || settings.value.persistentTrackTheme) {
        listenForOptionsEvents()
      }

      return
    }

    // from here on out, persistent was true, but it was not in the diff

    if ('persistentStorageKey' in diff) {
      load()
    }

    listenForGraphStateEvents()

    if (settings.value.persistentTrackSettings || settings.value.persistentTrackTheme) {
      listenForOptionsEvents()
    }
  })

  return {
    ...graph,
    settings,
  }
}