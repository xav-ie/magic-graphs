import { computed, readonly, ref } from "vue";
import type { Ref } from "vue";
import type { UserEditableGraphOptions } from "./useUserEditableGraph";
import { usePersistentGraph } from "./usePersistentGraph";
import { io, Socket } from "socket.io-client";
import type { GEdge, GNode } from "@graph/types";
import colors from "@utils/colors";
import { getRandomElement } from "@utils/array";
import { circle, rect } from "@shapes";
import type { AddEdgeOptions, AddNodeOptions, MoveNodeOptions, RemoveNodeOptions } from "@graph/baseGraphAPIs";
import type { BaseGraphEvents } from "@graph/events";
import { collabTagShapes } from "@graph/schematics/collabTag";

const getSocketURL = () => {
  const isLocalhost = window.location.hostname === 'localhost'
  return isLocalhost ? 'http://localhost:3000' : '/'
}

export type Collaborator = {
  id: string
  name: string
  color: string
  mousePosition: { x: number, y: number }
}

export type ToServerCollaboratorMove = {
  x: number
  y: number
}

export type ToClientCollaboratorMove = {
  id: Collaborator['id']
  x: number
  y: number
}

type CollaboratorMap = Record<Collaborator['id'], Collaborator>

type GraphState = {
  nodes: GNode[],
  edges: GEdge[]
}

export interface GraphEvents {
  nodeAdded: (node: GNode) => void
  nodeRemoved: (nodeId: GNode['id']) => void
  nodeMoved: (node: GNode) => void

  edgeAdded: (edge: GEdge) => void
  edgeRemoved: (edgeId: GEdge['id']) => void
  edgeWeightEdited: (edgeId: GEdge['id'], weight: number) => void

  collaboratorJoined: (collaborator: Collaborator) => void
  collaboratorLeft: (collaboratorId: Collaborator['id']) => void

  toServerCollaboratorMoved: (collaboratorMove: ToServerCollaboratorMove) => void
  toClientCollaboratorMoved: (collaboratorMove: ToClientCollaboratorMove) => void

  joinRoom: (
    joinOptions: Collaborator & { roomId: string },
    joinWithGraphState: GraphState | null,
    mapCallback: (collabMap: CollaboratorMap, graphState: GraphState) => void
  ) => void

  leaveRoom: (confirmationCallback: () => void) => void
}

export const COLLAB_COLORS = [
  colors.AMBER_600,
  colors.BLUE_600,
  colors.CYAN_600,
  colors.GREEN_600,
  colors.INDIGO_600,
  colors.LIME_600,
  colors.ORANGE_600,
  colors.PINK_600,
  colors.PURPLE_600,
  colors.RED_600,
]

export const COLLAB_NAMES = [
  'Joud',
  'Zavier',
  'Thomas',
  'Jaime',
  'Dila',
  'Bella',
  'Julian',
  'Adriana',
  'Juliana',
  'Yona'
]

export const useCollaborativeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {
  const graph = usePersistentGraph(canvas, options)
  const socket: Socket<GraphEvents, GraphEvents> = io(getSocketURL())

  const collaborators = ref<CollaboratorMap>({})
  const collaboratorCount = computed(() => Object.keys(collaborators.value).length)
  const inCollaborativeRoom = computed(() => !!roomId.value)

  const meAsACollaborator = ref<Collaborator>({
    id: '',
    name: getRandomElement(COLLAB_NAMES),
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

  const collaborativeGraphEvents: Partial<BaseGraphEvents> = {
    onNodeAdded: (node: GNode, { broadcast }: AddNodeOptions) => {
      if (!broadcast) return
      socket.emit('nodeAdded', node)
    },
    onNodeRemoved: (node: GNode, { broadcast }: RemoveNodeOptions) => {
      if (!broadcast) return
      socket.emit('nodeRemoved', node.id)
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
    onEdgeWeightChange: (edge: GEdge) => {
      socket.emit('edgeWeightEdited', edge.id, edge.weight)
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
    graph.addNode(node, { broadcast: false, focus: false })
  })

  socket.on('nodeRemoved', (nodeId) => {
    graph.removeNode(nodeId, { broadcast: false })
  })

  socket.on('nodeMoved', (node) => {
    graph.moveNode(node.id, node.x, node.y, { broadcast: false })
  })

  socket.on('edgeAdded', (node) => {
    graph.addEdge(node, { broadcast: false, focus: false })
  })

  socket.on('edgeRemoved', (edgeId) => {
    graph.removeEdge(edgeId, { broadcast: false })
  })

  socket.on('edgeWeightEdited', (edgeId, newWeight) => {
    const edge = graph.getEdge(edgeId)
    if (!edge) throw new Error('edge not found')
    edge.weight = newWeight
    graph.repaint('collaborative-graph/edge-weight-edit')()
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