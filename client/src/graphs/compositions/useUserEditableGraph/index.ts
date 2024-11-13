import type { Ref } from 'vue'
import type {
  SchemaItem,
  GNode,
  GraphOptions
} from "@graph/types"
import type { NodeAnchor } from "@graph/compositions/useNodeAnchorGraph/types"
import { useMarqueeGraph } from '@graph/compositions/useMarqueeGraph'

/**
 * The user editable graph implements handlers for node creation,
 * edge creation and deletion driven by user input.
 *
 * @param canvas - the canvas element to render the graph
 * @param options - the options to configure the graph
 * @returns a user editable graph
 */
export const useUserEditableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {}
) => {

  const graph = useMarqueeGraph(canvas, options)

  const handleNodeCreation = (ev: MouseEvent) => {
    const { offsetX, offsetY } = ev
    graph.addNode({ x: offsetX, y: offsetY })
  }

  const handleEdgeCreation = (parentNode: GNode, anchor: NodeAnchor) => {
    if (!graph.settings.value.userEditable) return
    const { x, y } = anchor
    const itemStack = graph.getSchemaItemsByCoordinates(x, y)
    const nodeSchema = itemStack.findLast((item: SchemaItem) => item.graphType === 'node')
    if (!nodeSchema) return
    const node = graph.nodes.value.find(node => node.id === nodeSchema.id)
    if (!node) return
    graph.addEdge({
      from: parentNode.id,
      to: node.id,
      type: graph.settings.value.userEditableAddedEdgeType,
      label: graph.settings.value.userEditableAddedEdgeLabel,
    })
  }

  const handleDeletion = (ev: KeyboardEvent) => {
    if (ev.key !== 'Backspace') return

    if (graph.focusedItem.value) {
      const { item, type } = graph.focusedItem.value
      if (type === 'node') graph.removeNode(item.id)
      else if (type === 'edge') graph.removeEdge(item.id)
    }

    if (graph.marqueeSelectedItems.value.size > 0) {
      graph.bulkRemoveNode([...graph.marqueeSelectedItems.value])
      graph.bulkRemoveEdge([...graph.marqueeSelectedItems.value])
    }
  }

  const handleUndo = (ev: KeyboardEvent) => {
    if (ev.key !== 'z') return
    const record = graph.undo()
    if (!record) return
    const { affectedItems } = record
    graph.setMarqueeSelectedItems(affectedItems.map((i) => i.data.id))
  }

  const handleRedo = (ev: KeyboardEvent) => {
    if (ev.key !== 'y') return
    const record = graph.redo()
    if (!record) return
    const { affectedItems } = record
    graph.setMarqueeSelectedItems(affectedItems.map((i) => i.data.id))
  }

  const handleKeyboardEvents = (ev: KeyboardEvent) => {
    handleDeletion(ev)
    handleUndo(ev)
    handleRedo(ev)
  }

  const activate = () => {
    graph.subscribe('onDblClick', handleNodeCreation)
    graph.subscribe('onKeydown', handleKeyboardEvents)
    graph.subscribe('onNodeAnchorDrop', handleEdgeCreation)
    graph.settings.value.nodeAnchors = true
    graph.settings.value.draggable = true
    graph.settings.value.edgeLabelsEditable = true
  }

  const deactivate = () => {
    graph.unsubscribe('onDblClick', handleNodeCreation)
    graph.unsubscribe('onKeydown', handleKeyboardEvents)
    graph.unsubscribe('onNodeAnchorDrop', handleEdgeCreation)
    graph.settings.value.nodeAnchors = false
    graph.settings.value.draggable = false
    graph.settings.value.edgeLabelsEditable = false
  }

  if (graph.settings.value.userEditable) activate()

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.userEditable === true) activate()
    else if (diff.userEditable === false) deactivate()
  })

  return graph
}