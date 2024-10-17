/**
 * @module useUserEditableGraph
 */

import type { SchemaItem, GNode } from "./types"
import { useDraggableNodeAnchorGraph, type AnchorNodeGraphOptions, type NodeAnchor } from "./useNodeAnchorGraph"
import { type Ref } from 'vue'

export type UserEditableGraphOptions = AnchorNodeGraphOptions & {
  addedEdgeType?: 'directed' | 'undirected',
}

/**
 * @requires a graph interface with node anchors
 *
 * The user editable graph implements handlers for node creation,
 * edge creation and deletion driven by user input.
 *
 * @param canvas - the canvas element to render the graph
 * @param options - the options to configure the graph
 * @returns a user editable graph
 */
export const useUserEditableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {

  const graph = useDraggableNodeAnchorGraph(canvas, options)

  const handleNodeCreation = (ev: MouseEvent) => {
    const { offsetX, offsetY } = ev
    graph.addNode({ x: offsetX, y: offsetY })
  }

  const handleEdgeCreation = (parentNode: GNode, anchor: NodeAnchor) => {
    const { x, y } = anchor
    const itemStack = graph.getDrawItemsByCoordinates(x, y)
    // @ts-expect-error findLast is real
    const nodeSchema = itemStack.findLast((item: SchemaItem) => item.graphType === 'node') as SchemaItem | undefined
    if (!nodeSchema) return
    const node = graph.nodes.value.find(node => node.id === nodeSchema.id)
    if (!node) return
    graph.addEdge({
      from: parentNode.label,
      to: node.label,
      type: options.addedEdgeType ?? 'directed',
      weight: 1,
    })
  }

  const handleDeletion = (ev: KeyboardEvent) => {
    const focusedItem = graph.getFocusedItem()
    if (!focusedItem) return
    if (ev.key !== 'Backspace') return
    const { item, type } = focusedItem
    if (type === 'node') {
      graph.removeNode(item.id)
    } else if (type === 'edge') {
      graph.removeEdge(item.id)
    }
  }

  graph.subscribe('onDblClick', handleNodeCreation)
  graph.subscribe('onKeydown', handleDeletion)
  graph.subscribe('onNodeAnchorDrop', handleEdgeCreation)

  return graph
}