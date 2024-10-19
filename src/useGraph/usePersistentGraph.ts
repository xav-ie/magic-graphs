import { type Ref, onMounted, ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { GNode, GEdge, GraphOptions } from '@/useGraph/types'
import {
  useUserEditableGraph,
  type UserEditableGraphOptions,
  type UserEditableGraphSettings,
  type UserEditableGraphTheme
} from './useUserEditableGraph'

export type PersistentGraphTheme = UserEditableGraphTheme
export type PersistentGraphSettings = UserEditableGraphSettings & {
  storageKey: string
}

export type PersistentGraphOptions = GraphOptions<UserEditableGraphTheme, PersistentGraphSettings>

export const defaultPersistentGraphSettings = {
  storageKey: 'graph',
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

  const trackChanges = () => {
    nodeStorage.value = graph.nodes.value
    edgeStorage.value = graph.edges.value
  }

  onMounted(() => {
    for (const node of nodeStorage.value) {
      graph.addNode(node, false)
    }
    for (const edge of edgeStorage.value) {
      graph.addEdge(edge)
    }

    graph.subscribe('onStructureChange', trackChanges)
    graph.subscribe('onNodeDrop', trackChanges)
    graph.subscribe('onGraphReset', trackChanges)
  })

  return {
    ...graph,
    settings,
  }
}