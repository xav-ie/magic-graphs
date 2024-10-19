/**
 * @module useUserEditableGraph
 */

import type { SchemaItem, GNode, GraphOptions } from "./types"
import {
  useNodeAnchorGraph,
  type NodeAnchorGraphTheme,
  type NodeAnchor,
  type NodeAnchorGraphSettings,
  type NodeAnchorGraphEvents
} from "./useNodeAnchorGraph"
import { computed, ref, watch, type Ref } from 'vue'

export type EditSettings = {
  addedEdgeType: 'directed' | 'undirected'
}

const defaultEditSettings = {
  addedEdgeType: 'directed'
} as const

export type UserEditableGraphEvents = NodeAnchorGraphEvents
export type UserEditableGraphTheme = NodeAnchorGraphTheme

export type UserEditableGraphSettings = NodeAnchorGraphSettings & {
  userEditable: boolean | EditSettings
}

export type UserEditableGraphOptions = GraphOptions<UserEditableGraphTheme, UserEditableGraphSettings>

const defaultUserEditableGraphSettings = {
  userEditable: true,
} as const

const resolveEditSettings = (settings: UserEditableGraphSettings) => {
  if (settings.userEditable === false) return null
  if (settings.userEditable === true) return defaultEditSettings
  return {
    ...defaultEditSettings,
    ...settings.userEditable
  }
}

/**
 * @requires a graph interface with node anchors
 *
 * The user editable graph implements handlers for node creation,
 * edge creation and deletion driven by user input.
 *
 * @param canvas - the canvas element to render the graph
 * @param options - the options to configure the graph
 * @returns a user editable graph
 */
export const useUserEditableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {

  const graph = useNodeAnchorGraph(canvas, options)

  const settings = ref<UserEditableGraphSettings>(Object.assign(graph.settings.value, {
    ...defaultUserEditableGraphSettings,
    ...options.settings,
  }))

  const editSettings = computed(() => resolveEditSettings(settings.value))

  const handleNodeCreation = (ev: MouseEvent) => {
    const { offsetX, offsetY } = ev
    graph.addNode({ x: offsetX, y: offsetY })
  }

  const handleEdgeCreation = (parentNode: GNode, anchor: NodeAnchor) => {
    if (!editSettings.value) return
    editSettings.value
    const { x, y } = anchor
    const itemStack = graph.getDrawItemsByCoordinates(x, y)
    // @ts-expect-error findLast is real
    const nodeSchema = itemStack.findLast((item: SchemaItem) => item.graphType === 'node') as SchemaItem | undefined
    if (!nodeSchema) return
    const node = graph.nodes.value.find(node => node.id === nodeSchema.id)
    if (!node) return
    graph.addEdge({
      from: parentNode.label,
      to: node.label,
      type: editSettings.value.addedEdgeType,
      weight: 1,
    })
  }

  const handleDeletion = (ev: KeyboardEvent) => {
    if (!editSettings.value) return
    const focusedItem = graph.getFocusedItem()
    if (!focusedItem) return
    if (ev.key !== 'Backspace') return
    const { item, type } = focusedItem
    if (type === 'node') {
      graph.removeNode(item.id)
    } else if (type === 'edge') {
      graph.removeEdge(item.id)
    }
  }

  graph.subscribe('onDblClick', handleNodeCreation)
  graph.subscribe('onKeydown', handleDeletion)
  graph.subscribe('onNodeAnchorDrop', handleEdgeCreation)

  return {
    ...graph,
    settings,
  }
}