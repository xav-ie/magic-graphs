import { type Ref, type WatchCallback, type WatchHandle, computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { GNode, GEdge, GraphOptions } from '@/useGraph/types'
import {
  useUserEditableGraph,
  type UserEditableGraphOptions,
  type UserEditableGraphSettings,
  type UserEditableGraphTheme
} from './useUserEditableGraph'
import { getValue } from './useGraphHelpers'

export type PersistentGraphTheme = UserEditableGraphTheme
export type PersistentGraphSettings = UserEditableGraphSettings & {
  storageKey: string,
  trackTheme: boolean,
  trackSettings: boolean,
}

export type PersistentGraphOptions = GraphOptions<UserEditableGraphTheme, PersistentGraphSettings>

export const defaultPersistentGraphSettings = {
  storageKey: 'graph',
  trackTheme: true,
  trackSettings: true,
} as const

export const usePersistentGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {

  const graph = useUserEditableGraph(canvas, options)

  const settings = ref<PersistentGraphSettings>(Object.assign(graph.settings.value, {
    ...defaultPersistentGraphSettings,
    ...options.settings,
  }))

  const nodeStorage = useLocalStorage<GNode[]>(settings.value.storageKey + '-nodes', [])
  const edgeStorage = useLocalStorage<GEdge[]>(settings.value.storageKey + '-edges', [])

  const themeStorage = useLocalStorage<PersistentGraphTheme>(settings.value.storageKey + '-theme', graph.theme.value)
  const settingsStorage = useLocalStorage<PersistentGraphSettings>(settings.value.storageKey + '-settings', settings.value)

  const trackChanges = () => {
    nodeStorage.value = graph.nodes.value
    edgeStorage.value = graph.edges.value
    if (settings.value.trackTheme) {
      themeStorage.value = graph.theme.value
    }
    if (settings.value.trackSettings) {
      settingsStorage.value = settings.value
    }
  }

  onMounted(() => {
    for (const node of nodeStorage.value) {
      graph.addNode(node, false)
    }
    for (const edge of edgeStorage.value) {
      graph.addEdge(edge)
    }

    graph.theme.value = Object.assign(graph.theme.value, themeStorage.value)
    settings.value = Object.assign(settings.value, settingsStorage.value)

    graph.subscribe('onStructureChange', trackChanges)
    graph.subscribe('onNodeDrop', trackChanges)
    graph.subscribe('onGraphReset', trackChanges)
    graph.subscribe('onThemeChange', trackChanges)
    graph.subscribe('onSettingsChange', trackChanges)
  })

  return {
    ...graph,
    settings,
  }
}