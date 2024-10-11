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
    const topItemNoAnchorOrLink = graph.getDrawItemsByCoordinates(anchor.x, anchor.y).slice(0, -2)
    if (topItemNoAnchorOrLink.length === 0) return
    const maybeNode = topItemNoAnchorOrLink.pop()
    if (maybeNode?.graphType !== 'node') return
    const node = graph.nodes.value.find(n => n.id === maybeNode.id)
    if (!node) return
    graph.addEdge({ from: parentNode.label, to: node.label })
    graph.addEdge({ from: node.label, to: parentNode.label })
  })

  return graph
}