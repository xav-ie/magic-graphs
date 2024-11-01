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

import {
  ref,
  readonly,
  watch,
} from 'vue'
import type { Ref } from 'vue'
import { prioritizeNode } from "@graph/helpers";
import type { MappingsToEventBus } from '@graph/events';
import { generateSubscriber } from '@graph/events';
import { useDraggableGraph } from "@graph/compositions/useDraggableGraph";
import type {
  DraggableGraphEvents,
  DraggableGraphSettings,
  DraggableGraphTheme,
} from "@graph/compositions/useDraggableGraph";
import type {
  SchemaItem,
  GNode,
  GEdge,
  NodeGetterOrValue,
  MaybeGetter,
  GraphOptions,
} from "@graph/types";
import { BLACK } from "@colors";

import { hitboxes } from "@shape/hitboxes";
import type { Circle } from "@shape/types";

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

type DraggableGraph = ReturnType<typeof useDraggableGraph>

type DefaultNodeGraphThemeGetter = (graph: DraggableGraph) => ExclusiveNodeAnchorGraphTheme

/**
 * @description default options for the anchor node graph
 * @param getTheme - the function to retrieve the theme value
 * @param theme - the theme of the graph
 * @param edges - the edges of the graph
 * @returns the default options for the anchor node graph
 */
const defaultNodeAnchorTheme: DefaultNodeGraphThemeGetter = (
  graph: DraggableGraph,
) => ({
  /**
   * @description calculates the radius of the default node anchor - scales with 2 * sqrt(nodeSize)
   * @param node - the parent node of the anchor
   * @returns the radius of the node anchor
   */
  nodeAnchorRadius: (node: GNode) => {
    const nodeSize = graph.getTheme('nodeSize', node)
    return Math.ceil(Math.sqrt(nodeSize) * 2)
  },
  /**
   * the color of the node anchor
   */
  nodeAnchorColor: BLACK,
  /**
   * the color of the node anchor when the parent node is focused
   */
  nodeAnchorColorWhenParentFocused: graph.theme.value.nodeFocusBorderColor,
  /**
   * the color of the link preview
   */
  linkPreviewColor: graph.edges.value[0] ? graph.getTheme('edgeColor', graph.edges.value[0]) : BLACK,
  /**
   * the width of the link preview
   */
  linkPreviewWidth: graph.getTheme('edgeWidth', graph.edges.value[0]),
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

  const theme = ref<NodeAnchorGraphTheme>(Object.assign(graph.theme.value, {
    ...defaultNodeAnchorTheme(graph),
    ...options.theme,
  }))

  const settings = ref<NodeAnchorGraphSettings>(Object.assign(graph.settings.value, {
    ...defaultNodeAnchorSettings,
    ...options.settings,
  }))

  const eventBus: MappingsToEventBus<NodeAnchorGraphEvents> = Object.assign(graph.eventBus, {
    onNodeAnchorDragStart: [],
    onNodeAnchorDrop: [],
  })

  const { subscribe, unsubscribe } = generateSubscriber(eventBus)

  const parentNode = ref<GNode | undefined>()
  const activeAnchor = ref<NodeAnchor | undefined>()

  const getAnchorSchematics = () => {
    if (
      !parentNode.value ||
      graph.nodeBeingDragged.value ||
      !settings.value.nodeAnchors
    ) return []

    const { getTheme } = graph

    const defaultColor = getTheme('nodeAnchorColor', parentNode.value)
    const focusedColor = getTheme('nodeAnchorColorWhenParentFocused', parentNode.value)
    const isFocused = parentNode.value.id === graph.focusedItemId.value
    const color = isFocused ? focusedColor : defaultColor

    const anchors = getAnchors(parentNode.value)
    const radius = getTheme('nodeAnchorRadius', parentNode.value)

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
    const { getTheme } = graph
    const anchorRadius = getTheme('nodeAnchorRadius', node)
    const nodeSize = getTheme('nodeSize', node)
    const nodeBorderWidth = getTheme('nodeBorderWidth', node)
    const offset = nodeSize - (anchorRadius / 3) + (nodeBorderWidth / 2)
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
        radius: graph.getTheme('nodeAnchorRadius', node),
      })
    })
  }

  const getLinkPreviewSchematic = () => {
    if (!parentNode.value || !activeAnchor.value) return
    const { x, y } = activeAnchor.value
    const start = { x: parentNode.value.x, y: parentNode.value.y }
    const end = { x, y }
    const { getTheme } = graph
    const color = getTheme('linkPreviewColor', parentNode.value, activeAnchor.value)
    const width = getTheme('linkPreviewWidth', parentNode.value, activeAnchor.value)
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
    if (activeAnchor.value || !settings.value.nodeAnchors) return
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
    graph.repaint('node-anchor-graph/update-active-anchor-position')()
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

  const deactivateAnchors = () => {
    parentNode.value = undefined
    activeAnchor.value = undefined
  }

  subscribe('onNodeRemoved', (node) => {
    if (parentNode.value?.id !== node.id) return
    deactivateAnchors()
  })

  subscribe('onSettingsChange', (diff) => {
    if (diff.nodeAnchors === false) deactivateAnchors()
  })

  watch(parentNode, () => {
    graph.repaint('node-anchor-graph/parent-node-watch')()
  })

  return {
    ...graph,
    activeNodeAnchor: readonly(activeAnchor),

    eventBus,
    subscribe,
    unsubscribe,

    theme,
    settings,
  }
}