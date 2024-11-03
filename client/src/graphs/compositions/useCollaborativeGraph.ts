import { computed, readonly, ref } from "vue";
import type { Ref } from "vue";
import type { UserEditableGraphOptions } from "./useUserEditableGraph";
import { usePersistentGraph } from "./usePersistentGraph";
import { io, Socket } from "socket.io-client";
import type { GEdge, GNode } from "@graph/types";
import colors from "@utils/colors";
import { getRandomElement } from "@utils/array";
import { rect } from "@shapes";

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

  collaboratorJoined: (collaborator: Collaborator) => void
  collaboratorLeft: (collaboratorId: Collaborator['id']) => void

  toServerCollaboratorMoved: (collaboratorMove: ToServerCollaboratorMove) => void
  toClientCollaboratorMoved: (collaboratorMove: ToClientCollaboratorMove) => void

  joinRoom: (
    JoinOptions: Collaborator & { roomId: string },
    mapCallback: (collabMap: CollaboratorMap, graphState: GraphState) => void
  ) => void

  leaveRoom: (
    roomId: string,
    confirmationCallback: () => void
  ) => void
}

const collabColors = [
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

export const useCollaborativeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {
  const graph = usePersistentGraph(canvas, options)
  const socket: Socket<GraphEvents, GraphEvents> = io(getSocketURL())

  const collaborators = ref<CollaboratorMap>({})
  const collaboratorCount = computed(() => Object.keys(collaborators.value).length)

  const meAsACollaborator = ref<Collaborator>({
    id: '',
    name: 'Anonymous',
    color: getRandomElement(collabColors),
    mousePosition: { x: 0, y: 0 }
  })

  const roomId = ref('')

  const joinCollaborativeRoom = async (newRoomId: string) => {
    if (roomId.value === newRoomId) return roomId.value
    else if (!newRoomId) throw new Error('non-empty string newRoomId is required')
    else if (!meAsACollaborator.value.id) throw new Error('socket id is not defined - is the socket connected?')
    await leaveCollaborativeRoom()
    return new Promise<string>((res) => {
      socket.emit(
        'joinRoom',
        { ...meAsACollaborator.value, roomId: newRoomId },
        (collabMap, graphState) => {
          collaborators.value = collabMap
          roomId.value = newRoomId
          // TODO - add load graph method to base graph that can handle
          // TODO - both persistent anf collaborative graph loadout switching
          console.log('graph state received on join', graphState)
          console.log('my id on join', meAsACollaborator.value.id)
          graph.nodes.value = graphState.nodes
          graph.edges.value = graphState.edges
          graph.repaint('collaborative-graph/join-room')()
          res(newRoomId)
        }
      )
    })
  }

  const leaveCollaborativeRoom = async () => {
    if (!roomId.value) return roomId.value
    return new Promise<string>((res) => {
      socket.emit('leaveRoom', roomId.value, () => {
        res(roomId.value)
        roomId.value = ''
      })
    })
  }

  socket.on('connect', () => {
    if (!socket.id) throw new Error('Socket ID is not defined')
    meAsACollaborator.value.id = socket.id
  })

  socket.on('connect_error', (error) => {
    console.log('socket connection error', error)
  })

  socket.on('disconnect', () => {
    console.log('socket disconnected')
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

  graph.subscribe('onNodeAdded', (node, { broadcast }) => {
    if (!broadcast || collaboratorCount.value < 1) return
    socket.emit('nodeAdded', node)
  })

  socket.on('nodeAdded', (node) => {
    graph.addNode(node, { broadcast: false, focus: false })
  })

  graph.subscribe('onNodeRemoved', (node, { broadcast }) => {
    if (!broadcast || collaboratorCount.value < 1) return
    socket.emit('nodeRemoved', node.id)
  })

  socket.on('nodeRemoved', (nodeId) => {
    graph.removeNode(nodeId, { broadcast: false })
  })

  graph.subscribe('onNodeMoved', (node, { broadcast }) => {
    if (!broadcast || collaboratorCount.value < 1) return
    socket.emit('nodeMoved', node)
  })

  socket.on('nodeMoved', (node) => {
    graph.moveNode(node.id, node.x, node.y, { broadcast: false })
  })

  graph.subscribe('onEdgeAdded', (node, { broadcast }) => {
    if (!broadcast || collaboratorCount.value < 1) return
    socket.emit('edgeAdded', node)
  })

  socket.on('edgeAdded', (node) => {
    graph.addEdge(node, { broadcast: false, focus: false })
  })

  graph.subscribe('onEdgeRemoved', (edge, { broadcast }) => {
    if (!broadcast || collaboratorCount.value < 1) return
    socket.emit('edgeRemoved', edge.id)
  })

  socket.on('edgeRemoved', (edgeId) => {
    graph.removeEdge(edgeId, { broadcast: false })
  })

  graph.subscribe('onMouseMove', (ev) => {
    if (collaboratorCount.value < 1) return
    const { offsetX: x, offsetY: y } = ev
    meAsACollaborator.value.mousePosition = { x, y }
    socket.emit('toServerCollaboratorMoved', meAsACollaborator.value.mousePosition)
  })

  const COLLAB_MOVE_REPAINT_ID = 'collaborative-graph/collaborator-mouse-move'
  const collaboratorMoveRepaint = graph.repaint(COLLAB_MOVE_REPAINT_ID)
  socket.on('toClientCollaboratorMoved', ({ x, y, id }) => {
    const movedCollaborator = collaborators.value[id]
    if (!movedCollaborator) throw new Error('moving collaborator not found')
    movedCollaborator.mousePosition = { x, y }
    collaboratorMoveRepaint()
  })

  graph.subscribe('onRepaint', (ctx) => {
    // TODO - update with border radius when its added to rect api
    for (const collaborator of Object.values(collaborators.value)) {
      const width = collaborator.name.length * 12
      const height = 24
      rect({
        at: {
          x: collaborator.mousePosition.x - width / 2,
          y: collaborator.mousePosition.y - height / 2,
        },
        width,
        height,
        color: collaborator.color,
        text: {
          content: collaborator.name,
          color: colors.WHITE,
          fontSize: 14,
          fontWeight: 'bold',
        },
      }).draw(ctx)
    }
  })

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
  }
}