import {
  ref,
  computed,
  onUnmounted,
  readonly,
} from "vue";
import type { Ref } from "vue";
import type {
  GEdge,
  GNode,
  GraphOptions,
  SchemaItem
} from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import { getValue } from "@graph/helpers";
import { useHistoryGraph } from "@graph/compositions/useHistoryGraph";
import { FOCUS_THEME_ID, FOCUSABLE_GRAPH_TYPES } from "@graph/compositions/useFocusGraph/types";
import type { FocusedItem, MaybeId } from "@graph/compositions/useFocusGraph/types";
import type { AddNodeOptions, FocusOption } from "../useBaseGraph/types";

export const useFocusGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {

  const graph = useHistoryGraph(canvas, options);

  const { setTheme } = useTheme(graph, FOCUS_THEME_ID)
  const focusedItemId = ref<MaybeId>()

  const setFocus = (newId: MaybeId) => {
    if (focusedItemId.value === newId) return
    if (newId && graph.settings.value.focusBlacklist.includes(newId)) return
    graph.emit('onFocusChange', newId, focusedItemId.value)
    focusedItemId.value = newId
  }

  const handleTextArea = (schemaItem: SchemaItem) => {
    schemaItem.shape.activateTextArea?.((str: string) => {
      const edge = graph.getEdge(schemaItem.id)
      if (!edge) throw new Error('textarea only implemented for edges')
      const newLabel = graph.settings.value.edgeInputToLabel(str)
      if (newLabel === undefined || edge.label === newLabel) return
      edge.label = newLabel
      graph.emit('onEdgeLabelChange', edge)
    })
  }

  const handleFocusChange = (ev: MouseEvent) => {

    const { offsetX: x, offsetY: y } = ev
    resetFocus()

    const topItem = graph.getSchemaItemsByCoordinates(x, y).pop()
    if (!topItem) return

    // handle text areas
    const inATextArea = topItem.shape.textHitbox?.({ x, y })
    const canEdit = (
      inATextArea &&
      graph.settings.value.edgeLabelsEditable &&
      topItem.graphType === 'edge'
    )

    if (canEdit) return handleTextArea(topItem)

    const canFocus = FOCUSABLE_GRAPH_TYPES.some(type => type === topItem.graphType)
    if (!canFocus) return

    setFocus(topItem.id)
  }

  const resetFocus = () => setFocus(undefined)

  const setFocusToAddedItem = ({ id }: { id: string }, { focus }: FocusOption) => {
    if (focus) setFocus(id)
  }

  const focusedItem = computed<FocusedItem | undefined>(() => {
    if (!focusedItemId.value) return

    const node = graph.getNode(focusedItemId.value)
    if (node) return {
      type: 'node',
      item: node,
    } as const

    const edge = graph.getEdge(focusedItemId.value)
    if (edge) return {
      type: 'edge',
      item: edge,
    } as const

    throw new Error('focused item not found, is FOCUSABLE_GRAPH_TYPES exhaustive?')
  })

  setTheme('nodeColor', (node) => {
    if (node.id !== focusedItemId.value) return
    return getValue(graph.theme.value.nodeFocusColor, node)
  })

  setTheme('nodeBorderColor', (node) => {
    if (node.id !== focusedItemId.value) return
    return getValue(graph.theme.value.nodeFocusBorderColor, node)
  })

  setTheme('nodeTextColor', (node) => {
    if (node.id !== focusedItemId.value) return
    return getValue(graph.theme.value.nodeFocusTextColor, node)
  })

  setTheme('edgeColor', (edge) => {
    if (edge.id !== focusedItemId.value) return
    return getValue(graph.theme.value.edgeFocusColor, edge)
  })

  setTheme('edgeTextColor', (edge) => {
    if (edge.id !== focusedItemId.value) return
    return getValue(graph.theme.value.edgeFocusTextColor, edge)
  })

  const repaintOnFocusChange = () => setTimeout(graph.repaint('focus-graph/on-focus-change'), 10)

  const activate = () => {
    graph.subscribe('onFocusChange', repaintOnFocusChange)
    graph.subscribe('onNodeAdded', setFocusToAddedItem)
    graph.subscribe('onEdgeAdded', setFocusToAddedItem)
    graph.subscribe('onMouseDown', handleFocusChange)
    graph.subscribe('onGraphReset', resetFocus)
  }

  const deactivate = () => {
    graph.unsubscribe('onFocusChange', repaintOnFocusChange)
    graph.unsubscribe('onNodeAdded', setFocusToAddedItem)
    graph.unsubscribe('onEdgeAdded', setFocusToAddedItem)
    graph.unsubscribe('onMouseDown', handleFocusChange)
    graph.unsubscribe('onGraphReset', resetFocus)
    resetFocus()
  }

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.focusable === false) deactivate()
    else if (diff.focusable === true) activate()
  })

  if (graph.settings.value.focusable) activate()

  return {
    ...graph,

    /**
     * The focused item in the graph, if any
     */
    focusedItem: readonly(focusedItem),
    /**
     * The id of the focused item in the graph, if any
     */
    focusedItemId: readonly(focusedItemId),
    /**
     * Sets the focus to the item with the given id
     */
    setFocus,
    /**
     * Resets the focus back to none
     */
    resetFocus,
  }
}