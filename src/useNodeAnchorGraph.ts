import { getValue, generateSubscriber } from "./useGraphHelpers";
import { useDraggableGraph, type MappingsWithDragEvents } from "./useDraggableGraph";
import type { GNode, NodeGetterOrValue } from "./useGraphTypes";
import { type GraphOptions, type MappingsToEventBus } from "./useGraphBase";
import { ref, readonly, type Ref } from 'vue'
import { drawCircleWithCtx } from "./shapeHelpers";
import { isInCircle } from "./hitboxHelpers";

export type NodeAnchor = {
  x: number,
  y: number,
  direction: 'north' | 'east' | 'south' | 'west',
}

export type AnchorNodeGraphOptions<T extends GraphOptions = GraphOptions> = T & {
  nodeAnchorRadius: NodeGetterOrValue<number>;
  nodeAnchorColor: NodeGetterOrValue<string>;
  nodeAnchorColorWhenParentFocused: NodeGetterOrValue<string>;
}

type WithNodeAnchorEvents<T extends MappingsWithDragEvents> = T & {
  onNodeAnchorDragStart: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
  onNodeAnchorDrop: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
}

type MappingsWithNodeAnchorEvents = WithNodeAnchorEvents<MappingsWithDragEvents>

export const useDraggableNodeAnchorGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<AnchorNodeGraphOptions> = {}
) => {

  const graph = useDraggableGraph(canvas, options)
  const parentNode = ref<GNode | undefined>()
  const activeAnchor = ref<NodeAnchor | undefined>()

  const eventBus: MappingsToEventBus<MappingsWithNodeAnchorEvents> = {
    ...graph.eventBus,
    onNodeAnchorDragStart: [],
    onNodeAnchorDrop: [],
  }

  const subscribe = generateSubscriber(eventBus)

  const {
    // default mini node radius scales at 2 root r
    nodeAnchorRadius: anchorRadius = (node) => Math.sqrt(getValue(graph.options.value.nodeRadius, node)) * 2,
    nodeAnchorColor: anchorColor = 'black',
    nodeAnchorColorWhenParentFocused: anchorColorWhenParentFocused = graph.options.value.nodeFocusBorderColor,
  } = options

  const drawAnchors = (ctx: CanvasRenderingContext2D) => {
    if (!parentNode.value || graph.nodeBeingDragged.value) return

    const anchorColorVal = getValue(anchorColor, parentNode.value)
    const anchorColorWhenParentFocusedVal = getValue(anchorColorWhenParentFocused, parentNode.value)
    const isParentFocused = parentNode.value.id === graph.getFocusedNodeId()
    const color = isParentFocused ? anchorColorWhenParentFocusedVal : anchorColorVal

    const anchors = getAnchors(parentNode.value)
    const drawCircle = drawCircleWithCtx(ctx)

    const radius = getValue(anchorRadius, parentNode.value)

    for (const anchor of anchors) {
      const { x, y } = anchor
      const circle = { at: { x, y }, radius, color }
      if (activeAnchor.value && activeAnchor.value.direction === anchor.direction) {
        circle.at.x = activeAnchor.value.x
        circle.at.y = activeAnchor.value.y
      }
      drawCircle(circle)
    }
  }

  const getAnchors = (node: GNode): NodeAnchor[] => {
    const anchorRadiusVal = getValue(anchorRadius, node)
    const nodeRadiusVal = getValue(graph.options.value.nodeRadius, node)
    const nodeBorderWidthVal = getValue(graph.options.value.nodeBorderWidth, node)
    const offset = nodeRadiusVal - (anchorRadiusVal / 3) + (nodeBorderWidthVal / 2)
    return [
      {
        x: node.x,
        y: node.y - offset,
        direction: 'north',
      },
      {
        x: node.x + offset,
        y: node.y,
        direction: 'east',
      },
      {
        x: node.x,
        y: node.y + offset,
        direction: 'south',
      },
      {
        x: node.x - offset,
        y: node.y,
        direction: 'west',
      },
    ]
  }

  const getAnchor = (node: GNode, x: number, y: number) => {
    const anchors = getAnchors(node)
    return anchors.find((anchor) => {
      const point = { x, y }
      return isInCircle(point, {
        x: anchor.x,
        y: anchor.y,
        radius: getValue(anchorRadius, node),
      })
    })
  }

  subscribe('onMouseMove', (ev) => {
    if (activeAnchor.value) return
    const node = graph.getNodeByCoordinates(ev.offsetX, ev.offsetY)
    if (!node && parentNode.value) {
      const hoveredAnchor = getAnchor(parentNode.value, ev.offsetX, ev.offsetY)
      if (hoveredAnchor) return
    }
    parentNode.value = node
  })

  subscribe('onMouseDown', (ev) => {
    if (!parentNode.value) return
    const anchor = getAnchor(parentNode.value, ev.offsetX, ev.offsetY)
    if (!anchor) return
    activeAnchor.value = anchor
    const isParentAlreadyFocused = parentNode.value.id === graph.getFocusedNodeId()
    queueMicrotask(() => {
      if (isParentAlreadyFocused) return
      graph.setFocusedNode(undefined)
    })
    eventBus.onNodeAnchorDragStart.forEach(fn => fn(parentNode.value, anchor))
    graph.draggingEnabled.value = false
  })

  subscribe('onMouseMove', (ev) => {
    if (!activeAnchor.value) return
    activeAnchor.value.x = ev.offsetX
    activeAnchor.value.y = ev.offsetY
  })

  subscribe('onMouseUp', () => {
    if (!activeAnchor.value) return
    eventBus.onNodeAnchorDrop.forEach(fn => fn(parentNode.value, activeAnchor.value))
    activeAnchor.value = undefined
    parentNode.value = undefined
    graph.draggingEnabled.value = true
  })

  subscribe('onRepaint', drawAnchors)

  subscribe('onNodeRemoved', (node) => {
    if (parentNode.value?.id === node.id) parentNode.value = undefined
  })

  return {
    ...graph,
    eventBus,
    subscribe,
    activeNodeAnchor: readonly(activeAnchor),
  }
}