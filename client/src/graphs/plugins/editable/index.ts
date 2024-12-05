import type { GNode } from "@graph/types"
import type { BaseGraph } from "@graph/base"
import type { GraphMouseEvent } from '@graph/base/types'
import type { NodeAnchor } from "@graph/plugins/anchors/types"
import { useShortcutPressed } from './useShortcutPressed'
import type { GraphHistoryControls } from "../history"
import type { GraphFocusControls } from "../focus"

/**
 * the user editable graph implements handlers for node creation,
 * edge creation and deletion driven by user input.
 */
export const useUserEditableGraph = (
  graph: BaseGraph & GraphHistoryControls & GraphFocusControls,
) => {
  const handleNodeCreation = ({ coords, event }: GraphMouseEvent) => {
    graph.addNode(coords)
    setTimeout(() => graph.updateGraphAtMousePosition(event), 10)
  }

  const handleEdgeCreation = (fromNode: GNode, anchor: NodeAnchor) => {
    const itemStack = graph.getSchemaItemsByCoordinates(anchor)
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
      label: graph.settings.value.userAddedEdgeLabel,
    })
  }

  const handleDeletion = () => {
    graph.bulkRemoveNode([...graph.focusedItemIds.value])
    graph.bulkRemoveEdge([...graph.focusedItemIds.value])
  }

  const KEY_BINDINGS = {
    Mac: {
      ['Meta+Z']: () => graph.undo(),
      ['Shift+Meta+Z']: () => graph.redo(),
      ['Meta+Shift+Z']: () => graph.redo(),
      ['Backspace']: handleDeletion,
      ['Meta+A']: graph.focusAll,
      ['Escape']: graph.resetFocus,
    },
    Windows: {
      ['Control+Z']: () => graph.undo(),
      ['Shift+Control+Z']: () => graph.redo(),
      ['Control+Shift+Z']: () => graph.redo(),
      ['Backspace']: handleDeletion,
      ['Control+A']: graph.focusAll,
      ['Escape']: graph.resetFocus,
    },
  } as const

  const USER_PLATFORM = window.navigator.userAgent.includes('Mac') ? 'Mac' : 'Windows'

  const { isPressed } = useShortcutPressed()

  const handleKeyboardEvents = (ev: KeyboardEvent) => {
    if (graph.settings.value.userEditable === false) return
    if (graph.canvasFocused.value === false) return
    const userKeyBindings = KEY_BINDINGS[USER_PLATFORM]
    for (const key in userKeyBindings) {
      if (isPressed(key)) {
        userKeyBindings[key as keyof typeof userKeyBindings]()
        ev.preventDefault()
      }
    }
  }

  const EVENT_BINDINGS = {
    ['onDblClick']: handleNodeCreation,
    ['onKeyDown']: handleKeyboardEvents,
    ['onNodeAnchorDrop']: handleEdgeCreation,
  } as const

  const activate = () => {
    for (const event in EVENT_BINDINGS) {
      // @ts-ignore
      graph.subscribe(event, EVENT_BINDINGS[event])
    }
    graph.settings.value.nodeAnchors = true
    graph.settings.value.edgeLabelsEditable = true
  }

  const deactivate = () => {
    for (const event in EVENT_BINDINGS) {
      // @ts-ignore
      graph.unsubscribe(event, EVENT_BINDINGS[event])
    }
    graph.settings.value.nodeAnchors = false
    graph.settings.value.edgeLabelsEditable = false
  }

  if (graph.settings.value.userEditable) activate()

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.userEditable === true) activate()
    else if (diff.userEditable === false) deactivate()
  })
}