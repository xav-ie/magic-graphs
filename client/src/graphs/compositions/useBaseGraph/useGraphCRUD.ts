import type { GEdge, GNode } from "@graph/types";
import type { NodeMap, EdgeMap } from "./useNodeEdgeMap";
import type { PartiallyPartial } from "@utils/types";
import {
  ADD_EDGE_DEFAULTS,
  ADD_EDGE_OPTIONS_DEFAULTS,
  ADD_NODE_OPTIONS_DEFAULTS,
  BULK_ADD_NODE_OPTIONS_DEFAULTS,
  MOVE_NODE_OPTIONS_DEFAULTS,
  REMOVE_EDGE_OPTIONS_DEFAULTS,
  REMOVE_NODE_OPTIONS_DEFAULTS
} from "./types";
import type {
  AddEdgeOptions,
  RemoveEdgeOptions,
  MoveNodeOptions,
  RemoveNodeOptions,
  AddNodeOptions,
} from "./types";
import { generateId, getConnectedEdges } from "@graph/helpers";
import type { Ref } from "vue";
import type { Emitter } from "@graph/events";
import { nodeLetterLabelGetter } from "@graph/labels";
import type { GraphSettings } from "@graph/settings";

type GraphCRUDOptions = {
  emit: Emitter,
  repaint: (key: string) => () => void,
  nodes: Ref<GNode[]>,
  edges: Ref<GEdge[]>,
  nodeMap: NodeMap,
  edgeMap: EdgeMap,
  settings: Ref<GraphSettings>,
}


