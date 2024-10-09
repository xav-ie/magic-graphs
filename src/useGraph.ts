import { type Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { themes } from './themes'
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

export const usePersistentDraggableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  storageKey: string,
  options: Partial<GraphOptions> = {}
) => {

  const graph = useDraggableGraph(canvas, options)

  // TODO: load the nodes and edges in properly and not just by mem ref
  useLocalStorage(storageKey + '-nodes', graph.nodes)
  useLocalStorage(storageKey + '-edges', graph.edges)

  return graph
}

export type Graph = ReturnType<typeof useGraph>