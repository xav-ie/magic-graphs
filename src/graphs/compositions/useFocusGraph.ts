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
  SchemaItem
} from "@graph/types";
import { useBaseGraph } from "@graph/compositions/useBaseGraph";
import type { BaseGraphOptions } from "@graph/compositions/useBaseGraph";
import { engageTextarea } from "@graph/textarea";
import { onClickOutside } from "@vueuse/core";
import { useTheme } from "@graph/themes/useTheme";
import { getValue } from "@graph/helpers";
import type { Shape } from "@shape/types";

type Id = SchemaItem['id']
type MaybeId = Id | undefined

type FocusedItem = {
  type: 'node',
  item: GNode,
} | {
  type: 'edge',
  item: GEdge,
}

type ValidFocusableTypes = SchemaItem['graphType'] & FocusedItem['type']

const FOCUSABLE_GRAPH_TYPES: ValidFocusableTypes[] = ['node', 'edge']
const FOCUS_THEME_ID = 'use-focus-graph'

export const useFocusGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<BaseGraphOptions> = {},
) => {

  const graph = useBaseGraph(canvas, options);

  const { setTheme } = useTheme(graph, FOCUS_THEME_ID)
  const focusedItemId = ref<MaybeId>()

  const setFocus = (newId: MaybeId) => {
    if (focusedItemId.value === newId) return
    graph.eventBus.onFocusChange.forEach(fn => fn(newId, focusedItemId.value))
    focusedItemId.value = newId
  }

  const handleTextArea = (shape: Shape) => {

    // shapes must return that actual object used to build the shape
    // we are blocked until then!
    console.log('BLOCKED!')

    // const textInputHandler = (str: string) => {
    //   const edge = graph.getEdge(topItem.id)
    //   if (!edge) throw new Error('Textarea only implemented for edges')
    //   const newWeight = graph.settings.value.edgeInputToWeight(str)
    //   if (!newWeight) return
    //   if (edge.weight === newWeight) return
    //   edge.weight = newWeight
    //   graph.eventBus.onEdgeWeightChange.forEach(fn => fn(edge))
    // }
  }


  const handleFocusChange = (ev: MouseEvent) => {

    const { offsetX: x , offsetY: y } = ev
    setFocus(undefined)

    const topItem = graph.getSchemaItemsByCoordinates(x, y).pop()
    if (!topItem) return

    // handle text areas
    const inATextArea = topItem.shape.textHitbox?.({ x, y })
    const canEdit = inATextArea && true // TODO replace true with a check for textArea.editable
    if (canEdit) return handleTextArea(topItem.shape)

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

  const stopClickOutsideListener = onClickOutside(canvas, () => setFocus(undefined))
  onUnmounted(stopClickOutsideListener)

  return {
    ...graph,
    focusedItem,
    focusedItemId: readonly(focusedItemId),
    setFocus,
  }
}