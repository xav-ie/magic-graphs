import { ref, readonly } from 'vue'
import type { Ref } from 'vue'
import type { GNode, GraphOptions } from '@graph/types'
import { useFocusGraph } from './useFocusGraph';

export const useDraggableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {

  const graph = useFocusGraph(canvas, options)

  const nodeBeingDragged = ref<GNode | undefined>()
  const startingCoordinatesOfDrag = ref<{ x: number, y: number } | undefined>()

  const beginDrag = (ev: MouseEvent) => {
    if (!graph.settings.value.draggable) return
    const { offsetX, offsetY } = ev;
    startingCoordinatesOfDrag.value = { x: offsetX, y: offsetY }
    const node = graph.getNodeByCoordinates(offsetX, offsetY);
    if (!node) return
    nodeBeingDragged.value = node;
    graph.emit('onNodeDragStart', node)
  }

  const drop = () => {
    if (!nodeBeingDragged.value) return
    graph.emit('onNodeDrop', nodeBeingDragged.value)
    nodeBeingDragged.value = undefined;
    setTimeout(graph.repaint('draggable-graph/drop'), 10)
  }

  const drag = (ev: MouseEvent) => {
    if (
      !nodeBeingDragged.value ||
      !startingCoordinatesOfDrag.value ||
      !graph.settings.value.draggable
    ) return
    const { offsetX, offsetY } = ev;
    const dx = offsetX - startingCoordinatesOfDrag.value.x;
    const dy = offsetY - startingCoordinatesOfDrag.value.y;
    graph.moveNode(
      nodeBeingDragged.value.id,
      nodeBeingDragged.value.x + dx,
      nodeBeingDragged.value.y + dy
    );
    startingCoordinatesOfDrag.value = { x: offsetX, y: offsetY }
  }

  graph.subscribe('onMouseDown', beginDrag)
  graph.subscribe('onMouseUp', drop)
  graph.subscribe('onMouseMove', drag)

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.draggable === false) {
      nodeBeingDragged.value = undefined
    }
  })

  return {
    ...graph,
    nodeBeingDragged: readonly(nodeBeingDragged),
  }
}