export const useGraphCRUD = ({
  nodes,
  edges,
  nodeMap,
  edgeMap,
  repaint,
  emit,
  settings,
}: GraphCRUDOptions) => {

  // READ OPERATIONS

  /**
   * get a node by its id
   *
   * @param id
   * @returns the node or undefined if not found
   */
  const getNode = (id: GNode['id']) => nodeMap.value.get(id)

  /**
   * get an edge by its id
   *
   * @param id
   * @returns the edge or undefined if not found
   */
  const getEdge = (id: GEdge['id']) => edgeMap.value.get(id)


  // CREATE OPERATIONS

  /**
   * add a node to the graph
   *
   * @param node - the node to add
   * @param options - override default effects (onNodeAdded event)
   * @returns the added node or undefined if not added
   */
  const addNode = (
    node: Partial<GNode>,
    options: Partial<AddNodeOptions> = {}
  ) => {
    if (node?.id && getNode(node.id)) {
      console.warn('prevented adding a node with an existing id, this shouldn\'t happen')
      return
    }

    const fullOptions = {
      ...ADD_NODE_OPTIONS_DEFAULTS,
      ...options
    }

    const labelGetter = settings.value.newNodeLabelGetter ?? nodeLetterLabelGetter({ nodes })

    const newNode = {
      id: node.id ?? generateId(),
      label: node.label ?? labelGetter(),
      x: node.x ?? 0,
      y: node.y ?? 0,
    }

    nodes.value.push(newNode)
    emit('onNodeAdded', newNode, fullOptions)
    emit('onStructureChange', nodes.value, edges.value)
    repaint('base-graph/add-node')()
    return newNode
  }

  const bulkAddNode = (
    nodes: Partial<GNode>[],
    options: Partial<AddNodeOptions> = {}
  ) => {
    if (nodes.length === 0) return

    const fullOptions = {
      ...BULK_ADD_NODE_OPTIONS_DEFAULTS,
      ...options
    }

    const createdNodes = []

    for (const node of nodes) {
      const newNode = addNode(node, {
        focus: false,
        broadcast: false,
        history: false,
      })
      if (!newNode) continue
      createdNodes.push(newNode)
    }

    if (createdNodes.length === 0) return
    emit('onBulkNodeAdded', createdNodes, fullOptions)
  }

  /**
   * add an edge to the graph
   *
   * @param edge - the edge to add
   * @param options - override default effects (onEdgeAdded event)
   * @returns the added edge or undefined if not added
   */
  const addEdge = (
    edge: PartiallyPartial<GEdge, keyof typeof ADD_EDGE_DEFAULTS | 'id'>,
    options: Partial<AddEdgeOptions> = {}
  ) => {
    const fullOptions = {
      ...ADD_EDGE_OPTIONS_DEFAULTS,
      ...options
    }

    const [fromNode, toNode] = [getNode(edge.from), getNode(edge.to)]
    if (!fromNode || !toNode) return

    const undirectedEdgeOnPath = edges.value.find(e => {
      const connectedToFrom = e.to === edge.to && e.from === edge.from
      const connectedFromTo = e.to === edge.from && e.from === edge.to
      return (connectedToFrom || connectedFromTo) && e.type === 'undirected'
    })

    if (undirectedEdgeOnPath) return

    const directedEdgeOnPath = edges.value.find(e => {
      return e.to === edge.to && e.from === edge.from
    })

    if (directedEdgeOnPath) return

    // if the edge type is undirected, check the other directed way
    if (edge.type === 'undirected') {
      const directedEdgeOnPath = edges.value.find(e => {
        return e.to === edge.from && e.from === edge.to
      })

      if (directedEdgeOnPath) return
    }

    const newEdge: GEdge = {
      ...ADD_EDGE_DEFAULTS,
      id: generateId(),
      ...edge,
    }

    edges.value.push(newEdge)

    emit('onEdgeAdded', newEdge, fullOptions)
    emit('onStructureChange', nodes.value, edges.value)

    repaint('base-graph/add-edge')()
    return newEdge
  }

  const bulkAddEdge = (
    edges: PartiallyPartial<GEdge, keyof typeof ADD_EDGE_DEFAULTS | 'id'>[],
    options: Partial<AddEdgeOptions> = {}
  ) => {
    if (edges.length === 0) return

    const fullOptions = {
      ...ADD_EDGE_OPTIONS_DEFAULTS,
      ...options
    }

    const createdEdges: GEdge[] = []

    for (const edge of edges) {
      const newEdge = addEdge(edge, {
        broadcast: false,
        history: false,
      })
      if (!newEdge) continue
      createdEdges.push(newEdge)
    }

    if (createdEdges.length === 0) return
    emit('onBulkEdgeAdded', createdEdges, fullOptions)
  }


  // UPDATE OPERATIONS

  /**
   * move a node to a new position (in place mutation)
   *
   * @param id - the id of the node to move
   * @param coords - the new coordinates (x, y)
   * @param options - override default effects (onNodeMoved event)
   * @returns void
   */
  const moveNode = (
    id: GNode['id'],
    coords: { x: number, y: number },
    options: Partial<MoveNodeOptions> = {}
  ) => {
    const node = getNode(id)
    if (!node) return

    const fullOptions = {
      ...MOVE_NODE_OPTIONS_DEFAULTS,
      ...options
    }

    node.x = coords.x
    node.y = coords.y
    emit('onNodeMoved', node, fullOptions)
    repaint('base-graph/move-node')()
  }


  // DELETE OPERATIONS

  /**
   * remove a node from the graph
   *
   * @param id - the id of the node to remove
   * @param options - override default effects (onNodeRemoved event)
   * @returns the removed node along with its removed edges or undefined if not removed
   */
  const removeNode = (id: GNode['id'], options: Partial<RemoveNodeOptions> = {}) => {
    const removedNode = getNode(id)
    if (!removedNode) return

    const fullOptions = {
      ...REMOVE_NODE_OPTIONS_DEFAULTS,
      ...options
    }

    const edgesToRemove = getConnectedEdges(removedNode, edges.value)
    const removedEdges = edgesToRemove.map((e) => removeEdge(e.id, {
      broadcast: false,
      history: false,
    })).filter(Boolean) as GEdge[]

    nodes.value = nodes.value.filter(n => n.id !== removedNode.id)

    emit('onNodeRemoved', removedNode, removedEdges, fullOptions)
    emit('onStructureChange', nodes.value, edges.value)

    repaint('base-graph/remove-node')()
    return [removedNode, removedEdges] as const
  }

  const bulkRemoveNode = (
    nodeIds: GNode['id'][],
    options: Partial<RemoveNodeOptions> = {}
  ) => {
    if (nodeIds.length === 0) return

    const fullOptions = {
      ...REMOVE_NODE_OPTIONS_DEFAULTS,
      ...options
    }

    const removedNodes: GNode[] = []
    const removedEdges: GEdge[] = []

    for (const nodeId of nodeIds) {
      const removed = removeNode(nodeId, {
        broadcast: false,
        history: false,
      })
      if (!removed) continue
      const [removedNode, removedNodeEdges] = removed
      removedNodes.push(removedNode)
      removedEdges.push(...removedNodeEdges)
    }

    if (removedNodes.length === 0) return
    emit('onBulkNodeRemoved', removedNodes, removedEdges, fullOptions)
  }

  /**
   * remove an edge from the graph
   *
   * @param edgeId - the id of the edge to remove
   * @param options - override default effects (onEdgeRemoved event)
   * @returns the removed edge or undefined if not removed
   */
  const removeEdge = (
    edgeId: GEdge['id'],
    options: Partial<RemoveEdgeOptions> = {}
  ) => {
    const edge = getEdge(edgeId)
    if (!edge) return

    const fullOptions = {
      ...REMOVE_EDGE_OPTIONS_DEFAULTS,
      ...options
    }

    edges.value = edges.value.filter(e => e.id !== edge.id)

    emit('onEdgeRemoved', edge, fullOptions)
    emit('onStructureChange', nodes.value, edges.value)
    repaint('base-graph/remove-edge')()
    return edge
  }

  const bulkRemoveEdge = (
    edgeIds: GEdge['id'][],
    options: Partial<RemoveEdgeOptions> = {}
  ) => {
    if (edgeIds.length === 0) return

    const fullOptions = {
      ...REMOVE_EDGE_OPTIONS_DEFAULTS,
      ...options
    }

    const removedEdges: GEdge[] = []

    for (const edgeId of edgeIds) {
      const removed = removeEdge(edgeId, {
        broadcast: false,
        history: false,
      })
      if (!removed) continue
      removedEdges.push(removed)
    }

    if (removedEdges.length === 0) return
    emit('onBulkEdgeRemoved', removedEdges, fullOptions)
    return removedEdges
  }

  return {
    getNode,
    getEdge,

    addNode,
    addEdge,

    moveNode,

    removeNode,
    removeEdge,

    bulkAddNode,
    bulkRemoveNode,

    bulkAddEdge,
    bulkRemoveEdge,
  }
}