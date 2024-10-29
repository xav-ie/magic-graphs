import type { GEdge, GNode, SchemaItem } from "@graph/types";
import { useBaseGraph, type BaseGraphOptions } from "./useBaseGraph";
import { computed, onUnmounted, readonly, ref } from "vue";
import type { Ref } from "vue";
import { getTextAreaLocation } from "@shape/draw/text";
import { isInTextarea } from "@shape/hitboxes";
import { engageTextarea } from "@graph/textarea";
import { onClickOutside } from "@vueuse/core";
import { useTheme } from "@graph/themes/useTheme";
import { getValue } from "@graph/helpers";

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
    console.log('setFocus', newId)
    if (focusedItemId.value === newId) return
    graph.eventBus.onFocusChange.forEach(fn => fn(newId, focusedItemId.value))
    focusedItemId.value = newId
  }

  // function breaks with guard clauses!!!
  const handleFocusChange = (ev: MouseEvent) => {
    const topItem = graph.getDrawItemsByCoordinates(ev.offsetX, ev.offsetY).pop()
    const canFocus = topItem && FOCUSABLE_GRAPH_TYPES.some(type => type === topItem.graphType)
    if (!canFocus) return setFocus(undefined)

    const textInputHandler = (str: string) => {
      const edge = graph.getEdge(topItem.id)
      if (!edge) throw new Error('Textarea only implemented for edges')
      const newWeight = graph.settings.value.edgeInputToWeight(str)
      if (!newWeight) return
      if (edge.weight === newWeight) return
      edge.weight = newWeight
      graph.eventBus.onEdgeWeightChange.forEach(fn => fn(edge))
    }

    const { schema, schemaType } = topItem

    if ('textArea' in schema && schema.textArea?.editable ) {

      if (schemaType === 'arrow' || schemaType === 'line') {

        const textAreaLocationArrow = getTextAreaLocation.arrow(schema)
        const textAreaLocationLine = getTextAreaLocation.line(schema)
        const textAreaLocation = schemaType === 'arrow' ? textAreaLocationArrow : textAreaLocationLine

        const isInTextAreaFns = isInTextarea({ x: ev.offsetX, y: ev.offsetY })
        const textAreaSelected = schemaType === 'arrow' ? isInTextAreaFns.arrow(schema) : isInTextAreaFns.line(schema)
        if (schema.textArea && textAreaSelected) {
          engageTextarea({ ...schema.textArea, at: textAreaLocation }, textInputHandler)
          return setFocus(undefined)
        }
      } else if (schemaType === 'uturn') {
        const textAreaLocationUTurn = getTextAreaLocation.uTurn(schema)
        const isInTextAreaFns = isInTextarea({ x: ev.offsetX, y: ev.offsetY })
        const textAreaSelected = isInTextAreaFns.uTurn(schema)
        if (schema.textArea && textAreaSelected) {
          engageTextarea({ ...schema.textArea, at: textAreaLocationUTurn }, textInputHandler)
          return setFocus(undefined)
        }
      }
    }
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

  const stopClickOutsideListener = onClickOutside(canvas, () => setFocus(undefined))
  onUnmounted(stopClickOutsideListener)

  return {
    ...graph,
    focusedItem,
    focusedItemId: readonly(focusedItemId),
    setFocus,
  }
}