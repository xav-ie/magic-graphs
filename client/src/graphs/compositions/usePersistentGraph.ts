import type { Ref } from 'vue'
import type {
  GNode,
  GEdge,
  GraphOptions
} from '@graph/types'
import { useUserEditableGraph } from '@graph/compositions/useUserEditableGraph'
import type { GraphSettings } from '@graph/settings'
import type { GraphTheme } from '@graph/themes'
import type { GraphEvent } from '@graph/events'

/**
 * extends the useGraph interface to include capabilities for storing and retrieving a graph from local storage.
 *
 * LIMITATION: the graph is stored in local storage as a JSON string. This means that functions and
 * other non-serializable
 * properties will not be stored. This is especially important for graph themes.
 *
 * @param canvas
 * @param options
 * @returns the graph interface with additional persistent graph functionality
 */
export const usePersistentGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {}
) => {

  const graph = useUserEditableGraph(canvas, options)

  const nodeStorage = {
    get: () => JSON.parse(localStorage.getItem(graph.settings.value.persistentStorageKey + '-nodes') ?? '[]'),
    set: (nodes: GNode[]) => {
      localStorage.setItem(
        graph.settings.value.persistentStorageKey + '-nodes',
        JSON.stringify(nodes)
      )
    }
  }

  const edgeStorage = {
    get: () => JSON.parse(localStorage.getItem(graph.settings.value.persistentStorageKey + '-edges') ?? '[]'),
    set: (edges: GEdge[]) => {
      localStorage.setItem(
        graph.settings.value.persistentStorageKey + '-edges',
        JSON.stringify(edges)
      )
    }
  }

  const themeStorage = {
    get: () => JSON.parse(localStorage.getItem(graph.settings.value.persistentStorageKey + '-theme') ?? '{}'),
    set: (graphThemes: GraphTheme) => {
      localStorage.setItem(
        graph.settings.value.persistentStorageKey + '-theme',
        JSON.stringify(graphThemes)
      )
    }
  }

  const settingsStorage = {
    get: () => JSON.parse(localStorage.getItem(graph.settings.value.persistentStorageKey + '-settings') ?? '{}'),
    set: (graphSettings: GraphSettings) => {
      localStorage.setItem(
        graph.settings.value.persistentStorageKey + '-settings',
        JSON.stringify(graphSettings)
      )
    }
  }

  const trackGraphState = () => {
    nodeStorage.set(graph.nodes.value)
    edgeStorage.set(graph.edges.value)
  }

  let previousKey = graph.settings.value.persistentStorageKey
  const trackOptions = () => {
    const currentKey = graph.settings.value.persistentStorageKey

    // trackOptions was triggered by a change in the storage key, so we cannot update storage
    if (previousKey !== currentKey) {
      previousKey = currentKey
      return
    }

    if (graph.settings.value.persistentTrackTheme) {
      themeStorage.set(graph.theme.value)
    }

    if (graph.settings.value.persistentTrackSettings) {
      settingsStorage.set(graph.settings.value)
    }

    previousKey = currentKey
  }

  const load = () => {
    graph.nodes.value = nodeStorage.get()
    graph.edges.value = edgeStorage.get()


    if (graph.settings.value.persistentTrackTheme) {
      graph.theme.value = Object.assign(graph.theme.value, themeStorage.get())
    }

    if (graph.settings.value.persistentTrackSettings) {
      graph.settings.value = Object.assign(graph.settings.value, settingsStorage.get())
    }

    // wait for the next microtask to ensure caller of useGraph has a chance to sub to onStructureChange
    queueMicrotask(() => graph.emit('onStructureChange', graph.nodes.value, graph.edges.value))

    setTimeout(() => graph.repaint('persistent-graph/load')(), 10)
  }

  const trackChangeEvents: GraphEvent[] = [
    'onStructureChange',
    'onNodeDrop',
    'onGraphReset',
    'onEdgeWeightChange',
  ]

  const trackOptionsEvents: GraphEvent[] = [
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
      if (graph.settings.value.persistentTrackSettings || graph.settings.value.persistentTrackTheme) {
        listenForOptionsEvents()
      }

      return
    }

    // from here on out, persistent was true, but it was not in the diff

    if ('persistentStorageKey' in diff) {
      load()
    }

    listenForGraphStateEvents()

    if (graph.settings.value.persistentTrackSettings || graph.settings.value.persistentTrackTheme) {
      listenForOptionsEvents()
    }
  })

  return graph
}