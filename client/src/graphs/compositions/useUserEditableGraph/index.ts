import type { Ref } from 'vue'
import type {
  SchemaItem,
  GNode,
  GraphOptions
} from "@graph/types"
import type { NodeAnchor } from "@graph/compositions/useNodeAnchorGraph/types"
import { useMarqueeGraph } from '@graph/compositions/useMarqueeGraph'
import type { HistoryRecord } from '../useHistoryGraph/types'
import { useShortcutPressed } from './useShortcutPressed'

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

  const handleEdgeCreation = (fromNode: GNode, anchor: NodeAnchor) => {
    const { x, y } = anchor
    const itemStack = graph.getSchemaItemsByCoordinates(x, y)
    const toNodeSchema = itemStack.findLast((item) => item.graphType === 'node')
    if (!toNodeSchema) return
    const toNode = graph.getNode(toNodeSchema.id)
    if (!toNode) return

    if (graph.settings.value.userAddedEdgeRuleNoSelfLoops) {
      const violatesRule = fromNode.id === toNode.id
      if (violatesRule) return
    }

    if (graph.settings.value.userAddedEdgeRuleOneEdgePerPath) {
      const edgeBetweenToAndFrom = graph.edges.value
        .find((edge) => edge.from === fromNode.id && edge.to === toNode.id)

      const edgeBetweenFromAndTo = graph.edges.value
        .find((edge) => edge.from === toNode.id && edge.to === fromNode.id)

      const violatesRule = edgeBetweenToAndFrom || edgeBetweenFromAndTo
      if (violatesRule) return
    }

    graph.addEdge({
      from: fromNode.id,
      to: toNode.id,
      type: graph.settings.value.userAddedEdgeType,
      label: graph.settings.value.userAddedEdgeLabel,
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

  const { isPressed } = useShortcutPressed()

  const handleKeyboardEvents = () => {
    const userKeyBindings = KEY_BINDINGS[USER_PLATFORM]
    for (const key in userKeyBindings) {
      if (isPressed(key)) userKeyBindings[key as keyof typeof userKeyBindings]()
    }
  }

  const EVENT_BINDINGS = {
    ['onDblClick']: handleNodeCreation,
    ['onKeydown']: handleKeyboardEvents,
    ['onNodeAnchorDrop']: handleEdgeCreation,
  } as const

  const activate = () => {
    for (const event in EVENT_BINDINGS) {
      // @ts-ignore
      graph.subscribe(event, EVENT_BINDINGS[event])
    }
    graph.settings.value.nodeAnchors = true
    graph.settings.value.draggable = true
    graph.settings.value.edgeLabelsEditable = true
  }

  const deactivate = () => {
    for (const event in EVENT_BINDINGS) {
      // @ts-ignore
      graph.unsubscribe(event, EVENT_BINDINGS[event])
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