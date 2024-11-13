import { computed, readonly, ref } from "vue";
import type { Ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { io, Socket } from "socket.io-client";
import type { GEdge, GNode, GraphOptions } from "@graph/types";
import { usePersistentGraph } from "@graph/compositions/usePersistentGraph";
import { getRandomElement } from "@utils/array";
import type {
  AddEdgeOptions,
  AddNodeOptions,
  MoveNodeOptions,
  RemoveNodeOptions
} from "@graph/compositions/useBaseGraph/types";
import { collabTagShapes } from "@graph/schematics/collabTag";
import type { GraphEventMap } from "@graph/events/types";
import { COLLAB_COLORS } from "@graph/compositions/useCollaborativeGraph/types";
import type {
  Collaborator,
  CollaboratorMap,
  GraphEvents,
  GraphState
} from "@graph/compositions/useCollaborativeGraph/types";
import { circle, rect } from "@shapes";

const getSocketURL = () => {
  const isLocalhost = window.location.hostname === 'localhost'
  return isLocalhost ? 'http://localhost:3000' : '/'
}

export const useCollaborativeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {}
) => {
  const graph = usePersistentGraph(canvas, options)
  const socket: Socket<GraphEvents, GraphEvents> = io(getSocketURL())

  const collaborators = ref<CollaboratorMap>({})
  const collaboratorCount = computed(() => Object.keys(collaborators.value).length)
  const inCollaborativeRoom = computed(() => !!roomId.value)

  const meAsACollaborator = useLocalStorage<Collaborator>('collaborator', {
    id: '',
    name: '',
    color: getRandomElement(COLLAB_COLORS),
    mousePosition: { x: 0, y: 0 }
  })

  const roomId = ref('')

  socket.on('connect', () => {
    if (!socket.id) throw new Error('Socket ID is not defined')
    meAsACollaborator.value.id = socket.id
  })

  socket.on('connect_error', (error) => {
    console.warn('socket connection error', error)
  })

  socket.on('disconnect', () => {
    if (!inCollaborativeRoom.value) return
    console.warn('socket disconnected - leaving collaborative room')
    leaveCollaborativeRoom()
  })

  socket.on('collaboratorLeft', (collaboratorId) => {
    console.log('collaborator left', collaboratorId)
    delete collaborators.value[collaboratorId]
    graph.repaint('collaborative-graph/collaborator-left')()
  })

  socket.on('collaboratorJoined', (collaborator) => {
    console.log('collaborator joined', collaborator)
    collaborators.value[collaborator.id] = collaborator
    graph.repaint('collaborative-graph/collaborator-joined')()
  })

  const collaborativeGraphEvents: Partial<GraphEventMap> = {
    onNodeAdded: (node: GNode, { broadcast }: AddNodeOptions) => {
      if (!broadcast) return
      socket.emit('nodeAdded', node)
    },
    onBulkEdgeAdded: (edges: GEdge[], { broadcast }: AddEdgeOptions) => {
      if (!broadcast) return
      for (const edge of edges) {
        socket.emit('edgeAdded', edge)
      }
    },
    onNodeRemoved: (node: GNode, _: GEdge[], { broadcast }: RemoveNodeOptions) => {
      if (!broadcast) return
      socket.emit('nodeRemoved', node.id)
    },
    onBulkNodeRemoved: (nodes: GNode[], _: GEdge[], { broadcast }: RemoveNodeOptions) => {
      if (!broadcast) return
      for (const node of nodes) {
        socket.emit('nodeRemoved', node.id)
      }
    },
    onNodeMoved: (node: GNode, { broadcast }: MoveNodeOptions) => {
      if (!broadcast) return
      socket.emit('nodeMoved', node)
    },
    onEdgeAdded: (edge: GEdge, { broadcast }: AddEdgeOptions) => {
      if (!broadcast) return
      socket.emit('edgeAdded', edge)
    },
    onEdgeRemoved: (edge: GEdge, { broadcast }: RemoveNodeOptions) => {
      if (!broadcast) return
      socket.emit('edgeRemoved', edge.id)
    },
    onEdgeLabelChange: (edge: GEdge) => {
      socket.emit('edgeLabelEdited', edge.id, edge.label)
    },
    onMouseMove: (ev: MouseEvent) => {
      if (collaboratorCount.value < 1) return
      const { offsetX: x, offsetY: y } = ev
      meAsACollaborator.value.mousePosition = { x, y }
      socket.emit('toServerCollaboratorMoved', meAsACollaborator.value.mousePosition)
    },
    onRepaint: (ctx: CanvasRenderingContext2D) => {
      for (const collaborator of Object.values(collaborators.value)) {
        const { tag, cursorPoint } = collabTagShapes(collaborator)
        rect(tag).draw(ctx)
        circle(cursorPoint).draw(ctx)
      }
    }
  }

  socket.on('nodeAdded', (node) => {
    graph.addNode(node, { broadcast: false, focus: false, history: false })
  })

  socket.on('nodeRemoved', (nodeId) => {
    graph.removeNode(nodeId, { broadcast: false, history: false })
  })

  socket.on('nodeMoved', (node) => {
    graph.moveNode(node.id, node, { broadcast: false })
  })

  socket.on('edgeAdded', (node) => {
    graph.addEdge(node, { broadcast: false, focus: false, history: false })
  })

  socket.on('edgeRemoved', (edgeId) => {
    graph.removeEdge(edgeId, { broadcast: false, history: false })
  })

  socket.on('edgeLabelEdited', (edgeId, newLabel) => {
    const edge = graph.getEdge(edgeId)
    if (!edge) throw new Error('edge not found')
    edge.label = newLabel
    graph.repaint('collaborative-graph/edge-label-edit')()
  })

  const COLLAB_MOVE_REPAINT_ID = 'collaborative-graph/collaborator-mouse-move'
  const collaboratorMoveRepaint = graph.repaint(COLLAB_MOVE_REPAINT_ID)

  socket.on('toClientCollaboratorMoved', ({ x, y, id }) => {
    const movedCollaborator = collaborators.value[id]
    if (!movedCollaborator) throw new Error('moving collaborator not found')
    movedCollaborator.mousePosition = { x, y }
    collaboratorMoveRepaint()
  })

  const onCollaborativeRoomJoined = (
    collabMap: CollaboratorMap,
    graphState: GraphState,
  ) => {
    for (const [event, handler] of Object.entries(collaborativeGraphEvents)) {
      // @ts-ignore ts cant handle Object.entries return type
      graph.subscribe(event, handler)
    }

    collaborators.value = collabMap
    // TODO - add load graph method to base graph that can handle
    // TODO - both persistent anf collaborative graph loadout switching
    graph.nodes.value = graphState.nodes
    graph.edges.value = graphState.edges
    graph.repaint('collaborative-graph/join-room')()
  }

  const joinCollaborativeRoom = async (newRoomId: string) => {
    if (roomId.value === newRoomId) return roomId.value
    else if (!newRoomId) throw new Error('non-empty string newRoomId is required')
    else if (!meAsACollaborator.value.id) throw new Error('socket id is not defined - is the socket connected?')
    await leaveCollaborativeRoom()
    return new Promise<string>((res) => {
      socket.emit(
        'joinRoom',
        { ...meAsACollaborator.value, roomId: newRoomId },
        { nodes: graph.nodes.value, edges: graph.edges.value },
        (collabMap, graphState) => {
          onCollaborativeRoomJoined(collabMap, graphState)
          roomId.value = newRoomId
          res(roomId.value)
        }
      )
    })
  }

  const onLeaveCollaborativeRoom = () => {
    for (const [event, handler] of Object.entries(collaborativeGraphEvents)) {
      // @ts-ignore ts cant handle Object.entries return type
      graph.unsubscribe(event, handler)
    }
    roomId.value = ''
    collaborators.value = {}
    graph.repaint('collaborative-graph/leave-room')()
  }

  const leaveCollaborativeRoom = async () => {
    if (!inCollaborativeRoom.value) return

    if (socket.disconnected) {
      onLeaveCollaborativeRoom()
      return roomId.value
    }

    return new Promise<string>((res) => {
      socket.emit('leaveRoom', () => {
        onLeaveCollaborativeRoom()
        res(roomId.value)
      })
    })
  }

  return {
    ...graph,

    /**
     * this clients appearance in the collaborative room
     */
    meAsACollaborator,
    /**
     * join a collaborative room
     */
    joinCollaborativeRoom,
    /**
     * leave the current collaborative room
     */
    leaveCollaborativeRoom,
    /**
     * the collaborators in the current room, not including this client
     */
    collaborators: readonly(collaborators),
    /**
     * the number of collaborators in the current room, not including this client
     */
    collaboratorCount: readonly(collaboratorCount),
    /**
     * the id of the current room this client is in
     */
    collaborativeRoomId: readonly(roomId),
    /**
     * whether this client is in a collaborative room
     */
    inCollaborativeRoom: readonly(inCollaborativeRoom),
  }
}