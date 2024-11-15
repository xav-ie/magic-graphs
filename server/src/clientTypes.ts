// @ts-ignore
type GraphButtonIdMap = typeof GRAPH_BUTTON_ID;
// @ts-ignore
type GraphButtonId = GraphButtonIdMap[keyof GraphButtonIdMap];
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes a button that can be added to the graph toolbar
// @ts-ignore
 */
// @ts-ignore
export type GButton = {
// @ts-ignore
  cond?: () => boolean,
// @ts-ignore
  label: () => string,
// @ts-ignore
  action: () => void,
// @ts-ignore
  color: () => string,
// @ts-ignore
  id: GraphButtonId,
}

// @ts-ignore
export type BaseGraph = ReturnType<typeof useBaseGraph>

// @ts-ignore
export type FocusOption = {
// @ts-ignore
  /**
// @ts-ignore
   * whether to focus the newly added item
// @ts-ignore
   */
// @ts-ignore
  focus: boolean
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type HistoryOption = {
// @ts-ignore
  /**
// @ts-ignore
   * whether to record this action in the history stack
// @ts-ignore
   */
// @ts-ignore
  history: boolean
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type BroadcastOption = {
// @ts-ignore
  /**
// @ts-ignore
   * whether to broadcast this action to connected collaborators
// @ts-ignore
   */
// @ts-ignore
  broadcast: boolean
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type AddNodeOptions = FocusOption & BroadcastOption & HistoryOption
// @ts-ignore

// @ts-ignore
export const ADD_NODE_OPTIONS_DEFAULTS: AddNodeOptions = {
// @ts-ignore
  broadcast: true,
// @ts-ignore
  focus: true,
// @ts-ignore
  history: true,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const BULK_ADD_NODE_OPTIONS_DEFAULTS: AddNodeOptions = {
// @ts-ignore
  broadcast: true,
// @ts-ignore
  focus: false,
// @ts-ignore
  history: true,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type RemoveNodeOptions = BroadcastOption & HistoryOption
// @ts-ignore

// @ts-ignore
export const REMOVE_NODE_OPTIONS_DEFAULTS: RemoveNodeOptions = {
// @ts-ignore
  broadcast: true,
// @ts-ignore
  history: true,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type AddEdgeOptions = FocusOption & BroadcastOption & HistoryOption
// @ts-ignore

// @ts-ignore
export const ADD_EDGE_OPTIONS_DEFAULTS: AddEdgeOptions = {
// @ts-ignore
  broadcast: true,
// @ts-ignore
  focus: false,
// @ts-ignore
  history: true,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type RemoveEdgeOptions = BroadcastOption & HistoryOption
// @ts-ignore

// @ts-ignore
export const REMOVE_EDGE_OPTIONS_DEFAULTS: RemoveEdgeOptions = {
// @ts-ignore
  broadcast: true,
// @ts-ignore
  history: true,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type MoveNodeOptions = BroadcastOption
// @ts-ignore

// @ts-ignore
export const MOVE_NODE_OPTIONS_DEFAULTS: MoveNodeOptions = {
// @ts-ignore
  broadcast: true,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * defaults for newly added edges
// @ts-ignore
 */
// @ts-ignore
export const ADD_EDGE_DEFAULTS = {
// @ts-ignore
  type: 'directed',
// @ts-ignore
  label: '',
// @ts-ignore
} as const

// @ts-ignore
export type UseAggregatorOptions = {
// @ts-ignore
  canvas: Ref<HTMLCanvasElement | null | undefined>
// @ts-ignore
  emit: GraphEventEmitter
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const useAggregator = ({ canvas, emit }: UseAggregatorOptions) => {
// @ts-ignore
  const aggregator = ref<Aggregator>([])
// @ts-ignore
  const updateAggregator: UpdateAggregator[] = []
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * refresh the canvas
// @ts-ignore
   *
// @ts-ignore
   * @param repaintId - the id of the repaint event (for tracking)
// @ts-ignore
   * @returns a function that will repaint the canvas
// @ts-ignore
   */
// @ts-ignore
  const repaint = (repaintId: string) => () => {
// @ts-ignore
    if (!canvas.value) return
// @ts-ignore
    const ctx = canvas.value.getContext('2d')
// @ts-ignore
    if (!ctx) return
// @ts-ignore
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
// @ts-ignore

// @ts-ignore
    const evaluateAggregator = updateAggregator.reduce<Aggregator>((acc, fn) => fn(acc), [])
// @ts-ignore
    aggregator.value = [...evaluateAggregator.sort((a, b) => a.priority - b.priority)]
// @ts-ignore

// @ts-ignore
    const indexOfLastEdge = aggregator.value.findLastIndex(item => item.graphType === 'edge')
// @ts-ignore
    const beforeLastEdge = aggregator.value.slice(0, indexOfLastEdge + 1)
// @ts-ignore
    const afterLastEdge = aggregator.value.slice(indexOfLastEdge + 1)
// @ts-ignore

// @ts-ignore
    for (const item of beforeLastEdge) {
// @ts-ignore
      item.shape.drawShape(ctx)
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    for (const item of beforeLastEdge) {
// @ts-ignore
      item.shape.drawTextAreaMatte?.(ctx)
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    for (const item of beforeLastEdge) {
// @ts-ignore
      item.shape.drawText?.(ctx)
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    for (const item of afterLastEdge) {
// @ts-ignore
      item.shape.draw(ctx)
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    emit('onRepaint', ctx, repaintId)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * get all schema items at given coordinates
// @ts-ignore
   *
// @ts-ignore
   * @param x - the x coord
// @ts-ignore
   * @param y - the y coord
// @ts-ignore
   * @returns an array where the first item is the bottom most schema item and the last is the top most
// @ts-ignore
   * @example // returns [node, nodeAnchor] where a nodeAnchor is sitting on top of a node
// @ts-ignore
   * getSchemaItemsByCoordinates(200, 550)
// @ts-ignore
   */
// @ts-ignore
  const getSchemaItemsByCoordinates = (x: number, y: number) => {
// @ts-ignore
    return aggregator.value
// @ts-ignore
      .sort((a, b) => a.priority - b.priority)
// @ts-ignore
      .filter(item => item.shape.shapeHitbox({ x, y }) || item.shape.textHitbox?.({ x, y }))
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    aggregator,
// @ts-ignore
    updateAggregator,
// @ts-ignore
    repaint,
// @ts-ignore
    getSchemaItemsByCoordinates,
// @ts-ignore
  }
}

// @ts-ignore
type GraphCRUDOptions = {
// @ts-ignore
  emit: Emitter,
// @ts-ignore
  repaint: (key: string) => () => void,
// @ts-ignore
  nodes: Ref<GNode[]>,
// @ts-ignore
  edges: Ref<GEdge[]>,
// @ts-ignore
  nodeMap: NodeMap,
// @ts-ignore
  edgeMap: EdgeMap,
// @ts-ignore
  settings: Ref<GraphSettings>,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore

// @ts-ignore
export const useGraphCRUD = ({
// @ts-ignore
  nodes,
// @ts-ignore
  edges,
// @ts-ignore
  nodeMap,
// @ts-ignore
  edgeMap,
// @ts-ignore
  repaint,
// @ts-ignore
  emit,
// @ts-ignore
  settings,
// @ts-ignore
}: GraphCRUDOptions) => {
// @ts-ignore

// @ts-ignore
  // READ OPERATIONS
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * get a node by its id
// @ts-ignore
   *
// @ts-ignore
   * @param id
// @ts-ignore
   * @returns the node or undefined if not found
// @ts-ignore
   */
// @ts-ignore
  const getNode = (id: GNode['id']) => nodeMap.value.get(id)
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * get an edge by its id
// @ts-ignore
   *
// @ts-ignore
   * @param id
// @ts-ignore
   * @returns the edge or undefined if not found
// @ts-ignore
   */
// @ts-ignore
  const getEdge = (id: GEdge['id']) => edgeMap.value.get(id)
// @ts-ignore

// @ts-ignore

// @ts-ignore
  // CREATE OPERATIONS
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * add a node to the graph
// @ts-ignore
   *
// @ts-ignore
   * @param node - the node to add
// @ts-ignore
   * @param options - override default effects (onNodeAdded event)
// @ts-ignore
   * @returns the added node or undefined if not added
// @ts-ignore
   */
// @ts-ignore
  const addNode = (
// @ts-ignore
    node: Partial<GNode>,
// @ts-ignore
    options: Partial<AddNodeOptions> = {}
// @ts-ignore
  ) => {
// @ts-ignore
    if (node?.id && getNode(node.id)) {
// @ts-ignore
      console.warn('prevented adding a node with an existing id, this shouldn\'t happen')
// @ts-ignore
      return
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    const fullOptions = {
// @ts-ignore
      ...ADD_NODE_OPTIONS_DEFAULTS,
// @ts-ignore
      ...options
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    const labelGetter = settings.value.newNodeLabelGetter ?? nodeLetterLabelGetter({ nodes })
// @ts-ignore

// @ts-ignore
    const newNode = {
// @ts-ignore
      id: node.id ?? generateId(),
// @ts-ignore
      label: node.label ?? labelGetter(),
// @ts-ignore
      x: node.x ?? 0,
// @ts-ignore
      y: node.y ?? 0,
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    nodes.value.push(newNode)
// @ts-ignore
    emit('onStructureChange', nodes.value, edges.value)
// @ts-ignore
    emit('onNodeAdded', newNode, fullOptions)
// @ts-ignore
    repaint('base-graph/add-node')()
// @ts-ignore
    return newNode
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const bulkAddNode = (
// @ts-ignore
    nodes: Partial<GNode>[],
// @ts-ignore
    options: Partial<AddNodeOptions> = {}
// @ts-ignore
  ) => {
// @ts-ignore
    if (nodes.length === 0) return
// @ts-ignore

// @ts-ignore
    const fullOptions = {
// @ts-ignore
      ...BULK_ADD_NODE_OPTIONS_DEFAULTS,
// @ts-ignore
      ...options
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    const createdNodes = []
// @ts-ignore

// @ts-ignore
    for (const node of nodes) {
// @ts-ignore
      const newNode = addNode(node, {
// @ts-ignore
        focus: false,
// @ts-ignore
        broadcast: false,
// @ts-ignore
        history: false,
// @ts-ignore
      })
// @ts-ignore
      if (!newNode) continue
// @ts-ignore
      createdNodes.push(newNode)
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    if (createdNodes.length === 0) return
// @ts-ignore
    emit('onBulkNodeAdded', createdNodes, fullOptions)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * add an edge to the graph
// @ts-ignore
   *
// @ts-ignore
   * @param edge - the edge to add
// @ts-ignore
   * @param options - override default effects (onEdgeAdded event)
// @ts-ignore
   * @returns the added edge or undefined if not added
// @ts-ignore
   */
// @ts-ignore
  const addEdge = (
// @ts-ignore
    edge: PartiallyPartial<GEdge, keyof typeof ADD_EDGE_DEFAULTS | 'id'>,
// @ts-ignore
    options: Partial<AddEdgeOptions> = {}
// @ts-ignore
  ) => {
// @ts-ignore
    const fullOptions = {
// @ts-ignore
      ...ADD_EDGE_OPTIONS_DEFAULTS,
// @ts-ignore
      ...options
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    const [fromNode, toNode] = [getNode(edge.from), getNode(edge.to)]
// @ts-ignore
    if (!fromNode || !toNode) return
// @ts-ignore

// @ts-ignore
    const undirectedEdgeOnPath = edges.value.find(e => {
// @ts-ignore
      const connectedToFrom = e.to === edge.to && e.from === edge.from
// @ts-ignore
      const connectedFromTo = e.to === edge.from && e.from === edge.to
// @ts-ignore
      return (connectedToFrom || connectedFromTo) && e.type === 'undirected'
// @ts-ignore
    })
// @ts-ignore

// @ts-ignore
    if (undirectedEdgeOnPath) return
// @ts-ignore

// @ts-ignore
    const directedEdgeOnPath = edges.value.find(e => {
// @ts-ignore
      return e.to === edge.to && e.from === edge.from
// @ts-ignore
    })
// @ts-ignore

// @ts-ignore
    if (directedEdgeOnPath) return
// @ts-ignore

// @ts-ignore
    // if the edge type is undirected, check the other directed way
// @ts-ignore
    if (edge.type === 'undirected') {
// @ts-ignore
      const directedEdgeOnPath = edges.value.find(e => {
// @ts-ignore
        return e.to === edge.from && e.from === edge.to
// @ts-ignore
      })
// @ts-ignore

// @ts-ignore
      if (directedEdgeOnPath) return
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    const newEdge: GEdge = {
// @ts-ignore
      ...ADD_EDGE_DEFAULTS,
// @ts-ignore
      id: generateId(),
// @ts-ignore
      ...edge,
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    edges.value.push(newEdge)
// @ts-ignore

// @ts-ignore
    emit('onEdgeAdded', newEdge, fullOptions)
// @ts-ignore
    emit('onStructureChange', nodes.value, edges.value)
// @ts-ignore

// @ts-ignore
    repaint('base-graph/add-edge')()
// @ts-ignore
    return newEdge
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const bulkAddEdge = (
// @ts-ignore
    edges: PartiallyPartial<GEdge, keyof typeof ADD_EDGE_DEFAULTS | 'id'>[],
// @ts-ignore
    options: Partial<AddEdgeOptions> = {}
// @ts-ignore
  ) => {
// @ts-ignore
    if (edges.length === 0) return
// @ts-ignore

// @ts-ignore
    const fullOptions = {
// @ts-ignore
      ...ADD_EDGE_OPTIONS_DEFAULTS,
// @ts-ignore
      ...options
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    const createdEdges: GEdge[] = []
// @ts-ignore

// @ts-ignore
    for (const edge of edges) {
// @ts-ignore
      const newEdge = addEdge(edge, {
// @ts-ignore
        broadcast: false,
// @ts-ignore
        history: false,
// @ts-ignore
      })
// @ts-ignore
      if (!newEdge) continue
// @ts-ignore
      createdEdges.push(newEdge)
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    if (createdEdges.length === 0) return
// @ts-ignore
    emit('onBulkEdgeAdded', createdEdges, fullOptions)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore

// @ts-ignore
  // UPDATE OPERATIONS
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * move a node to a new position (in place mutation)
// @ts-ignore
   *
// @ts-ignore
   * @param id - the id of the node to move
// @ts-ignore
   * @param coords - the new coordinates (x, y)
// @ts-ignore
   * @param options - override default effects (onNodeMoved event)
// @ts-ignore
   * @returns void
// @ts-ignore
   */
// @ts-ignore
  const moveNode = (
// @ts-ignore
    id: GNode['id'],
// @ts-ignore
    coords: { x: number, y: number },
// @ts-ignore
    options: Partial<MoveNodeOptions> = {}
// @ts-ignore
  ) => {
// @ts-ignore
    const node = getNode(id)
// @ts-ignore
    if (!node) return
// @ts-ignore

// @ts-ignore
    const fullOptions = {
// @ts-ignore
      ...MOVE_NODE_OPTIONS_DEFAULTS,
// @ts-ignore
      ...options
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    node.x = coords.x
// @ts-ignore
    node.y = coords.y
// @ts-ignore
    emit('onNodeMoved', node, fullOptions)
// @ts-ignore
    repaint('base-graph/move-node')()
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore

// @ts-ignore
  // DELETE OPERATIONS
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * remove a node from the graph
// @ts-ignore
   *
// @ts-ignore
   * @param id - the id of the node to remove
// @ts-ignore
   * @param options - override default effects (onNodeRemoved event)
// @ts-ignore
   * @returns the removed node along with its removed edges or undefined if not removed
// @ts-ignore
   */
// @ts-ignore
  const removeNode = (id: GNode['id'], options: Partial<RemoveNodeOptions> = {}) => {
// @ts-ignore
    const removedNode = getNode(id)
// @ts-ignore
    if (!removedNode) return
// @ts-ignore

// @ts-ignore
    const fullOptions = {
// @ts-ignore
      ...REMOVE_NODE_OPTIONS_DEFAULTS,
// @ts-ignore
      ...options
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    const edgesToRemove = getConnectedEdges(removedNode, edges.value)
// @ts-ignore
    const removedEdges = edgesToRemove.map((e) => removeEdge(e.id, {
// @ts-ignore
      broadcast: false,
// @ts-ignore
      history: false,
// @ts-ignore
    })).filter(Boolean) as GEdge[]
// @ts-ignore

// @ts-ignore
    nodes.value = nodes.value.filter(n => n.id !== removedNode.id)
// @ts-ignore

// @ts-ignore
    emit('onStructureChange', nodes.value, edges.value)
// @ts-ignore
    emit('onNodeRemoved', removedNode, removedEdges, fullOptions)
// @ts-ignore

// @ts-ignore
    setTimeout(repaint('base-graph/remove-node'), 5)
// @ts-ignore
    return [removedNode, removedEdges] as const
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const bulkRemoveNode = (
// @ts-ignore
    nodeIds: GNode['id'][],
// @ts-ignore
    options: Partial<RemoveNodeOptions> = {}
// @ts-ignore
  ) => {
// @ts-ignore
    if (nodeIds.length === 0) return
// @ts-ignore

// @ts-ignore
    const fullOptions = {
// @ts-ignore
      ...REMOVE_NODE_OPTIONS_DEFAULTS,
// @ts-ignore
      ...options
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    const removedNodes: GNode[] = []
// @ts-ignore
    const removedEdges: GEdge[] = []
// @ts-ignore

// @ts-ignore
    for (const nodeId of nodeIds) {
// @ts-ignore
      const removed = removeNode(nodeId, {
// @ts-ignore
        broadcast: false,
// @ts-ignore
        history: false,
// @ts-ignore
      })
// @ts-ignore
      if (!removed) continue
// @ts-ignore
      const [removedNode, removedNodeEdges] = removed
// @ts-ignore
      removedNodes.push(removedNode)
// @ts-ignore
      removedEdges.push(...removedNodeEdges)
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    if (removedNodes.length === 0) return
// @ts-ignore
    emit('onBulkNodeRemoved', removedNodes, removedEdges, fullOptions)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * remove an edge from the graph
// @ts-ignore
   *
// @ts-ignore
   * @param edgeId - the id of the edge to remove
// @ts-ignore
   * @param options - override default effects (onEdgeRemoved event)
// @ts-ignore
   * @returns the removed edge or undefined if not removed
// @ts-ignore
   */
// @ts-ignore
  const removeEdge = (
// @ts-ignore
    edgeId: GEdge['id'],
// @ts-ignore
    options: Partial<RemoveEdgeOptions> = {}
// @ts-ignore
  ) => {
// @ts-ignore
    const edge = getEdge(edgeId)
// @ts-ignore
    if (!edge) return
// @ts-ignore

// @ts-ignore
    const fullOptions = {
// @ts-ignore
      ...REMOVE_EDGE_OPTIONS_DEFAULTS,
// @ts-ignore
      ...options
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    edges.value = edges.value.filter(e => e.id !== edge.id)
// @ts-ignore

// @ts-ignore
    emit('onEdgeRemoved', edge, fullOptions)
// @ts-ignore
    emit('onStructureChange', nodes.value, edges.value)
// @ts-ignore
    repaint('base-graph/remove-edge')()
// @ts-ignore
    return edge
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const bulkRemoveEdge = (
// @ts-ignore
    edgeIds: GEdge['id'][],
// @ts-ignore
    options: Partial<RemoveEdgeOptions> = {}
// @ts-ignore
  ) => {
// @ts-ignore
    if (edgeIds.length === 0) return
// @ts-ignore

// @ts-ignore
    const fullOptions = {
// @ts-ignore
      ...REMOVE_EDGE_OPTIONS_DEFAULTS,
// @ts-ignore
      ...options
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    const removedEdges: GEdge[] = []
// @ts-ignore

// @ts-ignore
    for (const edgeId of edgeIds) {
// @ts-ignore
      const removed = removeEdge(edgeId, {
// @ts-ignore
        broadcast: false,
// @ts-ignore
        history: false,
// @ts-ignore
      })
// @ts-ignore
      if (!removed) continue
// @ts-ignore
      removedEdges.push(removed)
// @ts-ignore
    }
// @ts-ignore

// @ts-ignore
    if (removedEdges.length === 0) return
// @ts-ignore
    emit('onBulkEdgeRemoved', removedEdges, fullOptions)
// @ts-ignore
    return removedEdges
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    getNode,
// @ts-ignore
    getEdge,
// @ts-ignore

// @ts-ignore
    addNode,
// @ts-ignore
    addEdge,
// @ts-ignore

// @ts-ignore
    moveNode,
// @ts-ignore

// @ts-ignore
    removeNode,
// @ts-ignore
    removeEdge,
// @ts-ignore

// @ts-ignore
    bulkAddNode,
// @ts-ignore
    bulkRemoveNode,
// @ts-ignore

// @ts-ignore
    bulkAddEdge,
// @ts-ignore
    bulkRemoveEdge,
// @ts-ignore
  }
}

// @ts-ignore
export type UseNodeEdgeMap = typeof useNodeEdgeMap
// @ts-ignore
export type NodeMap = ReturnType<UseNodeEdgeMap>['nodeIdToNodeMap']
// @ts-ignore
export type EdgeMap = ReturnType<UseNodeEdgeMap>['edgeIdToEdgeMap']

// @ts-ignore
export type Collaborator = {
// @ts-ignore
  id: string
// @ts-ignore
  name: string
// @ts-ignore
  color: string
// @ts-ignore
  mousePosition: { x: number, y: number }
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * sends a collaborators mouse movement from the client to the server.
// @ts-ignore
 * does not include the collaborators id, as the server knows this.
// @ts-ignore
 */
// @ts-ignore
export type ToServerCollaboratorMove = {
// @ts-ignore
  x: number
// @ts-ignore
  y: number
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * sends a collaborators mouse movement from the server to the client.
// @ts-ignore
 */
// @ts-ignore
export type ToClientCollaboratorMove = {
// @ts-ignore
  id: Collaborator['id']
// @ts-ignore
  x: number
// @ts-ignore
  y: number
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * maps a collaborators id to their info
// @ts-ignore
 */
// @ts-ignore
export type CollaboratorMap = Record<Collaborator['id'], Collaborator>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * graph state for collaborative graph
// @ts-ignore
 */
// @ts-ignore
export type GraphState = {
// @ts-ignore
  nodes: GNode[],
// @ts-ignore
  edges: GEdge[]
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * client-server + server-client events send via socket.io
// @ts-ignore
 */
// @ts-ignore
export interface GraphEvents {
// @ts-ignore
  nodeAdded: (node: GNode) => void
// @ts-ignore
  nodeRemoved: (nodeId: GNode['id']) => void
// @ts-ignore
  nodeMoved: (node: GNode) => void
// @ts-ignore

// @ts-ignore
  edgeAdded: (edge: GEdge) => void
// @ts-ignore
  edgeRemoved: (edgeId: GEdge['id']) => void
// @ts-ignore
  edgeLabelEdited: (edgeId: GEdge['id'], label: string) => void
// @ts-ignore

// @ts-ignore
  collaboratorJoined: (collaborator: Collaborator) => void
// @ts-ignore
  collaboratorLeft: (collaboratorId: Collaborator['id']) => void
// @ts-ignore

// @ts-ignore
  toServerCollaboratorMoved: (collaboratorMove: ToServerCollaboratorMove) => void
// @ts-ignore
  toClientCollaboratorMoved: (collaboratorMove: ToClientCollaboratorMove) => void
// @ts-ignore

// @ts-ignore
  joinRoom: (
// @ts-ignore
    joinOptions: Collaborator & { roomId: string },
// @ts-ignore
    joinWithGraphState: GraphState | null,
// @ts-ignore
    mapCallback: (collabMap: CollaboratorMap, graphState: GraphState) => void
// @ts-ignore
  ) => void
// @ts-ignore

// @ts-ignore
  leaveRoom: (confirmationCallback: () => void) => void
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * list of colors that may be assigned to collaborators
// @ts-ignore
 */
// @ts-ignore
export const COLLAB_COLORS = [
// @ts-ignore
  colors.AMBER_600,
// @ts-ignore
  colors.BLUE_600,
// @ts-ignore
  colors.CYAN_600,
// @ts-ignore
  colors.GREEN_600,
// @ts-ignore
  colors.INDIGO_600,
// @ts-ignore
  colors.LIME_600,
// @ts-ignore
  colors.ORANGE_600,
// @ts-ignore
  colors.PINK_600,
// @ts-ignore
  colors.PURPLE_600,
// @ts-ignore
  colors.RED_600,
// @ts-ignore
]
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * list of default names for collaborators
// @ts-ignore
 */
// @ts-ignore
export const COLLAB_NAMES = [
// @ts-ignore
  'Joud',
// @ts-ignore
  'Zavier',
// @ts-ignore
  'Thomas',
// @ts-ignore
  'Jaime',
// @ts-ignore
  'Dila',
// @ts-ignore
  'Bella',
// @ts-ignore
  'Julian',
// @ts-ignore
  'Adriana',
// @ts-ignore
  'Juliana',
// @ts-ignore
  'Yona'
// @ts-ignore
]

// @ts-ignore
export type ActiveDragNode = {
// @ts-ignore
  node: GNode,
// @ts-ignore
  startingCoordinates: { x: number, y: number }
}

// @ts-ignore
export type Id = SchemaItem['id']
// @ts-ignore
export type MaybeId = Id | undefined
// @ts-ignore

// @ts-ignore
export type FocusedItem = {
// @ts-ignore
  type: 'node',
// @ts-ignore
  item: GNode,
// @ts-ignore
} | {
// @ts-ignore
  type: 'edge',
// @ts-ignore
  item: GEdge,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type ValidFocusableTypes = SchemaItem['graphType'] & FocusedItem['type']
// @ts-ignore

// @ts-ignore
export const FOCUSABLE_GRAPH_TYPES: ValidFocusableTypes[] = ['node', 'edge']
// @ts-ignore
export const FOCUS_THEME_ID = 'use-focus-graph'

// @ts-ignore
export type GNodeRecord = {
// @ts-ignore
  graphType: 'node',
// @ts-ignore
  data: GNode
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * affected items that are nodes and have been moved
// @ts-ignore
 */
// @ts-ignore
export type GNodeMoveRecord = {
// @ts-ignore
  graphType: 'node',
// @ts-ignore
  data: {
// @ts-ignore
    id: string,
// @ts-ignore
    from: { x: number, y: number },
// @ts-ignore
    to: { x: number, y: number }
// @ts-ignore
  }
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * affected items that are edges
// @ts-ignore
 */
// @ts-ignore
export type GEdgeRecord = {
// @ts-ignore
  graphType: 'edge',
// @ts-ignore
  data: GEdge
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * a record indicating an item in the graph was added or removed
// @ts-ignore
 */
// @ts-ignore
export type AddRemoveRecord = {
// @ts-ignore
  /**
// @ts-ignore
   * the action that was taken in order to create this record.
// @ts-ignore
   */
// @ts-ignore
  action: 'add' | 'remove',
// @ts-ignore
  /**
// @ts-ignore
   * the items that were affected by the action.
// @ts-ignore
   */
// @ts-ignore
  affectedItems: (GNodeRecord | GEdgeRecord)[];
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * a record indicating an item in the graph was moved
// @ts-ignore
 */
// @ts-ignore
export type MoveRecord = {
// @ts-ignore
  /**
// @ts-ignore
   * the action that was taken in order to create this record.
// @ts-ignore
   */
// @ts-ignore
  action: 'move',
// @ts-ignore
  /**
// @ts-ignore
   * the items that were affected by the action.
// @ts-ignore
   */
// @ts-ignore
  affectedItems: GNodeMoveRecord[];
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * a record of an event stored in the history stack of a graph.
// @ts-ignore
 * provides for undo/redo functionality
// @ts-ignore
 */
// @ts-ignore
export type HistoryRecord = AddRemoveRecord | MoveRecord;

// @ts-ignore
export type NodeAnchor = {
// @ts-ignore
  /**
// @ts-ignore
   * the x-coordinate of the anchor
// @ts-ignore
   */
// @ts-ignore
  x: number,
// @ts-ignore
  /**
// @ts-ignore
   * the y-coordinate of the anchor
// @ts-ignore
   */
// @ts-ignore
  y: number,
// @ts-ignore
  /**
// @ts-ignore
   * the direction of the anchor relative to the parent node.
// @ts-ignore
   * ie the north anchor is the one that spawns above the node
// @ts-ignore
   */
// @ts-ignore
  direction: 'north' | 'east' | 'south' | 'west',
// @ts-ignore
  /**
// @ts-ignore
   * the unique id of the anchor
// @ts-ignore
   */
// @ts-ignore
  id: string,
}

// @ts-ignore
export type GraphEventMap = ImportedGraphEventMap

// @ts-ignore
export type EventMapToEventBus<T> = Record<keyof T, Set<any>>

// @ts-ignore
export type GraphEvent = keyof GraphEventMap;

// @ts-ignore
type PermissiveParams<T> = T extends (...args: infer P) => any ? P : never;

// @ts-ignore
export type GenerateSubscriber<
// @ts-ignore
  T extends GraphEventMap = GraphEventMap
// @ts-ignore
> = typeof generateSubscriber<T>;
// @ts-ignore

// @ts-ignore
export type Subscriber<
// @ts-ignore
  T extends GraphEventMap = GraphEventMap
// @ts-ignore
> = ReturnType<GenerateSubscriber<T>>['subscribe'];
// @ts-ignore

// @ts-ignore
export type Unsubscriber<
// @ts-ignore
  T extends GraphEventMap = GraphEventMap
// @ts-ignore
> = ReturnType<GenerateSubscriber<T>>['unsubscribe'];
// @ts-ignore

// @ts-ignore
export type Emitter<
// @ts-ignore
  T extends GraphEventMap = GraphEventMap
// @ts-ignore
> = ReturnType<GenerateSubscriber<T>>['emit'];
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @returns an empty event bus with all events initialized to empty sets
// @ts-ignore
 */
// @ts-ignore
export const getInitialEventBus = () => {
// @ts-ignore
  const eventBus = {
// @ts-ignore
    /**
// @ts-ignore
     * BaseGraphEvents
// @ts-ignore
     */
// @ts-ignore
    onStructureChange: new Set(),
// @ts-ignore

// @ts-ignore
    onNodeAdded: new Set(),
// @ts-ignore
    onBulkNodeAdded: new Set(),
// @ts-ignore

// @ts-ignore
    onNodeRemoved: new Set(),
// @ts-ignore
    onBulkNodeRemoved: new Set(),
// @ts-ignore

// @ts-ignore
    onNodeMoved: new Set(),
// @ts-ignore
    onBulkNodeMoved: new Set(),
// @ts-ignore

// @ts-ignore
    onEdgeAdded: new Set(),
// @ts-ignore
    onBulkEdgeAdded: new Set(),
// @ts-ignore

// @ts-ignore
    onEdgeRemoved: new Set(),
// @ts-ignore
    onBulkEdgeRemoved: new Set(),
// @ts-ignore

// @ts-ignore
    onEdgeLabelChange: new Set(),
// @ts-ignore

// @ts-ignore
    onRepaint: new Set(),
// @ts-ignore
    onNodeHoverChange: new Set(),
// @ts-ignore
    onGraphReset: new Set(),
// @ts-ignore

// @ts-ignore
    onClick: new Set(),
// @ts-ignore
    onMouseDown: new Set(),
// @ts-ignore
    onMouseUp: new Set(),
// @ts-ignore
    onMouseMove: new Set(),
// @ts-ignore
    onDblClick: new Set(),
// @ts-ignore
    onContextMenu: new Set(),
// @ts-ignore

// @ts-ignore
    onKeydown: new Set(),
// @ts-ignore

// @ts-ignore
    onThemeChange: new Set(),
// @ts-ignore
    onSettingsChange: new Set(),
// @ts-ignore

// @ts-ignore
    /**
// @ts-ignore
     * HistoryGraphEvents
// @ts-ignore
     */
// @ts-ignore
    onUndo: new Set(),
// @ts-ignore
    onRedo: new Set(),
// @ts-ignore

// @ts-ignore
    /**
// @ts-ignore
     * FocusGraphEvents
// @ts-ignore
     */
// @ts-ignore
    onFocusChange: new Set(),
// @ts-ignore

// @ts-ignore
    /**
// @ts-ignore
     * DraggableGraphEvents
// @ts-ignore
     */
// @ts-ignore
    onNodeDragStart: new Set(),
// @ts-ignore
    onNodeDrop: new Set(),
// @ts-ignore

// @ts-ignore
    /**
// @ts-ignore
     * NodeAnchorGraphEvents
// @ts-ignore
     */
// @ts-ignore
    onNodeAnchorDragStart: new Set(),
// @ts-ignore
    onNodeAnchorDrop: new Set(),
// @ts-ignore
  } as const satisfies GraphEventBus
// @ts-ignore

// @ts-ignore
  return eventBus
}

// @ts-ignore
export type BaseGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when a node or edge is added or removed from the graph
// @ts-ignore
   */
// @ts-ignore
  onStructureChange: (nodes: GNode[], edges: GEdge[]) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when a node is added to the graph
// @ts-ignore
   */
// @ts-ignore
  onNodeAdded: (node: GNode, options: AddNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when multiple nodes are added to the graph as a group
// @ts-ignore
   */
// @ts-ignore
  onBulkNodeAdded: (nodes: GNode[], options: AddNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when a node is removed from the graph
// @ts-ignore
   */
// @ts-ignore
  onNodeRemoved: (removedNode: GNode, removedEdges: GEdge[], options: RemoveNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when multiple nodes are removed from the graph as a group
// @ts-ignore
   */
// @ts-ignore
  onBulkNodeRemoved: (removedNodes: GNode[], removedEdges: GEdge[], options: RemoveNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when a node is moved to a new position on the canvas
// @ts-ignore
   */
// @ts-ignore
  onNodeMoved: (node: GNode, options: MoveNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when multiple nodes are moved to new positions on the canvas in as a group
// @ts-ignore
   */
// @ts-ignore
  onBulkNodeMoved: (nodes: GNode[], options: MoveNodeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when an edge is added to the graph
// @ts-ignore
   */
// @ts-ignore
  onEdgeAdded: (edge: GEdge, options: AddEdgeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when multiple edges are added to the graph as a group
// @ts-ignore
   */
// @ts-ignore
  onBulkEdgeAdded: (edges: GEdge[], options: AddEdgeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when an edge is removed from the graph
// @ts-ignore
   */
// @ts-ignore
  onEdgeRemoved: (edge: GEdge, options: RemoveEdgeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when multiple edges are removed from the graph as a group
// @ts-ignore
   */
// @ts-ignore
  onBulkEdgeRemoved: (edges: GEdge[], options: RemoveEdgeOptions) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when an edge's text label is changed
// @ts-ignore
   */
// @ts-ignore
  onEdgeLabelChange: (edge: GEdge) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the canvas is repainted
// @ts-ignore
   *
// @ts-ignore
   * WARNING: items drawn to the canvas using ctx won't be tied to graphs internal state.
// @ts-ignore
   * Use updateAggregator if you need drawn item to integrate with graph APIs
// @ts-ignore
   */
// @ts-ignore
  onRepaint: (ctx: CanvasRenderingContext2D, repaintId: string) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the node that the user is hovering over changes.
// @ts-ignore
   * undefined if the user is not hovering over a node
// @ts-ignore
   */
// @ts-ignore
  onNodeHoverChange: (newNode: GNode | undefined, oldNode: GNode | undefined) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the reset process is triggered
// @ts-ignore
   */
// @ts-ignore
  onGraphReset: () => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the canvas is clicked on (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onClick: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user clicks the mouse button on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onMouseDown: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user releases the mouse button on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onMouseUp: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user moves the mouse on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onMouseMove: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the canvas is double clicked on (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onDblClick: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the canvas is right clicked on (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onContextMenu: (ev: MouseEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when a key is pressed down on the canvas (native dom event)
// @ts-ignore
   */
// @ts-ignore
  onKeydown: (ev: KeyboardEvent) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the graph theme is changed
// @ts-ignore
   */
// @ts-ignore
  onThemeChange: (diff: DeepPartial<GraphTheme>) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the settings of the graph are changed
// @ts-ignore
   */
// @ts-ignore
  onSettingsChange: (diff: DeepPartial<GraphSettings>) => void;
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type HistoryGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when the undo action is triggered
// @ts-ignore
   */
// @ts-ignore
  onUndo: (historyRecord: HistoryRecord) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the redo action is triggered
// @ts-ignore
   */
// @ts-ignore
  onRedo: (historyRecord: HistoryRecord) => void;
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type FocusGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when the focus item (ie nodes or edges) changes.
// @ts-ignore
   * undefined if the user is not focusing on an item
// @ts-ignore
   */
// @ts-ignore
  onFocusChange: (newItemId: string | undefined, oldItemId: string | undefined) => void;
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type DraggableGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when the user initiates a drag on a node
// @ts-ignore
   */
// @ts-ignore
  onNodeDragStart: (node: GNode) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user drops a node
// @ts-ignore
   */
// @ts-ignore
  onNodeDrop: (node: GNode) => void;
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type NodeAnchorGraphEventMap = {
// @ts-ignore
  /**
// @ts-ignore
   * when the user initiates a drag on a node anchor
// @ts-ignore
   */
// @ts-ignore
  onNodeAnchorDragStart: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
// @ts-ignore
  /**
// @ts-ignore
   * when the user drops a node anchor
// @ts-ignore
   */
// @ts-ignore
  onNodeAnchorDrop: (parentNode: GNode, nodeAnchor: NodeAnchor) => void;
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type MarqueeGraphEventMap = {}
// @ts-ignore

// @ts-ignore
export type UserEditableGraphEventMap = {}
// @ts-ignore

// @ts-ignore
export type PersistentGraphEventMap = {}
// @ts-ignore

// @ts-ignore
export type CollaborativeGraphEventMap = {}
// @ts-ignore

// @ts-ignore
export type GraphEventMap = (
// @ts-ignore
  BaseGraphEventMap &
// @ts-ignore
  HistoryGraphEventMap &
// @ts-ignore
  FocusGraphEventMap &
// @ts-ignore
  DraggableGraphEventMap &
// @ts-ignore
  NodeAnchorGraphEventMap &
// @ts-ignore
  MarqueeGraphEventMap &
// @ts-ignore
  UserEditableGraphEventMap &
// @ts-ignore
  PersistentGraphEventMap &
// @ts-ignore
  CollaborativeGraphEventMap
// @ts-ignore
)

// @ts-ignore
export type LabelledItem = { label: string };

// @ts-ignore
export type SupportedNodeShapes = 'circle' | 'square'

// @ts-ignore
export type BaseGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether to display edge labels
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  displayEdgeLabels: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * whether edge labels should be editable
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  edgeLabelsEditable: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * a setter for edge labels - takes the user inputted string and returns a string that will
// @ts-ignore
   * be set as the edge label or returns undefined if the edge label should not be set
// @ts-ignore
   * @default function tries converting the user input to a number
// @ts-ignore
   */
// @ts-ignore
  edgeInputToLabel: (input: string) => string | undefined;
// @ts-ignore
  /**
// @ts-ignore
   * a function that returns a new label for a node when a new node is created.
// @ts-ignore
   * if null, new nodes will be generated alphabetically: A, B, C, ... Z, AA, AB, ...
// @ts-ignore
   * @default null
// @ts-ignore
   */
// @ts-ignore
  newNodeLabelGetter: null | (() => string);
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const DEFAULT_BASE_SETTINGS: BaseGraphSettings = {
// @ts-ignore
  displayEdgeLabels: true,
// @ts-ignore
  edgeLabelsEditable: true,
// @ts-ignore
  edgeInputToLabel: (input: string) => {
// @ts-ignore
    const trimmed = input.trim()
// @ts-ignore
    if (!trimmed) return
// @ts-ignore
    const decimalNum = fractionToDecimal(trimmed)?.toFixed(2)
// @ts-ignore
    if (decimalNum === "Infinity") return '∞'
// @ts-ignore
    else if (decimalNum === "-Infinity") return '-∞'
// @ts-ignore
    else if (decimalNum === undefined && isNaN(Number(trimmed))) return
// @ts-ignore
    return decimalNum ?? trimmed
// @ts-ignore
  },
// @ts-ignore
  newNodeLabelGetter: null,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * FOCUS GRAPH SETTINGS
// @ts-ignore
 */
// @ts-ignore
export type FocusGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * if false, no items on the graph can be focused
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  focusable: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * a list of item ids that cannot be focused
// @ts-ignore
   * @default []
// @ts-ignore
   */
// @ts-ignore
  focusBlacklist: string[];
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const DEFAULT_FOCUS_SETTINGS: FocusGraphSettings = {
// @ts-ignore
  focusable: true,
// @ts-ignore
  focusBlacklist: [],
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * DRAGGABLE GRAPH SETTINGS
// @ts-ignore
 */
// @ts-ignore
export type DraggableGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether the graph is draggable
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  draggable: boolean;
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const DEFAULT_DRAGGABLE_SETTINGS: DraggableGraphSettings = {
// @ts-ignore
  draggable: true,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * NODE ANCHOR GRAPH SETTINGS
// @ts-ignore
 */
// @ts-ignore
export type NodeAnchorGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether node anchors are enabled
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  nodeAnchors: boolean
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const DEFAULT_NODE_ANCHOR_SETTINGS: NodeAnchorGraphSettings = {
// @ts-ignore
  nodeAnchors: true
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * MARQUEE GRAPH SETTINGS
// @ts-ignore
 */
// @ts-ignore
export type MarqueeGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether marquee selection is enabled
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  marquee: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * the types of graph items that can be marquee-selected
// @ts-ignore
   * @default ['node', 'edge']
// @ts-ignore
   */
// @ts-ignore
  marqueeSelectableGraphTypes: SchemaItem['graphType'][];
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const DEFAULT_MARQUEE_SETTINGS: MarqueeGraphSettings = {
// @ts-ignore
  marquee: true,
// @ts-ignore
  marqueeSelectableGraphTypes: ['node', 'edge'],
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * USER EDITABLE GRAPH SETTINGS
// @ts-ignore
 */
// @ts-ignore
export type UserEditableGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether the user can edit the graph
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  userEditable: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * the type of edge to add when creating an edge between nodes
// @ts-ignore
   * @default "directed"
// @ts-ignore
   */
// @ts-ignore
  userAddedEdgeType: 'directed' | 'undirected',
// @ts-ignore
  /**
// @ts-ignore
   * the default label assigned to edges when created using the UI
// @ts-ignore
   * @default 1
// @ts-ignore
   */
// @ts-ignore
  userAddedEdgeLabel: string,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const DEFAULT_USER_EDITABLE_SETTINGS: UserEditableGraphSettings = {
// @ts-ignore
  userEditable: true,
// @ts-ignore
  userAddedEdgeType: 'directed',
// @ts-ignore
  userAddedEdgeLabel: "1",
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * PERSISTENT GRAPH SETTINGS
// @ts-ignore
 */
// @ts-ignore
export type PersistentGraphSettings = {
// @ts-ignore
  /**
// @ts-ignore
   * whether the graph is persistent
// @ts-ignore
   * @default true
// @ts-ignore
   */
// @ts-ignore
  persistent: boolean;
// @ts-ignore
  /**
// @ts-ignore
   * the key to use for storing the graph in local storage
// @ts-ignore
   * @default "graph"
// @ts-ignore
   */
// @ts-ignore
  persistentStorageKey: string,
// @ts-ignore
  /**
// @ts-ignore
   * whether to track theme changes
// @ts-ignore
   * @default false
// @ts-ignore
   */
// @ts-ignore
  persistentTrackTheme: boolean,
// @ts-ignore
  /**
// @ts-ignore
   * whether to track settings changes
// @ts-ignore
   * @default false
// @ts-ignore
   */
// @ts-ignore
  persistentTrackSettings: boolean,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const DEFAULT_PERSISTENT_SETTINGS: PersistentGraphSettings = {
// @ts-ignore
  persistent: true,
// @ts-ignore
  persistentStorageKey: 'graph',
// @ts-ignore
  persistentTrackTheme: false,
// @ts-ignore
  persistentTrackSettings: false,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * COLLABORATIVE GRAPH SETTINGS
// @ts-ignore
 */
// @ts-ignore
export type CollaborativeGraphSettings = {}
// @ts-ignore

// @ts-ignore
export const DEFAULT_COLLABORATIVE_SETTINGS: CollaborativeGraphSettings = {}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * represents all settings on a graph instance
// @ts-ignore
 */
// @ts-ignore
export type GraphSettings = (
// @ts-ignore
  BaseGraphSettings &
// @ts-ignore
  FocusGraphSettings &
// @ts-ignore
  DraggableGraphSettings &
// @ts-ignore
  NodeAnchorGraphSettings &
// @ts-ignore
  MarqueeGraphSettings &
// @ts-ignore
  UserEditableGraphSettings &
// @ts-ignore
  PersistentGraphSettings &
// @ts-ignore
  CollaborativeGraphSettings
// @ts-ignore
)
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * the default settings for a graph instance
// @ts-ignore
 */
// @ts-ignore
export const DEFAULT_GRAPH_SETTINGS = {
// @ts-ignore
  ...DEFAULT_BASE_SETTINGS,
// @ts-ignore
  ...DEFAULT_FOCUS_SETTINGS,
// @ts-ignore
  ...DEFAULT_DRAGGABLE_SETTINGS,
// @ts-ignore
  ...DEFAULT_NODE_ANCHOR_SETTINGS,
// @ts-ignore
  ...DEFAULT_MARQUEE_SETTINGS,
// @ts-ignore
  ...DEFAULT_USER_EDITABLE_SETTINGS,
// @ts-ignore
  ...DEFAULT_PERSISTENT_SETTINGS,
// @ts-ignore
  ...DEFAULT_COLLABORATIVE_SETTINGS,
// @ts-ignore
} as const satisfies GraphSettings

// @ts-ignore
type ModifiedExtract<T, U, R = never> = T extends U ? T : R

// @ts-ignore
type FuncExtract<T, U> = ModifiedExtract<T, U, () => void>

// @ts-ignore
type ThemeParams<T extends keyof GraphTheme> = Parameters<FuncExtract<GraphTheme[T], Function>>

// @ts-ignore
type ResolvedThemeParams<T extends keyof GraphTheme> = ThemeParams<T> extends []
// @ts-ignore
  ? [] : Exclude<ThemeParams<T>, []>;
// @ts-ignore

// @ts-ignore

// @ts-ignore
export const getThemeResolver = (
// @ts-ignore
  theme: Ref<Partial<GraphTheme>>,
// @ts-ignore
  themeMap: FullThemeMap,
// @ts-ignore
) => <
// @ts-ignore
  T extends keyof GraphTheme,
// @ts-ignore
  K extends ResolvedThemeParams<T>
// @ts-ignore
>(
// @ts-ignore
  prop: T,
// @ts-ignore
  ...args: K
// @ts-ignore
) => {
// @ts-ignore
    const themeMapEntry = themeMap[prop].findLast((themeMapEntryItem: FullThemeMap[T][number]) => {
// @ts-ignore
      const themeGetterOrValue = themeMapEntryItem.value
// @ts-ignore
      const themeValue = getValue<typeof themeGetterOrValue, K>(
// @ts-ignore
        themeGetterOrValue,
// @ts-ignore
        ...args
// @ts-ignore
      ) as UnwrapMaybeGetter<GraphTheme[T]>
// @ts-ignore
      return themeValue ?? false
// @ts-ignore
    })
// @ts-ignore
    const getter = themeMapEntry?.value ?? theme.value[prop]
// @ts-ignore
    if (!getter) throw new Error(`Theme property "${prop}" not found`)
// @ts-ignore
    return getValue<typeof getter, K>(getter, ...args) as UnwrapMaybeGetter<GraphTheme[T]>
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * describes the function that gets a value from a theme inquiry
// @ts-ignore
 */
// @ts-ignore
export type ThemeGetter = ReturnType<typeof getThemeResolver>

// @ts-ignore
export type GraphTheme = GraphThemeImport
// @ts-ignore
export type GraphThemeKey = keyof GraphTheme
// @ts-ignore

// @ts-ignore
export const THEMES = {
// @ts-ignore
  light: LIGHT_THEME,
// @ts-ignore
  dark: DARK_THEME,
// @ts-ignore
  girl: GIRL_THEME,
// @ts-ignore
} as const satisfies Record<string, GraphTheme>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * gets the theme attributes for a GNode at the point in time the function is called
// @ts-ignore
 *
// @ts-ignore
 * @param getTheme - the theme getter function
// @ts-ignore
 * @param node - the node to get the theme for
// @ts-ignore
 * @returns the theme attributes for the node
// @ts-ignore
 */
// @ts-ignore
export const resolveThemeForNode = (getTheme: ThemeGetter, node: GNode): BaseGraphNodeTheme => ({
// @ts-ignore
  nodeSize: getTheme('nodeSize', node),
// @ts-ignore
  nodeBorderWidth: getTheme('nodeBorderWidth', node),
// @ts-ignore
  nodeColor: getTheme('nodeColor', node),
// @ts-ignore
  nodeBorderColor: getTheme('nodeBorderColor', node),
// @ts-ignore
  nodeTextSize: getTheme('nodeTextSize', node),
// @ts-ignore
  nodeTextColor: getTheme('nodeTextColor', node),
// @ts-ignore
  nodeText: getTheme('nodeText', node),
// @ts-ignore
  nodeShape: getTheme('nodeShape', node),
// @ts-ignore
})
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * gets the theme attributes for a GEdge at the point in time the function is called
// @ts-ignore
 *
// @ts-ignore
 * @param getTheme - the theme getter function
// @ts-ignore
 * @param edge - the edge to get the theme for
// @ts-ignore
 * @returns the theme attributes for the edge
// @ts-ignore
 */
// @ts-ignore
export const resolveThemeForEdge = (getTheme: ThemeGetter, edge: GEdge): BaseGraphEdgeTheme => ({
// @ts-ignore
  edgeWidth: getTheme('edgeWidth', edge),
// @ts-ignore
  edgeColor: getTheme('edgeColor', edge),
// @ts-ignore
  edgeTextSize: getTheme('edgeTextSize', edge),
// @ts-ignore
  edgeTextColor: getTheme('edgeTextColor', edge),
// @ts-ignore
  edgeTextFontWeight: getTheme('edgeTextFontWeight', edge),
// @ts-ignore
})

// @ts-ignore
export type NonColorGraphThemes = Pick<
// @ts-ignore
  GraphTheme,
// @ts-ignore
  'nodeShape' |
// @ts-ignore
  'nodeSize' |
// @ts-ignore
  'nodeBorderWidth' |
// @ts-ignore
  'nodeTextSize' |
// @ts-ignore
  'nodeAnchorRadius' |
// @ts-ignore
  'edgeWidth' |
// @ts-ignore
  'edgeTextSize' |
// @ts-ignore
  'nodeText' |
// @ts-ignore
  'edgeTextFontWeight' |
// @ts-ignore
  'linkPreviewWidth'
// @ts-ignore
>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * themes that do not depend on color scheme
// @ts-ignore
 */
// @ts-ignore
export const NON_COLOR_THEMES: NonColorGraphThemes = {
// @ts-ignore
  nodeShape: 'circle',
// @ts-ignore
  nodeSize: 35,
// @ts-ignore
  nodeBorderWidth: 8,
// @ts-ignore
  nodeTextSize: 24,
// @ts-ignore
  // Math.ceil(Math.sqrt(nodeSize) * 2)
// @ts-ignore
  nodeAnchorRadius: Math.ceil(Math.sqrt(35) * 2),
// @ts-ignore
  edgeWidth: 10,
// @ts-ignore
  edgeTextSize: 20,
// @ts-ignore
  nodeText: ({ label }) => label,
// @ts-ignore
  edgeTextFontWeight: 'bold',
// @ts-ignore
  linkPreviewWidth: 10,
}

// @ts-ignore
export type UITheme = {
// @ts-ignore
  primaryColor: string,
// @ts-ignore
  primaryTextColor: string,
// @ts-ignore
  secondaryColor: string,
// @ts-ignore
  secondaryTextColor: string,
// @ts-ignore
  tertiaryColor: string,
// @ts-ignore
  tertiaryTextColor: string,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type BaseGraphNodeTheme = {
// @ts-ignore
  nodeSize: number,
// @ts-ignore
  nodeBorderWidth: number,
// @ts-ignore
  nodeColor: string,
// @ts-ignore
  nodeBorderColor: string,
// @ts-ignore
  nodeText: string,
// @ts-ignore
  nodeTextSize: number,
// @ts-ignore
  nodeTextColor: string,
// @ts-ignore
  nodeShape: SupportedNodeShapes,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type BaseGraphEdgeTheme = {
// @ts-ignore
  edgeColor: string,
// @ts-ignore
  edgeWidth: number,
// @ts-ignore
  edgeTextSize: number,
// @ts-ignore
  edgeTextColor: string,
// @ts-ignore
  edgeTextFontWeight: TextFontWeight,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type BaseGraphTheme = WrapWithNodeGetter<BaseGraphNodeTheme> & WrapWithEdgeGetter<BaseGraphEdgeTheme> & {
// @ts-ignore
  graphBgColor: string,
// @ts-ignore
  graphBgPatternColor: string,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type HistoryGraphTheme = {}
// @ts-ignore

// @ts-ignore
export type FocusGraphTheme = {
// @ts-ignore
  nodeFocusColor: NodeGetterOrValue<string>;
// @ts-ignore
  nodeFocusBorderColor: NodeGetterOrValue<string>;
// @ts-ignore
  nodeFocusTextColor: NodeGetterOrValue<string>;
// @ts-ignore
  edgeFocusColor: EdgeGetterOrValue<string>;
// @ts-ignore
  edgeFocusTextColor: EdgeGetterOrValue<string>;
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type DraggableGraphTheme = {}
// @ts-ignore

// @ts-ignore
export type NodeAnchorGraphTheme = {
// @ts-ignore
  nodeAnchorRadius: NodeGetterOrValue<number>;
// @ts-ignore
  nodeAnchorColor: NodeGetterOrValue<string>;
// @ts-ignore
  nodeAnchorColorWhenParentFocused: NodeGetterOrValue<string>;
// @ts-ignore
  linkPreviewColor: MaybeGetter<string, [GNode, NodeAnchor]>;
// @ts-ignore
  linkPreviewWidth: MaybeGetter<number, [GNode, NodeAnchor]>;
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type MarqueeGraphTheme = {
// @ts-ignore
  marqueeSelectionBoxColor: string,
// @ts-ignore
  marqueeSelectionBoxBorderColor: string,
// @ts-ignore
  marqueeEncapsulatedNodeBoxColor: string,
// @ts-ignore
  marqueeEncapsulatedNodeBoxBorderColor: string,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type UserEditableGraphTheme = {}
// @ts-ignore

// @ts-ignore
export type PersistentGraphTheme = {}
// @ts-ignore

// @ts-ignore
export type CollaborativeGraphTheme = {}
// @ts-ignore

// @ts-ignore
export type GraphTheme = (
// @ts-ignore
  UITheme &
// @ts-ignore
  BaseGraphTheme &
// @ts-ignore
  HistoryGraphTheme &
// @ts-ignore
  FocusGraphTheme &
// @ts-ignore
  DraggableGraphTheme &
// @ts-ignore
  NodeAnchorGraphTheme &
// @ts-ignore
  MarqueeGraphTheme &
// @ts-ignore
  UserEditableGraphTheme &
// @ts-ignore
  PersistentGraphTheme &
// @ts-ignore
  CollaborativeGraphTheme
// @ts-ignore
)
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * decomposes MaybeGetter<T, K> such that it turns T into T | void
// @ts-ignore
 */
// @ts-ignore
export type MaybeGetterOrVoid<T> = MaybeGetter<UnwrapMaybeGetter<T> | void, MaybeGetterParams<T>>
// @ts-ignore

// @ts-ignore
type WrapWithNodeGetter<T extends Record<string, any>> = {
// @ts-ignore
  [K in keyof T]: NodeGetterOrValue<T[K]>
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
type WrapWithEdgeGetter<T extends Record<string, any>> = {
// @ts-ignore
  [K in keyof T]: EdgeGetterOrValue<T[K]>
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type ThemeMapEntry<T extends keyof GraphTheme> = {
// @ts-ignore
  value: MaybeGetterOrVoid<GraphTheme[T]>,
// @ts-ignore
  useThemeId: string,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type FullThemeMap = {
// @ts-ignore
  [K in keyof GraphTheme]: ThemeMapEntry<K>[]
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type PartialThemeMap = Partial<FullThemeMap>
// @ts-ignore

// @ts-ignore
export const getInitialThemeMap = (): FullThemeMap => ({
// @ts-ignore
  /**
// @ts-ignore
   * UI themes
// @ts-ignore
   */
// @ts-ignore
  primaryColor: [],
// @ts-ignore
  secondaryColor: [],
// @ts-ignore
  tertiaryColor: [],
// @ts-ignore
  primaryTextColor: [],
// @ts-ignore
  secondaryTextColor: [],
// @ts-ignore
  tertiaryTextColor: [],
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * base themes
// @ts-ignore
   */
// @ts-ignore
  nodeSize: [],
// @ts-ignore
  nodeBorderWidth: [],
// @ts-ignore
  nodeColor: [],
// @ts-ignore
  nodeBorderColor: [],
// @ts-ignore
  nodeFocusColor: [],
// @ts-ignore
  nodeFocusBorderColor: [],
// @ts-ignore
  nodeText: [],
// @ts-ignore
  nodeFocusTextColor: [],
// @ts-ignore
  nodeTextSize: [],
// @ts-ignore
  nodeTextColor: [],
// @ts-ignore
  nodeShape: [],
// @ts-ignore
  edgeColor: [],
// @ts-ignore
  edgeWidth: [],
// @ts-ignore
  edgeTextSize: [],
// @ts-ignore
  edgeTextColor: [],
// @ts-ignore
  edgeFocusTextColor: [],
// @ts-ignore
  edgeTextFontWeight: [],
// @ts-ignore
  edgeFocusColor: [],
// @ts-ignore

// @ts-ignore
  graphBgColor: [],
// @ts-ignore
  graphBgPatternColor: [],
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * node anchor themes
// @ts-ignore
   */
// @ts-ignore
  nodeAnchorRadius: [],
// @ts-ignore
  nodeAnchorColor: [],
// @ts-ignore
  nodeAnchorColorWhenParentFocused: [],
// @ts-ignore
  linkPreviewColor: [],
// @ts-ignore
  linkPreviewWidth: [],
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * marquee themes
// @ts-ignore
   */
// @ts-ignore
  marqueeSelectionBoxColor: [],
// @ts-ignore
  marqueeSelectionBoxBorderColor: [],
// @ts-ignore
  marqueeEncapsulatedNodeBoxColor: [],
// @ts-ignore
  marqueeEncapsulatedNodeBoxBorderColor: [],
// @ts-ignore
})
// @ts-ignore

// @ts-ignore
type ThemeableGraph = Pick<Graph, 'themeMap' | 'repaint'>

// @ts-ignore
export type TutorialStepForEvent<T extends GraphEvent> = {
// @ts-ignore
  /**
// @ts-ignore
   * the hint to display to the user in order to complete the step
// @ts-ignore
   */
// @ts-ignore
  hint: string;
// @ts-ignore
  /**
// @ts-ignore
   * the event that triggers a dismiss inquiry, if its just the event itself (T), then the step will be dismissed
// @ts-ignore
   * upon invocation of the event via event bus, if its an object, then the step will be dismissed upon invocation
// @ts-ignore
   * of the event and only if the predicate returns true
// @ts-ignore
   */
// @ts-ignore
  dismiss: T | {
// @ts-ignore
    event: T,
// @ts-ignore
    /**
// @ts-ignore
     * @param args the arguments passed to the event handler as defined in the event map
// @ts-ignore
     * @returns true if the step should be dismissed
// @ts-ignore
     */
// @ts-ignore
    predicate: (...args: Parameters<GraphEventMap[T]>) => boolean
// @ts-ignore
  };
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * describes a step that will resolve after a set amount of time
// @ts-ignore
 */
// @ts-ignore
export type TimeoutStep = {
// @ts-ignore
  hint: string,
// @ts-ignore
  dismiss: 'onTimeout',
// @ts-ignore
  /**
// @ts-ignore
   * time to wait before the next step, in milliseconds
// @ts-ignore
   */
// @ts-ignore
  after: number,
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
type SharedStepProps = {
// @ts-ignore
  /**
// @ts-ignore
   * the text shown to the user in order to help guide them along
// @ts-ignore
   */
// @ts-ignore
  hint: string,
// @ts-ignore
  /**
// @ts-ignore
   * describes the precondition option for a tutorial step.
// @ts-ignore
   * a precondition allows the implementer to run a function before the step is shown.
// @ts-ignore
   * its boolean return acts just as a predicate would act as defined in base tutorial step.
// @ts-ignore
   * if the precondition returns true, its like the condition for going to the next step is
// @ts-ignore
   * already met, so the step will be skipped.
// @ts-ignore
   */
// @ts-ignore
  precondition?: (graph: Graph) => boolean,
// @ts-ignore
  /**
// @ts-ignore
   * callback to run when the step is initialized.
// @ts-ignore
   * runs before precondition
// @ts-ignore
   */
// @ts-ignore
  onInit?: () => void,
// @ts-ignore
  /**
// @ts-ignore
   * callback to run when the step is dismissed
// @ts-ignore
   */
// @ts-ignore
  onDismiss?: () => void,
// @ts-ignore
  /**
// @ts-ignore
   * describes options for highlighting an element.
// @ts-ignore
   * passing a string will highlight the element with the id
// @ts-ignore
   */
// @ts-ignore
  highlightElement?: string | {
// @ts-ignore
    /**
// @ts-ignore
     * id of the element to highlight
// @ts-ignore
     */
// @ts-ignore
    id?: string;
// @ts-ignore
    /**
// @ts-ignore
     * css class name to apply to the element
// @ts-ignore
     * @default 'element-highlight'
// @ts-ignore
     */
// @ts-ignore
    className?: string;
// @ts-ignore
  }
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * describes a step that will resolve after a set amount of time conditioned upon
// @ts-ignore
 * the predicate returning true, if false the step will be re-evaluated after the interval
// @ts-ignore
 * so on and so forth until the predicate returns true
// @ts-ignore
 */
// @ts-ignore
export type IntervalStep = {
// @ts-ignore
  hint: string,
// @ts-ignore
  dismiss: 'onInterval' | {
// @ts-ignore
    event: 'onInterval',
// @ts-ignore
    /**
// @ts-ignore
     * @param iteration the number of times the interval has been called
// @ts-ignore
     * @returns true if the step should be dismissed
// @ts-ignore
     */
// @ts-ignore
    predicate: (iteration: number) => boolean
// @ts-ignore
  },
// @ts-ignore
  /**
// @ts-ignore
   * time to wait before the next evaluation, in milliseconds
// @ts-ignore
   * @default 1000 milliseconds
// @ts-ignore
   */
// @ts-ignore
  interval?: number,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const DEFAULT_INTERVAL = 1000;
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * describes a step in a tutorial sequence for a graph event
// @ts-ignore
 */
// @ts-ignore
export type GraphEventStep = {
// @ts-ignore
  [K in GraphEvent]: TutorialStepForEvent<K>
// @ts-ignore
}[GraphEvent];
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * describes a step in a tutorial sequence
// @ts-ignore
 */
// @ts-ignore
export type TutorialStep = (
// @ts-ignore
  GraphEventStep |
// @ts-ignore
  TimeoutStep |
// @ts-ignore
  IntervalStep
// @ts-ignore
) & SharedStepProps;
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * describes a list of tutorial steps that will be executed in order from index 0 to n - 1
// @ts-ignore
 */
// @ts-ignore
export type TutorialSequence = TutorialStep[];
// @ts-ignore

// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * time to wait (in milliseconds) between the dismissal of a step and the initialization of the next step
// @ts-ignore
 */
// @ts-ignore
export const DELAY_UNTIL_NEXT_STEP = 1000;
// @ts-ignore

// @ts-ignore
export const TUTORIAL_THEME_ID = 'tutorial'

// @ts-ignore
export type TutorialControls = ReturnType<typeof useBasicsTutorial>;

// @ts-ignore
export type UseGraph = typeof useGraph

// @ts-ignore
export type Graph = ReturnType<UseGraph>

// @ts-ignore
export type GraphOptions = {
// @ts-ignore
  theme: Partial<GraphTheme>;
// @ts-ignore
  settings: Partial<GraphSettings>;
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes a node in a useGraph graph instance
// @ts-ignore
 */
// @ts-ignore
export type GNode = {
// @ts-ignore
  id: string,
// @ts-ignore
  /**
// @ts-ignore
   * it reflects what the user sees in the UI.
// @ts-ignore
   * recommended to be unique.
// @ts-ignore
   */
// @ts-ignore
  label: string,
// @ts-ignore
  /**
// @ts-ignore
   * the x position of the node on the canvas
// @ts-ignore
   */
// @ts-ignore
  x: number,
// @ts-ignore
  /**
// @ts-ignore
   * the y position of the node on the canvas
// @ts-ignore
   */
// @ts-ignore
  y: number,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes an edge in a useGraph graph instance
// @ts-ignore
 */
// @ts-ignore
export type GEdge = {
// @ts-ignore
  id: string,
// @ts-ignore
  /**
// @ts-ignore
   * id of the node that the edge is coming from
// @ts-ignore
   */
// @ts-ignore
  to: string,
// @ts-ignore
  /**
// @ts-ignore
   * id of the node that the edge is going to
// @ts-ignore
   */
// @ts-ignore
  from: string,
// @ts-ignore
  /**
// @ts-ignore
   * the text label that appears on the edge - NOT IMPLEMENTED
// @ts-ignore
   */
// @ts-ignore
  label: string,
// @ts-ignore
  /**
// @ts-ignore
   * does this edge travel in one direction or both?
// @ts-ignore
   */
// @ts-ignore
  type: 'directed' | 'undirected',
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes the array in which schema items are added into in order to be rendered on the canvas
// @ts-ignore
 */
// @ts-ignore
export type Aggregator = SchemaItem[]
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes a function that takes an aggregator and returns an aggregator with alterations to
// @ts-ignore
 * the internal contents, these functions are layered on top of each other to create a pipeline
// @ts-ignore
 * which will be invoked with a reducer each render cycle
// @ts-ignore
 */
// @ts-ignore
export type UpdateAggregator = (aggregator: Aggregator) => Aggregator
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes something that takes an any[] our of a union of arrays
// @ts-ignore
 */
// @ts-ignore
export type RemoveAnyArray<T extends any[]> = T extends ['!!!-@-NOT-A-TYPE-@-!!!'][] ? never : T
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes taking some data that may be a plain value or a function that returns that value
// @ts-ignore
 *
// @ts-ignore
  @template T - the type of the value
// @ts-ignore
  @template K - the type of the arguments necessary in order to resolve the value
// @ts-ignore
*/
// @ts-ignore
export type MaybeGetter<T, K extends any[] = []> = T | ((...arg: K) => T)
// @ts-ignore

// @ts-ignore

// @ts-ignore
export type NodeGetterOrValue<T> = MaybeGetter<T, [GNode]>
// @ts-ignore
export type EdgeGetterOrValue<T> = MaybeGetter<T, [GEdge]>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes the value of a MaybeGetter
// @ts-ignore
*/
// @ts-ignore
export type UnwrapMaybeGetter<T> = T extends MaybeGetter<infer U, infer _> ? U : T
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes the parameters of a MaybeGetter
// @ts-ignore
*/
// @ts-ignore
export type MaybeGetterParams<T> = RemoveAnyArray<T extends MaybeGetter<infer _, infer K> ? K : []>
// @ts-ignore

// @ts-ignore
type EventNames = keyof HTMLElementEventMap
// @ts-ignore

// @ts-ignore
type FilterEventNames<T> = {
// @ts-ignore
  [K in EventNames]: HTMLElementEventMap[K] extends T ? K : never
// @ts-ignore
}[EventNames]
// @ts-ignore

// @ts-ignore
type MouseEventNames = FilterEventNames<MouseEvent>
// @ts-ignore
type KeyboardEventNames = FilterEventNames<KeyboardEvent>
// @ts-ignore

// @ts-ignore
type EventMap<T extends EventNames, E> = Record<T, (ev: E) => void>
// @ts-ignore

// @ts-ignore
export type MouseEventMap = EventMap<MouseEventNames, MouseEvent>
// @ts-ignore
export type KeyboardEventMap = EventMap<KeyboardEventNames, KeyboardEvent>
// @ts-ignore

// @ts-ignore
export type MouseEventEntries = [keyof MouseEventMap, (ev: MouseEvent) => void][]
// @ts-ignore
export type KeyboardEventEntries = [keyof KeyboardEventMap, (ev: KeyboardEvent) => void][]
// @ts-ignore

// @ts-ignore
type BaseGraphTypes = 'node' | 'edge'
// @ts-ignore
type MarqueeGraphTypes = 'marquee-box' | 'encapsulated-node-box'
// @ts-ignore
type NodeAnchorGraphTypes = 'node-anchor' | 'link-preview'
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * @describes a schema item that can be fed into the aggregator in order to be rendered on the canvas
// @ts-ignore
 */
// @ts-ignore
export type SchemaItem = {
// @ts-ignore
  /**
// @ts-ignore
   * unique identifier for the schema item
// @ts-ignore
   */
// @ts-ignore
  id: string,
// @ts-ignore
  /**
// @ts-ignore
   * the type of graph data this schema item represents
// @ts-ignore
   */
// @ts-ignore
  graphType: BaseGraphTypes | NodeAnchorGraphTypes | MarqueeGraphTypes,
// @ts-ignore
  /**
// @ts-ignore
   * determines the order in which this schema item is rendered
// @ts-ignore
   * on the canvas. The lower the number, the higher the priority, the higher the priority,
// @ts-ignore
   * the earlier the item is rendered on the canvas.
// @ts-ignore
   * (items with a lower priority score will appear visually underneath those with a higher score)
// @ts-ignore
   */
// @ts-ignore
  priority: number,
// @ts-ignore
  /**
// @ts-ignore
   * the magic shape instance that will be rendered on the canvas
// @ts-ignore
   */
// @ts-ignore
  shape: Shape,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type AdjacencyList = Record<string, string[]>;

// @ts-ignore
export type GraphPlaygroundControls = {
// @ts-ignore
  theme: boolean,
// @ts-ignore
  tutorial: boolean,
// @ts-ignore
  collab: boolean,
// @ts-ignore
  settings: boolean,
// @ts-ignore
  buttons: boolean,
}

// @ts-ignore
export type DijkstrasAlgorithm = ReturnType<typeof dijkstras>;
// @ts-ignore
export type DijkstrasTrace = ReturnType<DijkstrasAlgorithm>;
// @ts-ignore
type TraceNodeDistance = { id: string; distance: number };
// @ts-ignore
type TraceExploredNode = { id: string; distance: number };
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * serializable infinity value for node distance
// @ts-ignore
 */
// @ts-ignore
export const INF = 999999;
// @ts-ignore

// @ts-ignore
const dijkstras = (graph: Pick<Graph, 'nodes' | 'edges'>) => (startingNodeId: GNode['id']) => {
// @ts-ignore

// @ts-ignore
  const distanceArr = graph.nodes.value.map(
// @ts-ignore
    (n) =>
// @ts-ignore
    ({
// @ts-ignore
      id: n.id,
// @ts-ignore
      distance: INF,
// @ts-ignore
    } satisfies TraceNodeDistance)
// @ts-ignore
  );
// @ts-ignore

// @ts-ignore
  // assign distance 0 to source
// @ts-ignore
  distanceArr.filter((n) => n.id === startingNodeId)[0].distance = 0;
// @ts-ignore

// @ts-ignore
  let priorityQueue = [...distanceArr];
// @ts-ignore
  const exploredNodes: TraceExploredNode[] = [{ id: startingNodeId, distance: 0 }];
// @ts-ignore
  const nodeParentMap = new Map<string, string>();
// @ts-ignore

// @ts-ignore
  // initialize trace with first source without any nodes explored
// @ts-ignore
  const trace = [
// @ts-ignore
    {
// @ts-ignore
      source: { id: startingNodeId, distance: 0 },
// @ts-ignore
      exploredNodes: JSON.parse(
// @ts-ignore
        JSON.stringify(exploredNodes)
// @ts-ignore
      ) as TraceExploredNode[],
// @ts-ignore
      distances: JSON.parse(JSON.stringify(distanceArr)) as TraceNodeDistance[],
// @ts-ignore
      nodeParentMap: new Map(nodeParentMap),
// @ts-ignore
    },
// @ts-ignore
  ];
// @ts-ignore

// @ts-ignore
  // iterate through priority queue
// @ts-ignore
  while (priorityQueue.length !== 0) {
// @ts-ignore
    // grab node with least-distance
// @ts-ignore
    const sourceNode = priorityQueue.reduce(
// @ts-ignore
      (acc, cur) => (cur.distance < acc.distance ? cur : acc),
// @ts-ignore
      { id: "", distance: Infinity }
// @ts-ignore
    );
// @ts-ignore

// @ts-ignore
    // remove that node
// @ts-ignore
    priorityQueue = priorityQueue.filter((e) => e.id !== sourceNode.id);
// @ts-ignore

// @ts-ignore
    // don't iterate through nodes with no ingoing edges
// @ts-ignore
    if (
// @ts-ignore
      getInboundEdges(sourceNode.id, graph).length === 0 &&
// @ts-ignore
      sourceNode.id !== startingNodeId
// @ts-ignore
    )
// @ts-ignore
      continue;
// @ts-ignore

// @ts-ignore
    // iterate through source's neighbors
// @ts-ignore
    getOutboundEdges(sourceNode.id, graph).forEach((edge) => {
// @ts-ignore
      // updates distance of neighbor if new distance is less than old
// @ts-ignore
      const newDistanceIsLess =
// @ts-ignore
        distanceArr.filter((e) => e.id === edge.from)[0].distance +
// @ts-ignore
        Number(edge.label) <
// @ts-ignore
        distanceArr.filter((e) => e.id === edge.to)[0].distance;
// @ts-ignore
      if (newDistanceIsLess) {
// @ts-ignore
        const newDistance =
// @ts-ignore
          distanceArr.filter((e) => e.id === edge.from)[0].distance +
// @ts-ignore
          Number(edge.label);
// @ts-ignore
        distanceArr.filter((e) => e.id === edge.to)[0].distance = newDistance;
// @ts-ignore

// @ts-ignore
        // idk if this should be outside if or not
// @ts-ignore
        const neighborAlreadyExplored = exploredNodes
// @ts-ignore
          .map((n) => n.id)
// @ts-ignore
          .includes(edge.to);
// @ts-ignore
        if (!neighborAlreadyExplored)
// @ts-ignore
          exploredNodes.push({ id: edge.to, distance: newDistance });
// @ts-ignore

// @ts-ignore
        nodeParentMap.set(edge.to, sourceNode.id);
// @ts-ignore
      }
// @ts-ignore
    });
// @ts-ignore
    trace.push({
// @ts-ignore
      source: sourceNode,
// @ts-ignore
      exploredNodes: JSON.parse(
// @ts-ignore
        JSON.stringify(exploredNodes)
// @ts-ignore
      ) as TraceExploredNode[],
// @ts-ignore
      distances: JSON.parse(JSON.stringify(distanceArr)) as TraceNodeDistance[],
// @ts-ignore
      nodeParentMap: new Map(nodeParentMap),
// @ts-ignore
    });
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  // push an empty source to give the impression that there are no more nodes to check
// @ts-ignore
  trace.push({
// @ts-ignore
    source: { id: "", distance: 0 },
// @ts-ignore
    exploredNodes: JSON.parse(
// @ts-ignore
      JSON.stringify(exploredNodes)
// @ts-ignore
    ) as TraceExploredNode[],
// @ts-ignore
    distances: JSON.parse(JSON.stringify(distanceArr)) as TraceNodeDistance[],
// @ts-ignore
    nodeParentMap: new Map(nodeParentMap),
// @ts-ignore
  });
// @ts-ignore

// @ts-ignore
  return trace;
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export const useDijkstra = (graph: Pick<Graph, 'nodes' | 'getNode' | 'edges' | 'subscribe'>) => {
// @ts-ignore
  const trace = ref<DijkstrasTrace>([]);
// @ts-ignore
  const getDijkstrasTrace = dijkstras(graph);
// @ts-ignore

// @ts-ignore
  // TODO - make this be a ref that a user can write to
// @ts-ignore
  // const startingNodeId = ref<GNode['id'] | undefined>();
// @ts-ignore
  const startingNodeId = computed(() => {
// @ts-ignore
    const nodeLabelledA = graph.nodes.value.find((n) => n.label === "A");
// @ts-ignore
    return nodeLabelledA?.id;
// @ts-ignore
  })
// @ts-ignore

// @ts-ignore
  const update = () => {
// @ts-ignore
    if (!startingNodeId.value) return
// @ts-ignore
    const startingNode = graph.getNode(startingNodeId.value);
// @ts-ignore
    if (!startingNode) return
// @ts-ignore
    trace.value = getDijkstrasTrace(startingNode.id);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  graph.subscribe("onStructureChange", update);
// @ts-ignore
  graph.subscribe("onEdgeLabelChange", update);
// @ts-ignore
  graph.subscribe("onGraphReset", update);
// @ts-ignore

// @ts-ignore
  update();
// @ts-ignore

// @ts-ignore
  return { trace };
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export type DijkstraSimulatorControls = SimulationControls<DijkstrasTrace>

// @ts-ignore
export type AdjacencyMap = Map<number, number[]>;

// @ts-ignore
export type Parent = Map<string, string>

// @ts-ignore
export type MSTSumilationControls = SimulationControls<GEdge[]>;
// @ts-ignore
export type Algorithm = "kruskal" | "prim" | "none";
// @ts-ignore

// @ts-ignore
export const useMSTSimulation = (
// @ts-ignore
  graph: Graph,
// @ts-ignore
  currentAlgorithm: Ref<Algorithm>
// @ts-ignore
): MSTSumilationControls => {
// @ts-ignore
  const { trace: kTrace } = useKruskal(graph);
// @ts-ignore
  const { trace: pTrace } = usePrims(graph);
// @ts-ignore

// @ts-ignore
  const trace = computed(() => {
// @ts-ignore
    if (currentAlgorithm.value === "none") return graph.edges.value;
// @ts-ignore
    else if (currentAlgorithm.value === "prim") return pTrace.value;
// @ts-ignore
    else return kTrace.value;
// @ts-ignore
  });
// @ts-ignore

// @ts-ignore
  const step = ref(0);
// @ts-ignore
  const paused = ref(true);
// @ts-ignore
  const playbackSpeed = ref(1_500);
// @ts-ignore
  const active = ref(false);
// @ts-ignore
  const interval = ref<NodeJS.Timeout | undefined>();
// @ts-ignore
  const isOver = computed(() => step.value === trace.value.length + 1);
// @ts-ignore
  const hasBegun = computed(() => step.value > 0);
// @ts-ignore

// @ts-ignore
  const traceAtStep = computed(() => trace.value.slice(0, step.value));
// @ts-ignore

// @ts-ignore
  const start = () => {
// @ts-ignore
    paused.value = false;
// @ts-ignore
    active.value = true;
// @ts-ignore
    step.value = 0;
// @ts-ignore
    interval.value = setInterval(() => {
// @ts-ignore
      if (isOver.value || paused.value) return;
// @ts-ignore
      nextStep();
// @ts-ignore
    }, playbackSpeed.value);
// @ts-ignore
    useColorizeGraph(graph, traceAtStep.value);
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const stop = () => {
// @ts-ignore
    if (interval.value) clearInterval(interval.value);
// @ts-ignore
    active.value = false;
// @ts-ignore
    setStep(trace.value.length);
// @ts-ignore
    useColorizeGraph(graph, traceAtStep.value);
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const nextStep = () => {
// @ts-ignore
    if (!trace.value) return;
// @ts-ignore
    if (step.value === trace.value.length + 1) return;
// @ts-ignore
    step.value++;
// @ts-ignore

// @ts-ignore
    useColorizeGraph(graph, traceAtStep.value);
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const prevStep = () => {
// @ts-ignore
    if (step.value === 0) return;
// @ts-ignore
    step.value--;
// @ts-ignore

// @ts-ignore
    useColorizeGraph(graph, traceAtStep.value);
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  const setStep = (newStep: number) => {
// @ts-ignore
    if (newStep < -1 || newStep > trace.value.length) return;
// @ts-ignore
    step.value = newStep;
// @ts-ignore

// @ts-ignore
    useColorizeGraph(graph, traceAtStep.value);
// @ts-ignore
  };
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    nextStep,
// @ts-ignore
    prevStep,
// @ts-ignore
    setStep,
// @ts-ignore

// @ts-ignore
    trace: computed(() => trace.value),
// @ts-ignore
    step: computed(() => step.value),
// @ts-ignore

// @ts-ignore
    start,
// @ts-ignore
    stop,
// @ts-ignore
    paused,
// @ts-ignore
    playbackSpeed,
// @ts-ignore

// @ts-ignore
    isOver,
// @ts-ignore
    hasBegun,
// @ts-ignore
    isActive: computed(() => active.value),
// @ts-ignore
    // progress: computed(() => `${step.value} / ${trace.value.length}`),
// @ts-ignore
  };
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export type FlowTrace = Record<GEdge['id'], number>[]

// @ts-ignore
export type EdgeThickenerControls = ReturnType<typeof useEdgeThickener>;

// @ts-ignore
export type NetworkFlowControls = ReturnType<typeof useFlowControls>;

// @ts-ignore
export type FlowProperties = ReturnType<typeof useFlowProperties>;

// @ts-ignore
export type FlowSimulationControls = SimulationControls<FlowTrace>

// @ts-ignore
export type AlgoName = keyof typeof algos

// @ts-ignore
export type Trace = string[]

// @ts-ignore
export type BFSLevelRecord = Record<GNode['id'], number>;

// @ts-ignore
export type Arrow = Line

// @ts-ignore
export type Circle = {
// @ts-ignore
  at: Coordinate,
// @ts-ignore
  radius: number,
// @ts-ignore
  color?: string,
// @ts-ignore
  stroke?: Stroke,
// @ts-ignore
  textArea?: TextAreaNoLocation,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const CIRCLE_DEFAULTS = {
// @ts-ignore
  color: 'black',
// @ts-ignore
} as const
// @ts-ignore

// @ts-ignore
export const circle = (options: Circle): Shape => {
// @ts-ignore

// @ts-ignore
  if (options.radius < 0) {
// @ts-ignore
    throw new Error('radius must be positive')
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const drawShape = drawCircleWithCtx(options);
// @ts-ignore

// @ts-ignore
  const shapeHitbox = circleHitbox(options);
// @ts-ignore
  const textHitbox = circleTextHitbox(options);
// @ts-ignore
  const efficientHitbox = circleEfficientHitbox(options)
// @ts-ignore
  const hitbox = (point: Coordinate) => {
// @ts-ignore
    return textHitbox?.(point) || shapeHitbox(point)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore

// @ts-ignore
  const drawTextArea = drawTextAreaOnCircle(options);
// @ts-ignore

// @ts-ignore
  const drawTextAreaMatte = drawTextAreaMatteOnCircle(options);
// @ts-ignore
  const drawText = drawTextOnCircle(options);
// @ts-ignore

// @ts-ignore
  const draw = (ctx: CanvasRenderingContext2D) => {
// @ts-ignore
    drawShape(ctx);
// @ts-ignore
    drawTextArea?.(ctx);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const activateTextArea = (handler: (str: string) => void) => {
// @ts-ignore
    if (!options.textArea) return;
// @ts-ignore
    const location = getTextAreaLocationOnCircle(options);
// @ts-ignore
    const fullTextArea = getFullTextArea(options.textArea, location);
// @ts-ignore
    engageTextarea(fullTextArea, handler);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    id: generateId(),
// @ts-ignore
    name: 'circle',
// @ts-ignore

// @ts-ignore
    draw,
// @ts-ignore

// @ts-ignore
    drawShape,
// @ts-ignore
    drawTextArea,
// @ts-ignore
    drawTextAreaMatte,
// @ts-ignore
    drawText,
// @ts-ignore

// @ts-ignore
    hitbox,
// @ts-ignore
    shapeHitbox,
// @ts-ignore
    textHitbox,
// @ts-ignore
    efficientHitbox,
// @ts-ignore

// @ts-ignore
    activateTextArea,
// @ts-ignore
  }
}

// @ts-ignore
export type Cross = {
// @ts-ignore
  at: Coordinate
// @ts-ignore
  size: number
// @ts-ignore
  rotation?: number
// @ts-ignore
  color?: string
// @ts-ignore
  lineWidth?: number
// @ts-ignore
  borderRadius?: number
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const CROSS_DEFAULTS = {
// @ts-ignore
  rotation: 0,
// @ts-ignore
  color: 'black',
// @ts-ignore
  lineWidth: LINE_DEFAULTS.width,
// @ts-ignore
  borderRadius: 0,
// @ts-ignore
} as const
// @ts-ignore

// @ts-ignore
export const cross = (options: Cross): Shape => {
// @ts-ignore

// @ts-ignore
  if (options.lineWidth && options.lineWidth < 0) {
// @ts-ignore
    throw new Error('lineWidth must be positive')
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const drawShape = drawCrossWithCtx(options)
// @ts-ignore
  const shapeHitbox = crossHitbox(options)
// @ts-ignore
  const efficientHitbox = crossEfficientHitbox(options)
// @ts-ignore
  const hitbox = (point: Coordinate) => {
// @ts-ignore
    return shapeHitbox(point) // text not implemented yet
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore

// @ts-ignore
  const draw = (ctx: CanvasRenderingContext2D) => {
// @ts-ignore
    drawShape(ctx)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    id: generateId(),
// @ts-ignore
    name: 'cross',
// @ts-ignore

// @ts-ignore
    draw,
// @ts-ignore
    drawShape,
// @ts-ignore

// @ts-ignore
    shapeHitbox,
// @ts-ignore
    hitbox,
// @ts-ignore
    efficientHitbox,
// @ts-ignore
  }
}

// @ts-ignore
export type Line = {
// @ts-ignore
  start: Coordinate,
// @ts-ignore
  end: Coordinate,
// @ts-ignore
  width?: number,
// @ts-ignore
  textArea?: TextAreaNoLocation,
// @ts-ignore
  /**
// @ts-ignore
   * offsetFromCenter is used to position text. By default, text is centered on the line.
// @ts-ignore
   * If -10, text will be on the line but 10 units below the center.
// @ts-ignore
   * If 10, text will be on the line but 10 units above the center.
// @ts-ignore
   */
// @ts-ignore
  textOffsetFromCenter?: number,
// @ts-ignore
  color?: string,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const LINE_DEFAULTS = {
// @ts-ignore
  width: 10,
// @ts-ignore
  textOffsetFromCenter: 0,
// @ts-ignore
  color: 'black',
// @ts-ignore
} as const
// @ts-ignore

// @ts-ignore
export const line = (options: Line): Shape => {
// @ts-ignore

// @ts-ignore
  if (options.width && options.width < 0) {
// @ts-ignore
    throw new Error('lineWidth must be positive')
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const drawShape = drawLineWithCtx(options);
// @ts-ignore

// @ts-ignore
  const shapeHitbox = lineHitbox(options);
// @ts-ignore
  const textHitbox = lineTextHitbox(options);
// @ts-ignore
  const efficientHitbox = lineEfficientHitbox(options)
// @ts-ignore
  const hitbox = (point: Coordinate) => {
// @ts-ignore
    return textHitbox?.(point) || shapeHitbox(point)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const drawTextArea = drawTextAreaOnLine(options);
// @ts-ignore

// @ts-ignore
  const drawTextAreaMatte = drawTextAreaMatteOnLine(options);
// @ts-ignore
  const drawText = drawTextOnLine(options);
// @ts-ignore

// @ts-ignore
  const draw = (ctx: CanvasRenderingContext2D) => {
// @ts-ignore
    drawShape(ctx);
// @ts-ignore
    drawTextArea?.(ctx);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const activateTextArea = (handler: (str: string) => void) => {
// @ts-ignore
    if (!options.textArea) return;
// @ts-ignore
    const location = getTextAreaLocationOnLine(options);
// @ts-ignore
    const fullTextArea = getFullTextArea(options.textArea, location);
// @ts-ignore
    engageTextarea(fullTextArea, handler);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    id: generateId(),
// @ts-ignore
    name: 'line',
// @ts-ignore

// @ts-ignore
    draw,
// @ts-ignore

// @ts-ignore
    drawShape,
// @ts-ignore
    drawTextArea,
// @ts-ignore
    drawTextAreaMatte,
// @ts-ignore
    drawText,
// @ts-ignore

// @ts-ignore
    hitbox,
// @ts-ignore
    shapeHitbox,
// @ts-ignore
    textHitbox,
// @ts-ignore
    efficientHitbox,
// @ts-ignore

// @ts-ignore
    activateTextArea,
// @ts-ignore
  }
}

// @ts-ignore
export type Rect = {
// @ts-ignore
  at: Coordinate
// @ts-ignore
  width: number
// @ts-ignore
  height: number
// @ts-ignore
  color?: string
// @ts-ignore
  stroke?: Stroke
// @ts-ignore
  textArea?: TextAreaNoLocation
// @ts-ignore
  borderRadius?: number
// @ts-ignore
  rotation?: number
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const RECT_DEFAULTS = {
// @ts-ignore
  color: 'black',
// @ts-ignore
  borderRadius: 0,
// @ts-ignore
  rotation: 0,
// @ts-ignore
} as const
// @ts-ignore

// @ts-ignore
export const rect = (options: Rect): Shape => {
// @ts-ignore

// @ts-ignore
  if (options.borderRadius && options.borderRadius < 0) {
// @ts-ignore
    throw new Error('borderRadius must be positive')
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const drawShape = drawRectWithCtx(options);
// @ts-ignore

// @ts-ignore
  const shapeHitbox = rectHitbox(options);
// @ts-ignore
  const textHitbox = rectTextHitbox(options);
// @ts-ignore
  const efficientHitbox = rectEfficientHitbox(options)
// @ts-ignore
  const hitbox = (point: Coordinate) => {
// @ts-ignore
    return textHitbox?.(point) || shapeHitbox(point)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const drawTextArea = drawTextAreaOnRect(options);
// @ts-ignore

// @ts-ignore
  const drawTextAreaMatte = drawTextAreaMatteOnRect(options);
// @ts-ignore
  const drawText = drawTextOnRect(options);
// @ts-ignore

// @ts-ignore
  const draw = (ctx: CanvasRenderingContext2D) => {
// @ts-ignore
    drawShape(ctx);
// @ts-ignore
    drawTextArea?.(ctx);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const activateTextArea = (handler: (str: string) => void) => {
// @ts-ignore
    if (!options.textArea) return;
// @ts-ignore
    const location = getTextAreaLocationOnRect(options);
// @ts-ignore
    const fullTextArea = getFullTextArea(options.textArea, location);
// @ts-ignore
    engageTextarea(fullTextArea, handler);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    id: generateId(),
// @ts-ignore
    name: 'rect',
// @ts-ignore

// @ts-ignore
    draw,
// @ts-ignore

// @ts-ignore
    drawShape,
// @ts-ignore
    drawTextArea,
// @ts-ignore
    drawTextAreaMatte,
// @ts-ignore
    drawText,
// @ts-ignore

// @ts-ignore
    hitbox,
// @ts-ignore
    shapeHitbox,
// @ts-ignore
    textHitbox,
// @ts-ignore
    efficientHitbox,
// @ts-ignore

// @ts-ignore
    activateTextArea,
// @ts-ignore
  }
}

// @ts-ignore
export type Square = {
// @ts-ignore
  at: Coordinate
// @ts-ignore
  size: number
// @ts-ignore
  color?: string
// @ts-ignore
  stroke?: Stroke
// @ts-ignore
  textArea?: TextAreaNoLocation
// @ts-ignore
  borderRadius?: number
// @ts-ignore
  rotation?: number
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * squares use rect default values
// @ts-ignore
 */
// @ts-ignore
export const square = (options: Square): Shape => {
// @ts-ignore
  const drawShape = drawSquareWithCtx(options);
// @ts-ignore

// @ts-ignore
  const shapeHitbox = squareHitbox(options);
// @ts-ignore
  const textHitbox = squareTextHitbox(options);
// @ts-ignore
  const efficientHitbox = squareEfficientHitbox(options);
// @ts-ignore
  const hitbox = (point: Coordinate) => {
// @ts-ignore
    return textHitbox?.(point) || shapeHitbox(point)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const drawTextArea = drawTextAreaOnSquare(options);
// @ts-ignore

// @ts-ignore
  const drawTextAreaMatte = drawTextAreaMatteOnSquare(options);
// @ts-ignore
  const drawText = drawTextOnSquare(options);
// @ts-ignore

// @ts-ignore
  const draw = (ctx: CanvasRenderingContext2D) => {
// @ts-ignore
    drawShape(ctx);
// @ts-ignore
    drawTextArea?.(ctx);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const activateTextArea = (handler: (str: string) => void) => {
// @ts-ignore
    if (!options.textArea) return;
// @ts-ignore
    const location = getTextAreaLocationOnSquare(options);
// @ts-ignore
    const fullTextArea = getFullTextArea(options.textArea, location);
// @ts-ignore
    engageTextarea(fullTextArea, handler);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    id: generateId(),
// @ts-ignore
    name: 'square',
// @ts-ignore

// @ts-ignore
    draw,
// @ts-ignore

// @ts-ignore
    drawShape,
// @ts-ignore
    drawTextArea,
// @ts-ignore
    drawTextAreaMatte,
// @ts-ignore
    drawText,
// @ts-ignore

// @ts-ignore
    hitbox,
// @ts-ignore
    shapeHitbox,
// @ts-ignore
    textHitbox,
// @ts-ignore
    efficientHitbox,
// @ts-ignore

// @ts-ignore
    activateTextArea,
// @ts-ignore
  }
}

// @ts-ignore
export type Triangle = {
// @ts-ignore
  point1: Coordinate,
// @ts-ignore
  point2: Coordinate,
// @ts-ignore
  point3: Coordinate,
// @ts-ignore
  color?: string,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const TRIANGLE_DEFAULTS = {
// @ts-ignore
  color: 'black',
// @ts-ignore
} as const
// @ts-ignore

// @ts-ignore
export const triangle = (options: Triangle): Shape => {
// @ts-ignore
  const drawShape = drawTriangleWithCtx(options)
// @ts-ignore
  const shapeHitbox = triangleHitbox(options)
// @ts-ignore
  const efficientHitbox = triangleEfficientHitbox(options)
// @ts-ignore
  const hitbox = (point: Coordinate) => {
// @ts-ignore
    return shapeHitbox(point) // text not implemented yet
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const draw = (ctx: CanvasRenderingContext2D) => {
// @ts-ignore
    drawShape(ctx)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    id: generateId(),
// @ts-ignore
    name: 'triangle',
// @ts-ignore

// @ts-ignore
    draw,
// @ts-ignore
    drawShape,
// @ts-ignore

// @ts-ignore
    hitbox,
// @ts-ignore
    shapeHitbox,
// @ts-ignore
    efficientHitbox,
// @ts-ignore
  }
}

// @ts-ignore
export type BoundingBox = Pick<Rect, 'at' | 'width' | 'height'>

// @ts-ignore
export type Shape = {
// @ts-ignore
  /**
// @ts-ignore
   * a unique identifier for the shape
// @ts-ignore
   */
// @ts-ignore
  id: string,
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * the name of the shape type, ie 'circle', 'line', etc
// @ts-ignore
   */
// @ts-ignore
  name: ShapeName,
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * draws the entire shape including text.
// @ts-ignore
   * this is the default use case
// @ts-ignore
   */
// @ts-ignore
  draw: (ctx: CanvasRenderingContext2D) => void,
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * draws just the shape ignoring all text properties
// @ts-ignore
   */
// @ts-ignore
  drawShape: (ctx: CanvasRenderingContext2D) => void,
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * draws the text area of the shape (ie both matte and text)
// @ts-ignore
   */
// @ts-ignore
  drawTextArea?: (ctx: CanvasRenderingContext2D) => void,
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * only draws the matte of the text area
// @ts-ignore
   */
// @ts-ignore
  drawTextAreaMatte?: (ctx: CanvasRenderingContext2D) => void,
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * only draws the text content of the text area
// @ts-ignore
   */
// @ts-ignore
  drawText?: (ctx: CanvasRenderingContext2D) => void,
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * returns true if the point is within the shape or text area of the shape
// @ts-ignore
   */
// @ts-ignore
  hitbox: (point: Coordinate) => boolean,
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * returns true if the point is within the area of the shape
// @ts-ignore
   */
// @ts-ignore
  shapeHitbox: (point: Coordinate) => boolean,
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * returns true if the point is within the rectangular bounding box of the shape
// @ts-ignore
   */
// @ts-ignore
  efficientHitbox: (boxToCheck: BoundingBox) => boolean,
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * returns true if the point is within the text area of the shape
// @ts-ignore
   */
// @ts-ignore
  textHitbox?: (point: Coordinate) => boolean,
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * activates the text area of the shape
// @ts-ignore
   */
// @ts-ignore
  activateTextArea?: (handler: (str: string) => void) => void,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export type Coordinate = {
// @ts-ignore
  x: number,
// @ts-ignore
  y: number,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * an area that wraps some text
// @ts-ignore
 */
// @ts-ignore
export type TextAreaNoLocation = {
// @ts-ignore
  /**
// @ts-ignore
   * the text areas inner text
// @ts-ignore
   */
// @ts-ignore
  text: Text,
// @ts-ignore
  /**
// @ts-ignore
   * the color of the text area
// @ts-ignore
   */
// @ts-ignore
  color?: string,
// @ts-ignore
  /**
// @ts-ignore
   * the color of the text area when it is engaged
// @ts-ignore
   * IE is converted to a textarea html element for user interaction
// @ts-ignore
   */
// @ts-ignore
  activeColor?: string,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const TEXTAREA_DEFAULTS = {
// @ts-ignore
  color: 'white',
// @ts-ignore
  // TODO - make active color depend on the color of the text area
// @ts-ignore
  activeColor: 'white',
// @ts-ignore
} as const
// @ts-ignore

// @ts-ignore
export type TextArea = {
// @ts-ignore
  at: Coordinate,
// @ts-ignore
} & TextAreaNoLocation
// @ts-ignore

// @ts-ignore
export type TextFontWeight = 'lighter' | 'normal' | 'bold' | 'bolder'
// @ts-ignore

// @ts-ignore
// the text displayed in the text area
// @ts-ignore
export type Text = {
// @ts-ignore
  content: string,
// @ts-ignore
  fontSize?: number,
// @ts-ignore
  fontWeight?: TextFontWeight,
// @ts-ignore
  color?: string,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const TEXT_DEFAULTS = {
// @ts-ignore
  fontSize: 12,
// @ts-ignore
  fontWeight: 'normal',
// @ts-ignore
  color: 'black',
// @ts-ignore
} as const
// @ts-ignore

// @ts-ignore
export type Stroke = {
// @ts-ignore
  color: string,
// @ts-ignore
  width: number,
// @ts-ignore
    /**
// @ts-ignore
   * For dashed border
// @ts-ignore
   *
// @ts-ignore
   * @params
// @ts-ignore
   *
// @ts-ignore
   * dash: [dashLength, gapLength]
// @ts-ignore
   *
// @ts-ignore
  */
// @ts-ignore
    dash?: [number, number]
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const STROKE_DEFAULTS = {
// @ts-ignore
  color: 'black',
// @ts-ignore
  width: 0
}

// @ts-ignore
export type UTurn = {
// @ts-ignore
  spacing: number,
// @ts-ignore
  at: Coordinate,
// @ts-ignore
  upDistance: number,
// @ts-ignore
  downDistance: number,
// @ts-ignore
  rotation: number,
// @ts-ignore
  lineWidth: number,
// @ts-ignore
  color?: string,
// @ts-ignore
  textArea?: TextAreaNoLocation
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
export const UTURN_DEFAULTS = {
// @ts-ignore
  color: 'black',
// @ts-ignore
} as const
// @ts-ignore

// @ts-ignore
export const uturn = (options: UTurn): Shape => {
// @ts-ignore

// @ts-ignore
  if (options.downDistance < 0) {
// @ts-ignore
    throw new Error('downDistance must be positive')
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  if (options.upDistance < 0) {
// @ts-ignore
    throw new Error('upDistance must be positive')
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const drawShape = drawUTurnWithCtx(options);
// @ts-ignore

// @ts-ignore
  const shapeHitbox = uturnHitbox(options);
// @ts-ignore
  const textHitbox = uturnTextHitbox(options);
// @ts-ignore
  const efficientHitbox = uturnEfficientHitbox(options)
// @ts-ignore
  const hitbox = (point: Coordinate) => {
// @ts-ignore
    return textHitbox?.(point) || shapeHitbox(point)
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const drawTextArea = drawTextAreaOnUTurn(options);
// @ts-ignore

// @ts-ignore
  const drawTextAreaMatte = drawTextAreaMatteOnUTurn(options);
// @ts-ignore
  const drawText = drawTextOnUTurn(options);
// @ts-ignore

// @ts-ignore
  const draw = (ctx: CanvasRenderingContext2D) => {
// @ts-ignore
    drawShape(ctx);
// @ts-ignore
    drawTextArea?.(ctx);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  const activateTextArea = (handler: (str: string) => void) => {
// @ts-ignore
    if (!options.textArea) return;
// @ts-ignore
    const location = getTextAreaLocationOnUTurn(options);
// @ts-ignore
    const fullTextArea = getFullTextArea(options.textArea, location);
// @ts-ignore
    engageTextarea(fullTextArea, handler);
// @ts-ignore
  }
// @ts-ignore

// @ts-ignore
  return {
// @ts-ignore
    id: generateId(),
// @ts-ignore
    name: 'uturn',
// @ts-ignore

// @ts-ignore
    draw,
// @ts-ignore

// @ts-ignore
    drawShape,
// @ts-ignore
    drawTextArea,
// @ts-ignore
    drawTextAreaMatte,
// @ts-ignore
    drawText,
// @ts-ignore

// @ts-ignore
    hitbox,
// @ts-ignore
    shapeHitbox,
// @ts-ignore
    textHitbox,
// @ts-ignore
    efficientHitbox,
// @ts-ignore

// @ts-ignore
    activateTextArea,
// @ts-ignore
  }
}

// @ts-ignore
export type MainPageInfo = {
// @ts-ignore
  /**
// @ts-ignore
   * the name of the menu item
// @ts-ignore
   */
// @ts-ignore
  name: string,
// @ts-ignore
  /**
// @ts-ignore
   *
// @ts-ignore
   */
// @ts-ignore
  description: string,
// @ts-ignore
  /**
// @ts-ignore
   * an image to display in the menu
// @ts-ignore
   */
// @ts-ignore
  thumbnail: string,
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * interface for exposing a product to global resources
// @ts-ignore
 * like the main page and router
// @ts-ignore
 */
// @ts-ignore
export type ProductInfo = {
// @ts-ignore
  /**
// @ts-ignore
   * consumed by vue-router in order to add it as an available route
// @ts-ignore
   */
// @ts-ignore
  route: RouteRecordRaw,
// @ts-ignore
  /**
// @ts-ignore
   * the name of the product.
// @ts-ignore
   * used as document title
// @ts-ignore
   */
// @ts-ignore
  name: string,
// @ts-ignore
  /**
// @ts-ignore
   * the description of the product
// @ts-ignore
   */
// @ts-ignore
  description: string,
// @ts-ignore
  /**
// @ts-ignore
   * a unique identifier for the product, cannot contain spaces or special characters
// @ts-ignore
   */
// @ts-ignore
  productId: string,
// @ts-ignore
  /**
// @ts-ignore
   * if defined, the product will be added to the main menu
// @ts-ignore
   * with the properties defined here
// @ts-ignore
   */
// @ts-ignore
  menu?: MainPageInfo,
}

// @ts-ignore
export type SimulationControls<T extends any[] = any[]> = {
// @ts-ignore
  /**
// @ts-ignore
   * skip forward to the next step.
// @ts-ignore
   * wont do anything if the current step is trace.length
// @ts-ignore
   */
// @ts-ignore
  nextStep: () => void
// @ts-ignore
  /**
// @ts-ignore
   * skip backward to the previous step.
// @ts-ignore
   * wont do anything if the current step is -1
// @ts-ignore
   */
// @ts-ignore
  prevStep: () => void
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * the current trace of the algorithm for which the simulation is being run.
// @ts-ignore
   */
// @ts-ignore
  trace: ComputedRef<T>
// @ts-ignore
  /**
// @ts-ignore
   * the current step of the simulation.
// @ts-ignore
   * ranges from -1 to trace.length where -1 is the state before the algorithm has begun
// @ts-ignore
   * and trace.length is the state after the algorithm has completed.
// @ts-ignore
   */
// @ts-ignore
  step: ComputedRef<number>
// @ts-ignore
  /**
// @ts-ignore
   * set the current step of the simulation
// @ts-ignore
   * @param step the step to set the simulation to
// @ts-ignore
   * @throws if step is not within the bounds of the trace (-1 to trace.length)
// @ts-ignore
   */
// @ts-ignore
  setStep: (step: number) => void
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * start the simulation. this will begin the simulation from step -1
// @ts-ignore
   */
// @ts-ignore
  start: () => void
// @ts-ignore
  /**
// @ts-ignore
   * stop the simulation. this will end the simulation and reset all state
// @ts-ignore
   */
// @ts-ignore
  stop: () => void
// @ts-ignore
  /**
// @ts-ignore
   * pause the simulation. keeps the playback interval running but stops the step from incrementing
// @ts-ignore
   */
// @ts-ignore
  paused: Ref<boolean>
// @ts-ignore
  /**
// @ts-ignore
   * time, in milliseconds, between each step firing.
// @ts-ignore
   */
// @ts-ignore
  playbackSpeed: Ref<number>
// @ts-ignore

// @ts-ignore
  /**
// @ts-ignore
   * whether the simulation is currently active.
// @ts-ignore
   * changes to true when start is called and false when stop is called
// @ts-ignore
   */
// @ts-ignore
  isActive: ComputedRef<boolean>
// @ts-ignore
  /**
// @ts-ignore
   * whether the simulation is over.
// @ts-ignore
   * true when the step is trace.length
// @ts-ignore
   */
// @ts-ignore
  isOver: ComputedRef<boolean>
// @ts-ignore
  /**
// @ts-ignore
   * whether the simulation has begun.
// @ts-ignore
   * true when the step is greater than -1
// @ts-ignore
   */
// @ts-ignore
  hasBegun: ComputedRef<boolean>
// @ts-ignore
}
// @ts-ignore

// @ts-ignore

// @ts-ignore
type PartialProgressThemeOptions = Partial<{
// @ts-ignore
  backgroundColor: string;
// @ts-ignore
  progressColor: string;
// @ts-ignore
  easeTime: number;
// @ts-ignore
  borderRadius: number;
// @ts-ignore
  progressEasing: "linear" | "ease-in-out";
// @ts-ignore
}>;
// @ts-ignore

// @ts-ignore
export type ProgressOptions = {
// @ts-ignore
  theme?: PartialProgressThemeOptions;
// @ts-ignore
  startProgress: number;
// @ts-ignore
  currentProgress: number;
// @ts-ignore
  endProgress: number;
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export const PROGRESS_DEFAULTS = {
// @ts-ignore
  backgroundColor: "white",
// @ts-ignore
  progressColor: "green",
// @ts-ignore
  easeTime: 250,
// @ts-ignore
  progressEasing: "ease-in-out",
// @ts-ignore
  borderRadius: 0,
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
export type Color = string;

// @ts-ignore
export type DeepPartial<T> = {
// @ts-ignore
  [K in keyof T]?: K extends Record<any, any>
// @ts-ignore
  ? DeepPartial<T[K]>
// @ts-ignore
  : T[K];
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * make every key in an object required including nested objects
// @ts-ignore
 */
// @ts-ignore
export type DeepRequired<T> = {
// @ts-ignore
  [K in keyof T]-?: T[K] extends Record<any, any>
// @ts-ignore
  ? DeepRequired<T[K]>
// @ts-ignore
  : T[K];
// @ts-ignore
};
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * makes only certain keys K in an object T optional
// @ts-ignore
 */
// @ts-ignore
export type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * helper types for nested keys
// @ts-ignore
 */
// @ts-ignore
type AcceptableKeys = string | number | symbol
// @ts-ignore
type AcceptableObject = Record<AcceptableKeys, any>
// @ts-ignore

// @ts-ignore
/**
// @ts-ignore
 * get a clean union of all paths in an object
// @ts-ignore
 */
// @ts-ignore
export type NestedKeys<T extends AcceptableObject> = T extends AcceptableObject ? {
// @ts-ignore
  [K in keyof T]: K | (
// @ts-ignore
    Extract<T[K], AcceptableObject> extends AcceptableObject
// @ts-ignore
    ? K extends string
// @ts-ignore
    // @ts-ignore this works
// @ts-ignore
    ? `${K}.${NestedKeys<Required<T[K]>>}` : never : never
// @ts-ignore
  )
// @ts-ignore
}[keyof T] : never
// @ts-ignore

// @ts-ignore
type OnlyObj<T> = Extract<T, object>
// @ts-ignore

// @ts-ignore
type OnlyObjNested<T> = {
// @ts-ignore
  [K in keyof T]: OnlyObj<T[K]> extends never ? T[K] : OnlyObj<T[K]>
// @ts-ignore
}
// @ts-ignore

// @ts-ignore
type ExecuteDeepValue<T, Path extends string> =
// @ts-ignore
  Path extends `${infer Key}.${infer Rest}`
// @ts-ignore
  ? Key extends keyof T
// @ts-ignore
  ? ExecuteDeepValue<T[Key], Rest>
// @ts-ignore
  : never
// @ts-ignore
  : Path extends keyof T
// @ts-ignore
  ? T[Path]
// @ts-ignore
  : never;
// @ts-ignore

// @ts-ignore
export type DeepValue<T, Path extends string> = ExecuteDeepValue<OnlyObjNested<T>, Path>