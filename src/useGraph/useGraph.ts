import { onMounted, type Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { themes } from './themes'
import type { GNode, GEdge } from './types'
import { useDraggableGraph } from './useDraggableGraph'
import { useGraph, type GraphOptions } from './useGraphBase'
import { useUserEditableGraph, type UserEditableGraphOptions } from './useUserEditableGraph'

export const useDarkUserEditableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => useUserEditableGraph(canvas, {
  ...themes.dark,
  ...options,
})

export const useWeirdDraggableGraph = (
  canvas: Ref<HTMLCanvasElement>,
  options: Partial<GraphOptions> = {}
) => useDraggableGraph(canvas, {
  ...themes.weird,
  ...options,
})

export const useDarkPersistentUserEditableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  storageKey: string,
  options: Partial<UserEditableGraphOptions> = {}
) => {

  const graph = useDarkUserEditableGraph(canvas, options)

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

  graph.subscribe('onClick', (ev) => {
    console.log(graph.getDrawItemsByCoordinates(ev.offsetX, ev.offsetY))
  })

  return graph
}

export type Graph = ReturnType<typeof useGraph>