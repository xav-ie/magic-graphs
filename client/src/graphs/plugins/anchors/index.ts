import { ref, readonly } from 'vue'
import { prioritizeNode } from "@graph/helpers";
import type { BaseGraph } from '@graph/base';
import type { GraphMouseEvent } from '@graph/base/types';
import type { SchemaItem, GNode } from "@graph/types";
import type { GraphFocusControls } from '@graph/plugins/focus';
import type { NodeAnchor } from '@graph/plugins/anchors/types';
import { generateId } from '@utils/id';
import { circle, line } from '@shapes';

/**
 * node anchors provide an additional layer of interaction by allowing nodes to spawn draggable anchors
 * when hovered over.
 *
 * helpful definitions:
 * - Parent Node: The node that the anchors are spawned around.
 * - Node Anchor/Anchor: A draggable handle that spawns around the parent node.
 * - Link Preview: The line that appears between the parent node and the anchor when the anchor is being dragged.
 * - Active Anchor: The anchor that is currently being dragged.
 * - Anchor Node Graph: A graph that supports the creation and event propagation of anchors around nodes.
 */
export const useNodeAnchors = (graph: BaseGraph & GraphFocusControls) => {
  /**
   * The node that the anchors are spawned around.
   */
  const parentNode = ref<GNode | undefined>()
  /**
   * The anchor that is currently being dragged.
   */
  const activeAnchor = ref<NodeAnchor | undefined>()

  const setParentNode = (nodeId: GNode['id']) => {
    const node = graph.getNode(nodeId)
    if (!node) throw new Error('node not found')
    parentNode.value = node
    updateNodeAnchors(node)
  }

  const resetParentNode = () => {
    parentNode.value = undefined
    activeAnchor.value = undefined
  }

  const getAnchorSchemas = (node: GNode) => {
    const { getTheme } = graph

    const color = getTheme('nodeAnchorColor', node)
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

  /**
   * Draggable handles that spawns around the parent node.
   */
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
   * the anchor at the given event location
   */
  const getAnchor = ({ items }: GraphMouseEvent) => {
    const topItem = items.at(-1)
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
   * updates which node is the parent node based on the mouse event
   */
  const updateParentNode = ({ items }: GraphMouseEvent) => {
    if (activeAnchor.value) return

    const topItem = items.at(-1)
    if (!topItem) return resetParentNode()
    if (topItem.graphType !== 'node') return

    /**
     * TODO try making this simpler by making a rule that if there is more than 1
     * focused node, the parent node should be reset. I dont think
     * all this other logic-ing is necessary
     */

    const perspectiveNode = graph.getNode(topItem.id)
    if (!perspectiveNode) throw new Error('node in aggregator but not in graph')

    const perspectiveNodeFocused = graph.isFocused(perspectiveNode.id)
    const moreThanOneNodeFocused = graph.focusedNodes.value.length > 1

    if (perspectiveNodeFocused && moreThanOneNodeFocused) return resetParentNode()

    parentNode.value = perspectiveNode
    updateNodeAnchors(perspectiveNode)
  }

  const setActiveAnchor = (ev: GraphMouseEvent) => {
    if (!parentNode.value) return
    /**
     * TODO shouldn't getAnchor be unnecessary here because the top item in this event should
     * point to the anchor itself?
     */
    const anchor = getAnchor(ev)
    if (!anchor) return
    activeAnchor.value = anchor
    graph.emit('onNodeAnchorDragStart', parentNode.value, anchor)
  }

  /**
   * updates the position of the active anchor based on the mouse event
   */
  const updateActiveAnchorPosition = ({ coords }: GraphMouseEvent) => {
    if (!activeAnchor.value) return
    const { x, y } = coords
    activeAnchor.value.x = x
    activeAnchor.value.y = y
  }

  /**
   * drops the active anchor and triggers graph events
   */
  const dropAnchor = () => {
    if (!activeAnchor.value) return
    else if (!parentNode.value) throw new Error('active anchor without parent node')
    graph.emit('onNodeAnchorDrop', parentNode.value, activeAnchor.value)
    resetParentNode()
  }

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

  const resetParentNodeIfRemoved = (node: GNode) => {
    if (parentNode.value?.id === node.id) resetParentNode()
  }

  const disallowNodesInFocusGroupFromBeingParents = () => {
    if (!parentNode.value) return
    const parentFocused = graph.isFocused(parentNode.value.id)
    const moreThanOneNodeFocused = graph.focusedNodes.value.length > 1
    if (parentFocused && moreThanOneNodeFocused) resetParentNode()
  }

  const activate = () => {
    graph.subscribe('onNodeRemoved', resetParentNodeIfRemoved)
    graph.subscribe('onNodeMoved', resetParentNode)
    graph.subscribe('onNodeDrop', updateNodeAnchors)
    graph.subscribe('onMouseMove', updateParentNode)
    graph.subscribe('onMouseMove', updateActiveAnchorPosition)
    graph.subscribe('onMouseDown', setActiveAnchor)
    graph.subscribe('onMouseUp', dropAnchor)
    graph.subscribe('onFocusChange', disallowNodesInFocusGroupFromBeingParents)
  }

  const deactivate = () => {
    graph.unsubscribe('onNodeRemoved', resetParentNodeIfRemoved)
    graph.unsubscribe('onNodeMoved', resetParentNode)
    graph.unsubscribe('onNodeDrop', updateNodeAnchors)
    graph.unsubscribe('onMouseMove', updateParentNode)
    graph.unsubscribe('onMouseMove', updateActiveAnchorPosition)
    graph.unsubscribe('onMouseDown', setActiveAnchor)
    graph.unsubscribe('onMouseUp', dropAnchor)
    graph.unsubscribe('onFocusChange', disallowNodesInFocusGroupFromBeingParents)
    resetParentNode()
  }

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.nodeAnchors === true) activate()
    else if (diff.nodeAnchors === false) deactivate()
  })

  if (graph.settings.value.nodeAnchors) activate()

  return {
    /**
     * the node anchor that is currently being dragged by the user
     */
    nodeAnchorActiveAnchor: readonly(activeAnchor),
    /**
     * the parent node of the active anchor
     */
    nodeAnchorParentNode: readonly(parentNode),
    /**
     * set the parent node and spawn anchors around it
     */
    nodeAnchorSetParentNode: setParentNode,
  }
}

export type NodeAnchorControls = ReturnType<typeof useNodeAnchors>