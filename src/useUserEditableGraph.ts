import { useDraggableNodeAnchorGraph, type AnchorNodeGraphOptions } from "./useNodeAnchorGraph"
import { type Ref } from 'vue'

export type UserEditableGraphOptions = AnchorNodeGraphOptions
export const useUserEditableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {

  const graph = useDraggableNodeAnchorGraph(canvas, options)

  graph.subscribe('onDblClick', (ev) => {
    const { offsetX, offsetY } = ev
    const node = graph.addNode({ x: offsetX, y: offsetY })
    graph.eventBus.onNodeHoverChange.forEach(fn => fn(node))
  })

  graph.subscribe('onKeydown', (ev) => {
    const focusedNodeId = graph.getFocusedNodeId()
    if (ev.key === 'Backspace' && focusedNodeId) graph.removeNode(focusedNodeId)
  });

  graph.subscribe('onNodeAnchorDrop', (parentNode, anchor) => {
    const node = graph.getNodeByCoordinates(anchor.x, anchor.y)
    if (!node) return
    graph.addEdge({ from: parentNode.id, to: node.id })
    graph.addEdge({ from: node.id, to: parentNode.id })
  })

  graph.subscribe('onNodeFocusChange', (newNode, oldNode) => {
    console.log('focus change', newNode, oldNode)
  })

  return graph
}