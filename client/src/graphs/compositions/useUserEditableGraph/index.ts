import type { Ref } from 'vue'
import type {
  SchemaItem,
  GNode,
  GraphOptions
} from "@graph/types"
import type { NodeAnchor } from "@graph/compositions/useNodeAnchorGraph/types"
import { useMarqueeGraph } from '@graph/compositions/useMarqueeGraph'
import type { HistoryRecord } from '../useHistoryGraph/types'
import { useKeydownMap } from './useKeydownMap'

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

  const handleDeletion = () => {
    if (graph.focusedItem.value) {
      const { item, type } = graph.focusedItem.value
      if (type === 'node') graph.removeNode(item.id)
      else if (type === 'edge') graph.removeEdge(item.id)
    }

    if (graph.marqueeSelectedItems.value.size > 0) {
      graph.bulkRemoveNode([...graph.marqueeSelectedItems.value])
      graph.bulkRemoveEdge([...graph.marqueeSelectedItems.value])
      graph.clearMarqueeSelection()
    }
  }

  const KEY_BINDINGS = {
    Mac: {
      ['Meta+Z']: () => graph.undo(),
      ['Shift+Meta+Z']: () => graph.redo(),
      ['Backspace']: handleDeletion,
    },
    Windows: {
      ['Control+Z']: () => graph.undo(),
      ['Shift+Control+Z']: () => graph.redo(),
      ['Backspace']: handleDeletion,
    },
  } as const

  const USER_PLATFORM = window.navigator.userAgent.includes('Mac') ? 'Mac' : 'Windows'

  const { isPressed } = useKeydownMap()

  const handleKeyboardEvents = () => {
    const userKeyBindings = KEY_BINDINGS[USER_PLATFORM]
    for (const key in userKeyBindings) {
      if (isPressed(key)) userKeyBindings[key as keyof typeof userKeyBindings]()
    }
  }

  const eventBindings = {
    ['onDblClick']: handleNodeCreation,
    ['onKeydown']: handleKeyboardEvents,
    ['onNodeAnchorDrop']: handleEdgeCreation,
  } as const

  const activate = () => {
    for (const event in eventBindings) {
      // @ts-ignore
      graph.subscribe(event, eventBindings[event])
    }
    graph.settings.value.nodeAnchors = true
    graph.settings.value.draggable = true
    graph.settings.value.edgeLabelsEditable = true
  }

  const deactivate = () => {
    for (const event in eventBindings) {
      // @ts-ignore
      graph.unsubscribe(event, eventBindings[event])
    }
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