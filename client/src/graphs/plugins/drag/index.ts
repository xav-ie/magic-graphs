import { ref, computed } from 'vue'
import type { GraphMouseEvent } from '@graph/base/types';
import type { ActiveDragNode } from './types';
import type { BaseGraph } from '@graph/base';
import type { NodeAnchorPlugin } from '../anchors';

export const useNodeDrag = (graph: BaseGraph & NodeAnchorPlugin) => {
  const activeDragNode = ref<ActiveDragNode | undefined>()

  const beginDrag = ({ items, coords }: GraphMouseEvent) => {
    const topItem = items.at(-1)
    if (!topItem || topItem.graphType !== 'node') return

    graph.settings.value.nodeAnchors = false

    const node = graph.getNode(topItem.id)
    if (!node) return

    activeDragNode.value = { node, coords }
    graph.emit('onNodeDragStart', node)
  }

  const drop = () => {
    if (!activeDragNode.value) return
    graph.emit('onNodeDrop', activeDragNode.value.node)
    graph.settings.value.nodeAnchors = true
    graph.nodeAnchors.setParentNode(activeDragNode.value.node.id)
    activeDragNode.value = undefined;
  }

  const drag = ({ coords: evCoords }: GraphMouseEvent) => {
    if (!activeDragNode.value) return
    const { node, coords } = activeDragNode.value;
    const dx = evCoords.x - coords.x;
    const dy = evCoords.y - coords.y;
    graph.moveNode(node.id, {
      x: node.x + dx,
      y: node.y + dy
    });
    activeDragNode.value.coords = evCoords;
  }

  const activate = () => {
    graph.subscribe('onMouseDown', beginDrag)
    graph.subscribe('onMouseUp', drop)
    graph.subscribe('onMouseMove', drag)
  }

  const deactivate = () => {
    graph.unsubscribe('onMouseDown', beginDrag)
    graph.unsubscribe('onMouseUp', drop)
    graph.unsubscribe('onMouseMove', drag)
    if (activeDragNode.value) drop()
  }

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.draggable === false) deactivate()
    else if (diff.draggable === true) activate()
  })

  if (graph.settings.value.draggable) activate()

  return {
    /**
     * the node that is currently being dragged or undefined if no node is being dragged
     */
    activeDragNode: computed(() => activeDragNode.value?.node),
  }
}

export type GraphNodeDragControls = ReturnType<typeof useNodeDrag>
