import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { GNode, GraphOptions } from '@graph/types'
import { useFocusGraph } from '@graph/compositions/useFocusGraph';
import type { ActiveDragNode } from './types';

export const useDraggableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {

  const graph = useFocusGraph(canvas, options)

  const activeDragNode = ref<ActiveDragNode | undefined>()

  const beginDrag = (ev: MouseEvent) => {
    const { offsetX, offsetY } = ev;
    const node = graph.getNodeByCoordinates(offsetX, offsetY);
    if (!node) return
    activeDragNode.value = {
      node,
      startingCoordinates: { x: offsetX, y: offsetY },
    }
    graph.emit('onNodeDragStart', node)
  }

  const drop = () => {
    if (!activeDragNode.value) return
    graph.emit('onNodeDrop', activeDragNode.value.node)
    activeDragNode.value = undefined;
    setTimeout(graph.repaint('draggable-graph/drop'), 10)
  }

  const drag = (ev: MouseEvent) => {
    if (!activeDragNode.value) return
    const { offsetX, offsetY } = ev;
    const { node, startingCoordinates } = activeDragNode.value;
    const dx = offsetX - startingCoordinates.x;
    const dy = offsetY - startingCoordinates.y;
    graph.moveNode(node.id, {
      x: node.x + dx,
      y: node.y + dy
    });
    activeDragNode.value.startingCoordinates = { x: offsetX, y: offsetY }
  }

  const enableDrag = () => {
    graph.subscribe('onMouseDown', beginDrag)
    graph.subscribe('onMouseUp', drop)
    graph.subscribe('onMouseMove', drag)
  }

  const disableDrag = () => {
    graph.unsubscribe('onMouseDown', beginDrag)
    graph.unsubscribe('onMouseUp', drop)
    graph.unsubscribe('onMouseMove', drag)
    if (activeDragNode.value) drop()
  }

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.draggable === false) disableDrag()
    else if (diff.draggable === true) enableDrag()
  })

  if (graph.settings.value.draggable) enableDrag()

  return {
    ...graph,

    /**
     * the node that is currently being dragged or undefined if no node is being dragged
     */
    activeDragNode: computed(() => activeDragNode.value?.node),
  }
}
