/**
 * @Helpful terms:
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
import { generateId, prioritizeNode } from "@graph/helpers";
import { useDraggableGraph } from "@graph/compositions/useDraggableGraph";
import type { NodeAnchor } from '@graph/compositions/useNodeAnchorGraph/types';
import type {
  SchemaItem,
  GNode,
  GEdge,
  GraphOptions,
} from "@graph/types";
import { circle, line } from '@shapes';

/**
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
  options: Partial<GraphOptions> = {},
) => {

  const graph = useDraggableGraph(canvas, options)

  const parentNode = ref<GNode | undefined>()
  const activeAnchor = ref<NodeAnchor | undefined>()

  const getAnchorSchemas = (node: GNode) => {
    if (
      graph.activeDragNode.value ||
      !graph.settings.value.nodeAnchors
    ) return []

    const { getTheme } = graph

    const defaultColor = getTheme('nodeAnchorColor', node)
    const focusedColor = getTheme('nodeAnchorColorWhenParentFocused', node)

    const isFocused = node.id === graph.focusedItemId.value
    const color = isFocused ? focusedColor : defaultColor

    const radius = getTheme('nodeAnchorRadius', node)

    const anchorSchemas: SchemaItem[] = []
    for (const anchor of nodeAnchors.value) {
      const { x, y } = anchor

      const circleTemplate = {
        at: { x, y },
        radius,
        color
      }

      if (activeAnchor.value && activeAnchor.value.direction === anchor.direction) {
        circleTemplate.at.x = activeAnchor.value.x
        circleTemplate.at.y = activeAnchor.value.y
      }

      const nodeAnchorShape = circle(circleTemplate)

      anchorSchemas.push({
        id: anchor.id,
        graphType: 'node-anchor',
        shape: nodeAnchorShape,
        priority: Infinity,
      })
    }

    return anchorSchemas
  }

  const nodeAnchors = ref<NodeAnchor[]>([])

  /**
   * updates the node anchor ref with the new node anchors
   *
   * @param {GNode} node - the parent node of the anchor
   * @returns {void}
   */
  const updateNodeAnchors = (node: GNode | undefined) => {
    if (!node) return nodeAnchors.value = []
    const { getTheme } = graph

    const anchorRadius = getTheme('nodeAnchorRadius', node)
    const nodeSize = getTheme('nodeSize', node)
    const nodeBorderWidth = getTheme('nodeBorderWidth', node)

    const offset = nodeSize - (anchorRadius / 3) + (nodeBorderWidth / 2)
    nodeAnchors.value = ([
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
    ] as const).map((anchor) => ({ ...anchor, id: generateId() }))
  }

  /**
   * @param {number} x - the x-coordinate to check
   * @param {number} y - the y-coordinate to check
   * @returns the anchor at the given coordinates if it exists or undefined
   */
  const getAnchor = (x: number, y: number) => {
    const topItem = graph.getSchemaItemsByCoordinates(x, y).pop()
    if (!topItem || topItem.graphType !== 'node-anchor') return
    const { id: anchorId } = topItem
    return nodeAnchors.value.find((anchor) => anchor.id === anchorId)
  }

  const getUnprioritizedLinkPreviewSchema = () => {
    if (!parentNode.value || !activeAnchor.value) return
    const { x, y } = activeAnchor.value
    const start = { x: parentNode.value.x, y: parentNode.value.y }
    const end = { x, y }
    const { getTheme } = graph

    const color = getTheme('linkPreviewColor', parentNode.value, activeAnchor.value)
    const width = getTheme('linkPreviewWidth', parentNode.value, activeAnchor.value)

    const shape = line({
      start,
      end,
      color,
      width,
    })

    const schema: Omit<SchemaItem, 'priority'> = {
      id: 'link-preview',
      graphType: 'link-preview',
      shape,
    }

    return schema
  }

  /**
   * @description updates which node is the parent node based on the mouse event
   * @param {MouseEvent} ev - the mouse event to update the parent node
   */
  const updateParentNode = (ev: MouseEvent) => {
    if (activeAnchor.value || !graph.settings.value.nodeAnchors) return
    const topItem = graph.getSchemaItemsByCoordinates(ev.offsetX, ev.offsetY).pop()
    if (!topItem) return parentNode.value = undefined
    else if (topItem.graphType === 'node-anchor') return
    else if (topItem.graphType === 'node') return parentNode.value = graph.getNode(topItem.id)
  }

  const setActiveAnchor = (ev: MouseEvent) => {
    if (!parentNode.value) return
    const anchor = getAnchor(ev.offsetX, ev.offsetY)
    if (!anchor) return
    activeAnchor.value = anchor
    graph.emit('onNodeAnchorDragStart', parentNode.value, anchor)
  }

  graph.subscribe('onMouseMove', updateParentNode)
  graph.subscribe('onMouseDown', setActiveAnchor)

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

  graph.subscribe('onMouseMove', updateActiveAnchorPosition)

  /**
   * @description drops the active anchor and triggers the onNodeAnchorDrop
   * event with the parent node and active anchor
   */
  const dropAnchor = () => {
    if (!activeAnchor.value) return
    else if (!parentNode.value) throw new Error('active anchor without parent node')
    graph.emit('onNodeAnchorDrop', parentNode.value, activeAnchor.value)
    deactivateAnchors()
  }

  graph.subscribe('onMouseUp', dropAnchor)

  const insertAnchorsIntoAggregator = (aggregator: SchemaItem[]) => {
    if (!parentNode.value) return aggregator
    const anchors = getAnchorSchemas(parentNode.value)
    for (const anchor of anchors) aggregator.push(anchor)
    return aggregator
  }

  const insertLinkPreviewIntoAggregator = (aggregator: SchemaItem[]) => {
    if (!parentNode.value || !activeAnchor.value) return aggregator

    const { id: parentNodeId } = parentNode.value

    prioritizeNode(parentNodeId, aggregator)

    const parentNodePriority = aggregator
      .find((item) => item.id === parentNodeId)?.priority

    if (!parentNodePriority) return aggregator

    const unprioritizedPreviewSchema = getUnprioritizedLinkPreviewSchema()

    if (!unprioritizedPreviewSchema) return aggregator

    const linkPreviewSchema = {
      ...unprioritizedPreviewSchema,
      priority: parentNodePriority - 0.1,
    }

    aggregator.push(linkPreviewSchema)
    return aggregator
  }

  graph.updateAggregator.push(insertAnchorsIntoAggregator)
  graph.updateAggregator.push(insertLinkPreviewIntoAggregator)

  const deactivateAnchors = () => {
    parentNode.value = undefined
    activeAnchor.value = undefined
  }


  graph.subscribe('onNodeRemoved', (node) => {
    if (parentNode.value?.id !== node.id) return
    deactivateAnchors()
  })

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.nodeAnchors === false) deactivateAnchors()
    })

  watch(parentNode, () => {
    if (parentNode.value) updateNodeAnchors(parentNode.value)
      graph.repaint('node-anchor-graph/parent-node-watch')()
  })

  graph.subscribe('onNodeMoved', deactivateAnchors)
  graph.subscribe('onNodeDrop', updateNodeAnchors)

  return {
    ...graph,

    /**
     * the node anchor that is currently being dragged by the user
     */
    nodeAnchorActiveAnchor: readonly(activeAnchor),
    /**
     * the parent node of the active anchor
     */
    nodeAnchorParentNode: readonly(parentNode),
  }
}