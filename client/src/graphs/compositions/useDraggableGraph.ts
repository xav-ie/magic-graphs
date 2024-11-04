import {
  ref,
  readonly,
  watchEffect
} from 'vue'
import type { Ref } from 'vue'
import { generateSubscriber } from '@graph/events';
import type { BaseGraphEvents, MappingsToEventBus } from '@graph/events';
import type { GNode, GraphOptions } from '@graph/types'
import { useFocusGraph } from './useFocusGraph';
import { DEFAULT_DRAGGABLE_SETTINGS } from '@graph/settings';
import type { DraggableGraphSettings } from '@graph/settings';

export type DraggableGraphEvents = BaseGraphEvents & {
  onNodeDragStart: (node: GNode) => void;
  onNodeDrop: (node: GNode) => void;
}

export type DraggableGraphOptions = GraphOptions<DraggableGraphSettings>

export const useDraggableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<DraggableGraphOptions> = {},
) => {

  const graph = useFocusGraph(canvas, options)

  const settings = ref<DraggableGraphSettings>(Object.assign(graph.settings.value, {
    ...DEFAULT_DRAGGABLE_SETTINGS,
    ...options.settings,
  }))

  const eventBus: MappingsToEventBus<DraggableGraphEvents> = Object.assign(graph.eventBus, {
    onNodeDragStart: new Set(),
    onNodeDrop: new Set(),
  })

  const { subscribe, unsubscribe, emit } = generateSubscriber(eventBus)

  const nodeBeingDragged = ref<GNode | undefined>()
  const startingCoordinatesOfDrag = ref<{ x: number, y: number } | undefined>()

  const beginDrag = (ev: MouseEvent) => {
    if (!settings.value.draggable) return
    const { offsetX, offsetY } = ev;
    startingCoordinatesOfDrag.value = { x: offsetX, y: offsetY }
    const node = graph.getNodeByCoordinates(offsetX, offsetY);
    if (!node) return
    nodeBeingDragged.value = node;
    emit('onNodeDragStart', node)
  }

  const drop = () => {
    if (!nodeBeingDragged.value) return
    emit('onNodeDrop', nodeBeingDragged.value)
    nodeBeingDragged.value = undefined;
    setTimeout(graph.repaint('draggable-graph/drop'), 10)
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

  subscribe('onSettingsChange', (diff) => {
    if (diff.draggable === false) {
      nodeBeingDragged.value = undefined
    }
  })

  return {
    ...graph,
    nodeBeingDragged: readonly(nodeBeingDragged),

    eventBus,
    subscribe,
    unsubscribe,
    emit,

    settings,
  }
}
