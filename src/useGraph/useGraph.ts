import { onMounted, type Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { themes } from './themes'
import type { GNode, GEdge } from './types'
import { useDraggableGraph, type DraggableGraphOptions } from './useDraggableGraph'
import { useGraph } from './useGraphBase'
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
  options: Partial<DraggableGraphOptions> = {}
) => useDraggableGraph(canvas, {
  ...themes.weird,
  ...options,
})

export type Graph = ReturnType<typeof useGraph>