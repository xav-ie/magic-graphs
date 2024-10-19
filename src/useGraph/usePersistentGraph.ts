import { type Ref, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { GNode, GEdge } from '@/useGraph/types'
import { useUserEditableGraph, type UserEditableGraphOptions } from './useUserEditableGraph'

export const usePersistentGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  storageKey: string,
  options: Partial<UserEditableGraphOptions> = {}
) => {

  const graph = useUserEditableGraph(canvas, options)

  const nodeStorage = useLocalStorage<GNode[]>(storageKey + '-nodes', [])
  const edgeStorage = useLocalStorage<GEdge[]>(storageKey + '-edges', [])

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

  return graph
}