import { getValue, generateSubscriber } from "./useGraphHelpers";
import { useDraggableGraph, type MappingsWithDragEvents } from "./useDraggableGraph";
import type { SchemaItem, GNode, NodeGetterOrValue, MaybeGetter } from "./types";
import { type GraphOptions, type MappingsToEventBus } from "./useGraphBase";
import { ref, readonly, type Ref } from 'vue'
import { hitboxes } from "../shapes/hitboxes";
import type { Circle } from "@/shapes/types";

export type NodeAnchor = {
  x: number,
  y: number,
  direction: 'north' | 'east' | 'south' | 'west',
}

export type AnchorNodeGraphOptions<T extends GraphOptions = GraphOptions> = T & {
  nodeAnchorRadius: NodeGetterOrValue<number>;
  nodeAnchorColor: NodeGetterOrValue<string>;
  nodeAnchorColorWhenParentFocused: NodeGetterOrValue<string>;
  linkPreviewColor: MaybeGetter<string, [GNode, NodeAnchor]>;
  linkPreviewWidth: MaybeGetter<number, [GNode, NodeAnchor]>;
}

type WithNodeAnchorEvents<T extends MappingsWithDragEvents> = T & {
  onNodeAnchorDragStart: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
  onNodeAnchorDrop: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
}

type MappingsWithNodeAnchorEvents = WithNodeAnchorEvents<MappingsWithDragEvents>

export const useDraggableNodeAnchorGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<AnchorNodeGraphOptions> = {},
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
    // default anchor radius scales with respect to its parent at ceil(2 root r)
    nodeAnchorRadius: anchorRadius = (node) => Math.ceil(Math.sqrt(getValue(graph.options.value.nodeRadius, node)) * 2),
    nodeAnchorColor: anchorColor = 'black',
    nodeAnchorColorWhenParentFocused: anchorColorWhenParentFocused = graph.options.value.nodeFocusBorderColor,
    linkPreviewColor = getValue(graph.options.value.edgeColor, graph.edges.value[0]),
    linkPreviewWidth = getValue(graph.options.value.edgeWidth, graph.edges.value[0]),
  } = options

  const getAnchorSchematics = (): Circle[] => {
    if (!parentNode.value || graph.nodeBeingDragged.value) return []

    const anchorColorVal = getValue(anchorColor, parentNode.value)
    const anchorColorWhenParentFocusedVal = getValue(anchorColorWhenParentFocused, parentNode.value)
    const isParentFocused = parentNode.value.id === graph.getFocusedNodeId()
    const color = isParentFocused ? anchorColorWhenParentFocusedVal : anchorColorVal

    const anchors = getAnchors(parentNode.value)
    const radius = getValue(anchorRadius, parentNode.value)

    const circles = []
    for (const anchor of anchors) {
      const { x, y } = anchor
      const circle = { at: { x, y }, radius, color }
      if (activeAnchor.value && activeAnchor.value.direction === anchor.direction) {
        circle.at.x = activeAnchor.value.x
        circle.at.y = activeAnchor.value.y
      }
      circles.push(circle)
    }
    return circles
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
      const { isInCircle } = hitboxes(point)
      return isInCircle({
        at: { x: anchor.x, y: anchor.y },
        radius: getValue(anchorRadius, node),
      })
    })
  }

  const getLinkPreviewSchematic = () => {
    if (!parentNode.value || !activeAnchor.value) return
    const { x, y } = activeAnchor.value
    const start = { x: parentNode.value.x, y: parentNode.value.y }
    const end = { x, y }
    const color = getValue(linkPreviewColor, parentNode.value, activeAnchor.value)
    const width = getValue(linkPreviewWidth, parentNode.value, activeAnchor.value)
    return {
      id: 'link-preview',
      graphType: 'link-preview',
      schemaType: 'line',
      schema: { start, end, color, width },
    } as const
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
    graph.draggingEnabled.value = true
  })

  graph.updateAggregator.push((aggregator) => {
    const anchors = getAnchorSchematics()
    for (const anchor of anchors) {
      aggregator.push({
        id: 'anchor',
        graphType: 'node-anchor',
        schemaType: 'circle',
        schema: anchor,
      })
    }
    return aggregator
  })

  graph.updateAggregator.push((aggregator) => {
    const linkPreview = getLinkPreviewSchematic()
    if (!linkPreview) return aggregator
    aggregator.push(linkPreview)
    return aggregator
  })

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