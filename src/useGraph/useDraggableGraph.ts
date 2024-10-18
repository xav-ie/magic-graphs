import {
  ref,
  watch,
  readonly,
  type Ref
} from 'vue'
import {
  useGraph,
  type UseGraphEventBusCallbackMappings,
  type MappingsToEventBus
} from './useGraphBase'
import { generateSubscriber } from './useGraphHelpers';
import type { GraphThemes } from './themes';
import type { GNode } from './types'

export type GraphEventsWithDrag = UseGraphEventBusCallbackMappings & {
  onNodeDragStart: (node: GNode) => void;
  onNodeDrop: (node: GNode) => void;
}

export type GraphThemeWithDrag = GraphThemes

// export type

export const useDraggableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphThemeWithDrag> = {},
) => {

  const graph = useGraph(canvas, options)
  const draggingEnabled = ref(true)

  const eventBus: MappingsToEventBus<GraphEventsWithDrag> = {
    ...graph.eventBus,
    onNodeDragStart: [],
    onNodeDrop: [],
  }

  const subscribe = generateSubscriber(eventBus)

  const nodeBeingDragged = ref<GNode | undefined>()
  const startingCoordinatesOfDrag = ref<{ x: number, y: number } | undefined>()

  const beginDrag = (ev: MouseEvent) => {
    if (!draggingEnabled.value) return
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
      !draggingEnabled.value
    ) return
    const { offsetX, offsetY } = ev;
    const dx = offsetX - startingCoordinatesOfDrag.value.x;
    const dy = offsetY - startingCoordinatesOfDrag.value.y;
    graph.moveNode(nodeBeingDragged.value.id, nodeBeingDragged.value.x + dx, nodeBeingDragged.value.y + dy);
    startingCoordinatesOfDrag.value = { x: offsetX, y: offsetY }
  }

  watch(draggingEnabled, () => {
    nodeBeingDragged.value = undefined
  })

  subscribe('onMouseDown', beginDrag)
  subscribe('onMouseUp', drop)
  subscribe('onMouseMove', drag)

  return {
    ...graph,
    eventBus,
    subscribe,
    draggingEnabled,
    nodeBeingDragged: readonly(nodeBeingDragged),
  }
}
