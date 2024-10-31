/**
 * @module useUserEditableGraph
 */

import {
  computed,
  ref,
} from 'vue'
import type { Ref } from 'vue'
import type {
  SchemaItem,
  GNode,
  GraphOptions
} from "@graph/types"
import type {
  NodeAnchorGraphTheme,
  NodeAnchor,
  NodeAnchorGraphSettings,
  NodeAnchorGraphEvents
} from "@graph/compositions/useNodeAnchorGraph"
import { useMarqueeGraph } from './useMarqueeGraph'

export type EditSettings = {
  /**
   * the type of edge to add when creating an edge between nodes
   * @default "directed"
   */
  addedEdgeType: 'directed' | 'undirected',
  /**
   * the default weight to assign to edges when created using the UI
   * @default 1
   */
  addedEdgeWeight: number,
}

const defaultEditSettings = {
  addedEdgeType: 'directed',
  addedEdgeWeight: 1,
} as const

export type EditSettingsOption = Partial<EditSettings> | boolean

export type UserEditableGraphEvents = NodeAnchorGraphEvents
export type UserEditableGraphTheme = NodeAnchorGraphTheme

export type UserEditableGraphSettings = NodeAnchorGraphSettings & {
  userEditable: EditSettingsOption
}

export type UserEditableGraphOptions = GraphOptions<UserEditableGraphTheme, UserEditableGraphSettings>

const defaultUserEditableGraphSettings = {
  userEditable: true,
} as const

export const resolveEditSettings = (settings: EditSettingsOption) => {
  if (settings === false) return null
  if (settings === true) return defaultEditSettings
  return {
    ...defaultEditSettings,
    ...settings,
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

  const graph = useMarqueeGraph(canvas, options)

  const settings = ref<UserEditableGraphSettings>(Object.assign(graph.settings.value, {
    ...defaultUserEditableGraphSettings,
    ...options.settings,
  }))

  const editSettings = computed(() => resolveEditSettings(settings.value.userEditable))

  const handleNodeCreation = (ev: MouseEvent) => {
    const { offsetX, offsetY } = ev
    graph.addNode({ x: offsetX, y: offsetY })
  }

  const handleEdgeCreation = (parentNode: GNode, anchor: NodeAnchor) => {
    if (!editSettings.value) return
    const { x, y } = anchor
    const itemStack = graph.getDrawItemsByCoordinates(x, y)
    const nodeSchema = itemStack.findLast((item: SchemaItem) => item.graphType === 'node')
    if (!nodeSchema) return
    const node = graph.nodes.value.find(node => node.id === nodeSchema.id)
    if (!node) return
    graph.addEdge({
      from: parentNode.id,
      to: node.id,
      type: editSettings.value.addedEdgeType,
      weight: editSettings.value.addedEdgeWeight,
    })
  }

  const handleDeletion = (ev: KeyboardEvent) => {
    if (ev.key !== 'Backspace') return

    if (graph.focusedItem.value) {
      const { item, type } = graph.focusedItem.value
      if (type === 'node') graph.removeNode(item.id)
      else if (type === 'edge') graph.removeEdge(item.id)
    }

    if (graph.marqueedItemIDs.size > 0) {
      for (const id of graph.marqueedItemIDs) {
        const node = graph.getNode(id)
        if (node) graph.removeNode(id)
        const edge = graph.getEdge(id)
        if (edge) graph.removeEdge(id)
      }
    }
  }

  const active = () => {
    graph.subscribe('onDblClick', handleNodeCreation)
    graph.subscribe('onKeydown', handleDeletion)
    graph.subscribe('onNodeAnchorDrop', handleEdgeCreation)
    settings.value.nodeAnchors = true
    settings.value.draggable = true
  }

  const deactivate = () => {
    graph.unsubscribe('onDblClick', handleNodeCreation)
    graph.unsubscribe('onKeydown', handleDeletion)
    graph.unsubscribe('onNodeAnchorDrop', handleEdgeCreation)
    settings.value.nodeAnchors = false
    settings.value.draggable = false
  }

  if (settings.value.userEditable) active()

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.userEditable === true) active()
    else if (diff.userEditable === false) deactivate()
  })

  return {
    ...graph,
    settings,
  }
}