import {
  ref,
  readonly,
  type Ref,
  watchEffect
} from 'vue'
import {
  useBaseGraph,
  type BaseGraphEvents,
  type BaseGraphSettings,
} from './useBaseGraph'
import { generateSubscriber } from './helpers';
import type { BaseGraphTheme } from './themes';
import type { GNode, GraphOptions, MappingsToEventBus } from './types'

export type DraggableGraphEvents = BaseGraphEvents & {
  onNodeDragStart: (node: GNode) => void;
  onNodeDrop: (node: GNode) => void;
}

export type DraggableGraphTheme = BaseGraphTheme
export type DraggableGraphSettings = BaseGraphSettings & {
  draggable: boolean;
}

export type DraggableGraphOptions = GraphOptions<DraggableGraphTheme, DraggableGraphSettings>

export const defaultDraggableGraphSettings = {
  draggable: true,
} as const

export const useDraggableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<DraggableGraphOptions> = {},
) => {

  const graph = useBaseGraph(canvas, options)

  const settings = ref<DraggableGraphSettings>(Object.assign(graph.settings.value, {
    ...defaultDraggableGraphSettings,
    ...options.settings,
  }))

  const eventBus: MappingsToEventBus<DraggableGraphEvents> = Object.assign(graph.eventBus, {
    onNodeDragStart: [],
    onNodeDrop: [],
  })

  const { subscribe, unsubscribe } = generateSubscriber(eventBus)

  const nodeBeingDragged = ref<GNode | undefined>()
  const startingCoordinatesOfDrag = ref<{ x: number, y: number } | undefined>()

  const beginDrag = (ev: MouseEvent) => {
    if (!settings.value.draggable) return
    const { offsetX, offsetY } = ev;
    startingCoordinatesOfDrag.value = { x: offsetX, y: offsetY }
    const node = graph.getNodeByCoordinates(offsetX, offsetY);
    if (!node) return
    nodeBeingDragged.value = node;
    eventBus.onNodeDragStart.forEach(fn => fn(node))
  }

  const drop = () => {
    if (!nodeBeingDragged.value) return
    eventBus.onNodeDrop.forEach(fn => fn(nodeBeingDragged.value))
    nodeBeingDragged.value = undefined;
  }

  const drag = (ev: MouseEvent) => {
    if (
      !nodeBeingDragged.value ||
      !startingCoordinatesOfDrag.value ||
      !settings.value.draggable
    ) return
    const { offsetX, offsetY } = ev;
    const dx = offsetX - startingCoordinatesOfDrag.value.x;
    const dy = offsetY - startingCoordinatesOfDrag.value.y;
    graph.moveNode(nodeBeingDragged.value.id, nodeBeingDragged.value.x + dx, nodeBeingDragged.value.y + dy);
    startingCoordinatesOfDrag.value = { x: offsetX, y: offsetY }
  }

  subscribe('onMouseDown', beginDrag)
  subscribe('onMouseUp', drop)
  subscribe('onMouseMove', drag)

  watchEffect(() => {
    if (!settings.value.draggable) {
      nodeBeingDragged.value = undefined
    }
  })

  return {
    ...graph,
    nodeBeingDragged: readonly(nodeBeingDragged),

    eventBus,
    subscribe,
    unsubscribe,

    settings,
  }
}
