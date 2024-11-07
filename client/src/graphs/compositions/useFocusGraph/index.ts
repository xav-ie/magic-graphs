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
import { onClickOutside } from "@vueuse/core";
import { useTheme } from "@graph/themes/useTheme";
import { getValue } from "@graph/helpers";
import { useBaseGraph } from "@graph/compositions/useBaseGraph";
import { FOCUS_THEME_ID, FOCUSABLE_GRAPH_TYPES} from "@graph/compositions/useFocusGraph/types";
import type { FocusedItem, MaybeId } from "@graph/compositions/useFocusGraph/types";

export const useFocusGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {

  const graph = useBaseGraph(canvas, options);

  const { setTheme } = useTheme(graph, FOCUS_THEME_ID)
  const focusedItemId = ref<MaybeId>()

  const setFocus = (newId: MaybeId) => {
    if (focusedItemId.value === newId) return
    graph.emit('onFocusChange', newId, focusedItemId.value)
    focusedItemId.value = newId
  }

  const handleTextArea = (schemaItem: SchemaItem) => {
    schemaItem.shape.activateTextArea?.((str: string) => {
      const edge = graph.getEdge(schemaItem.id)
      if (!edge) throw new Error('textarea only implemented for edges')
      const newWeight = graph.settings.value.edgeInputToWeight(str)
      if (
        newWeight === undefined ||
        isNaN(newWeight) ||
        edge.weight === newWeight
      ) return
      edge.weight = newWeight
      graph.emit('onEdgeWeightChange', edge)
    })
  }

  const handleFocusChange = (ev: MouseEvent) => {

    const { offsetX: x, offsetY: y } = ev
    setFocus(undefined)

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
  const setFocusToAddedNode = (node: GNode) => setFocus(node.id)

  graph.subscribe('onGraphReset', resetFocus)
  graph.subscribe('onMouseDown', handleFocusChange)
  graph.subscribe('onNodeAdded', setFocusToAddedNode)

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
    throw new Error('focused item not found, is FOCUSABLE_GRAPH_TYPES is exhaustive?')
  })

  setTheme('nodeColor', (node) => {
    if (node.id !== focusedItemId.value) return
    return getValue(graph.theme.value.nodeFocusColor, node)
  })

  setTheme('nodeBorderColor', (node) => {
    if (node.id !== focusedItemId.value) return
    return getValue(graph.theme.value.nodeFocusBorderColor, node)
  })

  setTheme('edgeColor', (edge) => {
    if (edge.id !== focusedItemId.value) return
    return getValue(graph.theme.value.edgeFocusColor, edge)
  })

  graph.subscribe('onFocusChange', () => setTimeout(graph.repaint('focus-graph/on-focus-change'), 10))

  graph.subscribe('onNodeAdded', (node, { focus }) => {
    if (focus) setFocus(node.id)
  })

  graph.subscribe('onEdgeAdded', (edge, { focus }) => {
    if (focus) setFocus(edge.id)
  })

  const stopClickOutsideListener = onClickOutside(canvas, () => setFocus(undefined))
  onUnmounted(stopClickOutsideListener)

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
  }
}