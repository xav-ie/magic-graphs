import {
  ref,
  computed,
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
import { useHistoryGraph } from "@graph/compositions/useHistoryGraph";
import { FOCUS_THEME_ID, FOCUSABLE_GRAPH_TYPES } from "@graph/compositions/useFocusGraph/types";
import type { AddNodeOptions, FocusOption } from "../useBaseGraph/types";

export const useFocusGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {

  const graph = useHistoryGraph(canvas, options);

  const { setTheme } = useTheme(graph, FOCUS_THEME_ID)
  const focusedItemIds = ref(new Set<string>())

  const setFocus = (ids: string[]) => {
    const nonBlacklistedIds = ids.filter(id => !graph.settings.value.focusBlacklist.includes(id))
    const sameLength = nonBlacklistedIds.length === focusedItemIds.value.size
    const sameIds = sameLength && nonBlacklistedIds.every(id => focusedItemIds.value.has(id))
    if (sameIds) return
    const newIds = new Set(nonBlacklistedIds)
    graph.emit('onFocusChange', newIds, focusedItemIds.value)
    focusedItemIds.value = newIds
  }

  const addToFocus = (ids: string[]) => {
    const nonBlacklistedIds = ids.filter(id => !graph.settings.value.focusBlacklist.includes(id))
    if (nonBlacklistedIds.length === 0) return
    const newIds = new Set([...focusedItemIds.value, ...nonBlacklistedIds])
    graph.emit('onFocusChange', newIds, focusedItemIds.value)
    focusedItemIds.value = newIds
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

  const clearOutDeletedItemsFromFocus = () => {
    const focusedIds = Array.from(focusedItemIds.value)
    const newFocusedIds = focusedIds.filter(id => graph.getNode(id) || graph.getEdge(id))
    if (newFocusedIds.length === focusedIds.length) return
    setFocus(newFocusedIds)
  }

  const handleFocusChange = (ev: MouseEvent) => {

    const { offsetX: x, offsetY: y } = ev

    const topItem = graph.getSchemaItemsByCoordinates(x, y).pop()
    if (!topItem) return setFocus([])

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

    console.log('setting focus to', topItem.id)
    setFocus([topItem.id])
  }

  const resetFocus = () => {
    console.log('resetting focus')
    setFocus([])
  }

  const setFocusToAddedItem = ({ id }: { id: string }, { focus }: FocusOption) => {
    if (focus) setFocus([id])
  }

  const isFocused = (id: string) => focusedItemIds.value.has(id)

  setTheme('nodeColor', (node) => {
    if (!isFocused(node.id)) return
    return graph.getTheme('nodeFocusColor', node)
  })

  setTheme('nodeBorderColor', (node) => {
    if (!isFocused(node.id)) return
    return graph.getTheme('nodeFocusBorderColor', node)
  })

  setTheme('nodeTextColor', (node) => {
    if (!isFocused(node.id)) return
    return graph.getTheme('nodeFocusTextColor', node)
  })

  setTheme('edgeColor', (edge) => {
    if (!isFocused(edge.id)) return
    return graph.getTheme('edgeFocusColor', edge)
  })

  setTheme('edgeTextColor', (edge) => {
    if (!isFocused(edge.id)) return
    return graph.getTheme('edgeFocusTextColor', edge)
  })

  setTheme('nodeAnchorColor', (node) => {
    if (!isFocused(node.id)) return
    return graph.getTheme('nodeAnchorColorWhenParentFocused', node)
  })

  const activate = () => {
    graph.subscribe('onNodeAdded', setFocusToAddedItem)
    graph.subscribe('onEdgeAdded', setFocusToAddedItem)
    graph.subscribe('onMouseDown', handleFocusChange)
    graph.subscribe('onGraphReset', resetFocus)
    graph.subscribe('onStructureChange', clearOutDeletedItemsFromFocus)
  }

  const deactivate = () => {
    graph.unsubscribe('onNodeAdded', setFocusToAddedItem)
    graph.unsubscribe('onEdgeAdded', setFocusToAddedItem)
    graph.unsubscribe('onMouseDown', handleFocusChange)
    graph.unsubscribe('onGraphReset', resetFocus)
    graph.unsubscribe('onStructureChange', clearOutDeletedItemsFromFocus)
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
     * The id of the focused item in the graph, if any
     */
    focusedItemIds: readonly(focusedItemIds),
    /**
     * Sets the focus to the item with the given id
     */
    setFocus,
    /**
     * Resets the focus back to none
     */
    resetFocus,
    /**
     * Adds items with the given ids to the focus
     */
    addToFocus,
    /**
     * @param id a node or edge id
     * @returns true if the item is focused
     */
    isFocused,
    /**
     * all the nodes that are currently focused
     */
    focusedNodes: computed(() => graph.nodes.value.filter(node => isFocused(node.id))),
    /**
     * all the edges that are currently focused
     */
    focusedEdges: computed(() => graph.edges.value.filter(edge => isFocused(edge.id))),
  }
}