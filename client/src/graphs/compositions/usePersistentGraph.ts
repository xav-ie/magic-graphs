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
import type { GraphTheme } from '@graph/themes/types'

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

  // graph.subscribe('onSettingsChange', (diff) => {

  // })

  // watch(persistSettings, (newSettings, oldSettings) => {
  //   stopListeningForEvents()

  //   const graphPersistenceTurnedOff = !newSettings
  //   if (graphPersistenceTurnedOff) return

  //   // persistent was false, but now it is true
  //   if (!oldSettings) {
  //     load()
  //   }

  //   // persistent was true, so we had to check if the storage key changed
  //   // to ensure we dont load the same graph twice
  //   if (oldSettings && newSettings.storageKey !== oldSettings.storageKey) {
  //     load()
  //   }

  //   listenForGraphStateEvents()

  //   if (newSettings.trackSettings || newSettings.trackTheme) {
  //     listenForOptionsEvents()
  //   }
  // }, {
  //   immediate: true,
  //   deep: true
  // })

  return {
    ...graph,
    settings,
  }
}