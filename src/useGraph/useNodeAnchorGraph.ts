/**
 * @module useNodeAnchorGraph
 *
 * Helpful terms:
 * - Parent Node: The node that the anchors spawn around.
 * - Node Anchor/Anchor: A draggable handle that spawns around the parent node.
 * - Link Preview: The line that appears between the parent node and the anchor when the anchor is being dragged.
 * - Active Anchor: The anchor that is currently being dragged.
 * - Anchor Node Graph: A graph that supports the creation and event propagation of anchors around nodes.
 */

import { getValue, generateSubscriber, prioritizeNode } from "./useGraphHelpers";
import { useDraggableGraph, type DraggableGraphEvents, type DraggableGraphSettings, type DraggableGraphTheme } from "./useDraggableGraph";
import type { SchemaItem, LineSchemaItem, GNode, GEdge, NodeGetterOrValue, MaybeGetter, GraphOptions, MappingsToEventBus } from "./types";
import type { BaseGraphTheme } from "./themes";
import { ref, readonly, type Ref, watch } from 'vue'
import { hitboxes } from "../shapes/hitboxes";
import type { Circle } from "@/shapes/types";

export type NodeAnchor = {
  /**
   * @description the x-coordinate of the anchor
   */
  x: number,
  /**
   * @description the y-coordinate of the anchor
   */
  y: number,
  /**
   * @description the direction of the anchor relative to the parent node
   */
  direction: 'north' | 'east' | 'south' | 'west',
}

type DefaultNodeGraphThemeGetter = <T extends BaseGraphTheme>(theme: T, edges: GEdge[]) => ExclusiveNodeAnchorGraphTheme

/**
 * @description default options for the anchor node graph
 * @param theme - the options passed to the base useGraph composition function
 * @param edges - the edges of the graph
 * @returns the default options for the anchor node graph
 */
const defaultNodeAnchorTheme: DefaultNodeGraphThemeGetter = <T extends BaseGraphTheme>(
  theme: T,
  edges: GEdge[],
) => ({
  /**
   * @description calculates the radius of the default node anchor - scales with 2 * sqrt(nodeSize)
   * @param node - the parent node of the anchor
   * @returns the radius of the node anchor
   */
  nodeAnchorRadius: (node: GNode) => {
    const nodeSize = getValue(theme.nodeSize, node)
    return Math.ceil(Math.sqrt(nodeSize) * 2)
  },
  /**
   * the color of the node anchor
   */
  nodeAnchorColor: 'black',
  /**
   * the color of the node anchor when the parent node is focused
   */
  nodeAnchorColorWhenParentFocused: theme.nodeFocusBorderColor,
  /**
   * the color of the link preview
   */
  linkPreviewColor: getValue(theme.edgeColor, edges[0]),
  /**
   * the width of the link preview
   */
  linkPreviewWidth: getValue(theme.edgeWidth, edges[0]),
})

export type ExclusiveNodeAnchorGraphTheme = {
  nodeAnchorRadius: NodeGetterOrValue<number>;
  nodeAnchorColor: NodeGetterOrValue<string>;
  nodeAnchorColorWhenParentFocused: NodeGetterOrValue<string>;
  linkPreviewColor: MaybeGetter<string, [GNode, NodeAnchor]>;
  linkPreviewWidth: MaybeGetter<number, [GNode, NodeAnchor]>;
}

export type NodeAnchorGraphTheme = DraggableGraphTheme & ExclusiveNodeAnchorGraphTheme

export type NodeAnchorGraphEvents = DraggableGraphEvents & {
  /**
   * @description event fired when the user initiates a drag on a node anchor
   * @param parentNode - the parent node of the anchor
   * @param nodeAnchor - the anchor being dragged
   */
  onNodeAnchorDragStart: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
  /**
   * @description event fired when the user drops a node anchor
   * @param parentNode - the parent node of the anchor
   * @param nodeAnchor - the anchor being dropped
   */
  onNodeAnchorDrop: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
}

const defaultNodeAnchorSettings = {
  nodeAnchors: true,
} as const

