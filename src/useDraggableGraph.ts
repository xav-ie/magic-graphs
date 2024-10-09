import {
  ref,
  watch,
  readonly,
  type Ref
} from 'vue'
import {
  useGraph,
  type GraphOptions,
  type UseGraphEventBusCallbackMappings,
  type MappingsToEventBus
} from './useGraphBase'
import { generateSubscriber } from './useGraphHelpers';
import type { Node } from './useGraphTypes'

export type WithDragEvents<T extends UseGraphEventBusCallbackMappings> = T & {
  onNodeDragStart: (node: Node) => void;
  onNodeDrop: (node: Node) => void;
}

export type MappingsWithDragEvents = WithDragEvents<UseGraphEventBusCallbackMappings>

export const useDraggableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {}
) => {

  const graph = useGraph(canvas, options)
  const draggingEnabled = ref(true)

  const eventBus: MappingsToEventBus<MappingsWithDragEvents> = {
    ...graph.eventBus,
    onNodeDragStart: [],
    onNodeDrop: [],
  }

  const subscribe = generateSubscriber(eventBus)

  const nodeBeingDragged = ref<Node | undefined>()
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

  subscribe('onNodeHoverChange', (node) => {
    if (!node || nodeBeingDragged.value) return
    const nodeIndex = graph.nodes.value.findIndex(n => n.id === node.id)
    if (nodeIndex === -1) return
    graph.nodes.value.splice(nodeIndex, 1)
    graph.nodes.value.push(node)
  })

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
    nodeBeingDragged: readonly(nodeBeingDragged),
    draggingEnabled,
  }
}