export type NodeAnchorGraphSettings = DraggableGraphSettings & {
  nodeAnchors: boolean;
}

export type NodeAnchorGraphOptions = GraphOptions<NodeAnchorGraphTheme, NodeAnchorGraphSettings>

/**
 * @requires a draggable graph interface.
 *
 * Node anchors provide an additional layer of interaction by allowing nodes to spawn draggable anchors
 * when hovered over.
 *
 * Extends the event bus to support child composition functions subscribing to events like `onNodeAnchorDragStart`
 * and `onNodeAnchorDrop` for user-driven anchor interactions.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element on which to render the graph.
 * @param {Object} options - The configuration options for the anchor node graph.
 * @returns {Object} The draggable graph interface with additional node anchor functionality, options, and events.
 */
export const useNodeAnchorGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<NodeAnchorGraphOptions> = {},
) => {

  const graph = useDraggableGraph(canvas, options)

  const theme = ref<NodeAnchorGraphTheme>({
    ...defaultNodeAnchorTheme(graph.theme.value, graph.edges.value),
    ...graph.theme.value,
  })

  const settings = ref<NodeAnchorGraphSettings>(Object.assign(graph.settings.value, {
    ...defaultNodeAnchorSettings,
    ...options.settings,
  }))

  const eventBus: MappingsToEventBus<NodeAnchorGraphEvents> = {
    ...graph.eventBus,
    onNodeAnchorDragStart: [],
    onNodeAnchorDrop: [],
  }

  const subscribe = generateSubscriber(eventBus)

  const parentNode = ref<GNode | undefined>()
  const activeAnchor = ref<NodeAnchor | undefined>()

  watch(settings, (newSettings) => {
    // add node anchor deactivation logic
  }, { deep: true })

  const getAnchorSchematics = () => {
    if (
      !parentNode.value ||
      graph.nodeBeingDragged.value ||
      !settings.value.nodeAnchors
    ) return []

    const {
      nodeAnchorRadius: anchorRadius,
      nodeAnchorColor: anchorColor,
      nodeAnchorColorWhenParentFocused: anchorColorWhenParentFocused,
    } = theme.value

    const anchorColorVal = getValue(anchorColor, parentNode.value)
    const anchorColorWhenParentFocusedVal = getValue(anchorColorWhenParentFocused, parentNode.value)
    const isParentFocused = parentNode.value.id === graph.focusedId.value
    const color = isParentFocused ? anchorColorWhenParentFocusedVal : anchorColorVal

    const anchors = getAnchors(parentNode.value)
    const radius = getValue(anchorRadius, parentNode.value)

    const circles: Circle[] = []
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

  /**
   * @param {GNode} node - the parent node of the anchor
   * @returns an array of anchors for the given node
   */
  const getAnchors = (node: GNode): NodeAnchor[] => {
    const anchorRadiusVal = getValue(theme.value.nodeAnchorRadius, node)
    const nodeSizeVal = getValue(graph.theme.value.nodeSize, node)
    const nodeBorderWidthVal = getValue(graph.theme.value.nodeBorderWidth, node)
    const offset = nodeSizeVal - (anchorRadiusVal / 3) + (nodeBorderWidthVal / 2)
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

  /**
   * @param {GNode} node - the parent node of the anchor
   * @param {number} x - the x-coordinate to check
   * @param {number} y - the y-coordinate to check
   * @returns the anchor at the given coordinates if it exists or undefined
   */
  const getAnchor = (node: GNode, x: number, y: number) => {
    const anchors = getAnchors(node)
    return anchors.find((anchor) => {
      const point = { x, y }
      const { isInCircle } = hitboxes(point)
      return isInCircle({
        at: { x: anchor.x, y: anchor.y },
        radius: getValue(theme.value.nodeAnchorRadius, node),
      })
    })
  }

  const getLinkPreviewSchematic = () => {
    if (!parentNode.value || !activeAnchor.value) return
    const { x, y } = activeAnchor.value
    const start = { x: parentNode.value.x, y: parentNode.value.y }
    const end = { x, y }
    const { linkPreviewColor, linkPreviewWidth } = theme.value
    const color = getValue(linkPreviewColor, parentNode.value, activeAnchor.value)
    const width = getValue(linkPreviewWidth, parentNode.value, activeAnchor.value)
    const schema: Omit<LineSchemaItem, 'priority'> = {
      id: 'link-preview',
      graphType: 'link-preview',
      schemaType: 'line',
      schema: { start, end, color, width },
    }
    return schema
  }

  /**
   * @description updates which node is the parent node based on the mouse event
   * @param {MouseEvent} ev - the mouse event to update the parent node
   */
  const updateParentNode = (ev: MouseEvent) => {
    if (activeAnchor.value) return
    const node = graph.getNodeByCoordinates(ev.offsetX, ev.offsetY)
    if (!node && parentNode.value) {
      const hoveredAnchor = getAnchor(parentNode.value, ev.offsetX, ev.offsetY)
      if (hoveredAnchor) return
    }
    parentNode.value = node
  }

  subscribe('onMouseMove', updateParentNode)

  subscribe('onMouseDown', (ev) => {
    if (!parentNode.value) return
    const anchor = getAnchor(parentNode.value, ev.offsetX, ev.offsetY)
    if (!anchor) return
    activeAnchor.value = anchor
    eventBus.onNodeAnchorDragStart.forEach(fn => fn(parentNode.value, anchor))
  })

  /**
   * @description updates the position of the active anchor based on the mouse event
   * @param {MouseEvent} ev - the mouse event to update the active anchor position
   */
  const updateActiveAnchorPosition = (ev: MouseEvent) => {
    if (!activeAnchor.value) return
    activeAnchor.value.x = ev.offsetX
    activeAnchor.value.y = ev.offsetY
  }

  subscribe('onMouseMove', updateActiveAnchorPosition)

  /**
   * @description drops the active anchor and triggers the onNodeAnchorDrop
   * event with the parent node and active anchor
   */
  const dropAnchor = () => {
    if (!activeAnchor.value) return
    eventBus.onNodeAnchorDrop.forEach(fn => fn(parentNode.value, activeAnchor.value))
    activeAnchor.value = undefined
    parentNode.value = undefined
  }

  subscribe('onMouseUp', dropAnchor)

  const insertAnchorsIntoAggregator = (aggregator: SchemaItem[]) => {
    if (!parentNode.value) return aggregator
    const anchors = getAnchorSchematics()
    const { id: parentNodeId } = parentNode.value
    const parentNodeSchema = aggregator.find((item) => item.id === parentNodeId)
    if (!parentNodeSchema) return aggregator
    const { priority: parentNodePriority } = parentNodeSchema
    const priority = parentNodePriority + (activeAnchor.value ? Infinity : 0)
    for (const anchor of anchors) {
      aggregator.push({
        id: 'anchor',
        graphType: 'node-anchor',
        schemaType: 'circle',
        schema: anchor,
        priority: priority,
      })
    }
    return aggregator
  }

  const insertLinkPreviewIntoAggregator = (aggregator: SchemaItem[]) => {
    if (!parentNode.value || !activeAnchor.value) return aggregator
    const { id: parentNodeId } = parentNode.value
    prioritizeNode(parentNodeId, aggregator)
    const parentNodePriority = aggregator.find((item) => item.id === parentNodeId)?.priority
    if (!parentNodePriority) return aggregator
    const linkPreview = getLinkPreviewSchematic()
    if (!linkPreview) return aggregator
    aggregator.push({
      ...linkPreview,
      priority: parentNodePriority - 0.1,
    })
    return aggregator
  }

  graph.updateAggregator.push(insertAnchorsIntoAggregator)
  graph.updateAggregator.push(insertLinkPreviewIntoAggregator)

  subscribe('onNodeRemoved', (node) => {
    if (parentNode.value?.id === node.id) {
      parentNode.value = undefined
      activeAnchor.value = undefined
    }
  })

  return {
    ...graph,
    activeNodeAnchor: readonly(activeAnchor),

    eventBus,
    subscribe,

    theme,
    settings,
  }
}