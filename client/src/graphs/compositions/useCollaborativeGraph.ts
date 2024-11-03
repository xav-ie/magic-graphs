import { readonly, ref } from "vue";
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

  joinRoom: (JoinOptions: Collaborator & { roomId: string }) => void
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

  const collaborators = ref<Map<Collaborator['id'], Collaborator>>(new Map())

  const self = ref<Collaborator>({
    id: '',
    name: 'Dila',
    color: getRandomElement(collabColors),
    mousePosition: { x: 0, y: 0 }
  })

  const roomId = ref('')

  const joinCollaborativeRoom = (newRoomId: string) => {
    socket.emit('joinRoom', { ...self.value, roomId: newRoomId })
    socket.emit('collaboratorJoined', self.value)
    roomId.value = newRoomId
  }

  socket.on('connect', () => {
    if (!socket.id) throw new Error('Socket ID is not defined')
    self.value.id = socket.id
  })

  socket.on('connect_error', (error) => {
    console.log('socket connection error', error)
  })

  socket.on('disconnect', () => {
    console.log('socket disconnected')
  })

  socket.on('collaboratorJoined', (collaborator) => {
    console.log('collaborator joined', collaborator)
    collaborators.value.set(collaborator.id, collaborator)
  })

  graph.subscribe('onNodeAdded', (node, { broadcast }) => {
    if (!broadcast || collaborators.value.size < 1) return
    socket.emit('nodeAdded', node)
  })

  socket.on('nodeAdded', (node) => {
    graph.addNode(node, { broadcast: false, focus: false })
  })

  graph.subscribe('onNodeRemoved', (node, { broadcast }) => {
    if (!broadcast || collaborators.value.size < 1) return
    socket.emit('nodeRemoved', node.id)
  })

  socket.on('nodeRemoved', (nodeId) => {
    graph.removeNode(nodeId, { broadcast: false })
  })

  graph.subscribe('onNodeMoved', (node, { broadcast }) => {
    if (!broadcast || collaborators.value.size < 1) return
    socket.emit('nodeMoved', node)
  })

  socket.on('nodeMoved', (node) => {
    graph.moveNode(node.id, node.x, node.y, { broadcast: false })
  })

  graph.subscribe('onEdgeAdded', (node, { broadcast }) => {
    if (!broadcast || collaborators.value.size < 1) return
    socket.emit('edgeAdded', node)
  })

  socket.on('edgeAdded', (node) => {
    graph.addEdge(node, { broadcast: false, focus: false })
  })

  graph.subscribe('onEdgeRemoved', (edge, { broadcast }) => {
    if (!broadcast || collaborators.value.size < 1) return
    socket.emit('edgeRemoved', edge.id)
  })

  socket.on('edgeRemoved', (edgeId) => {
    graph.removeEdge(edgeId, { broadcast: false })
  })

  graph.subscribe('onMouseMove', (ev) => {
    if (collaborators.value.size < 1) return
    const { offsetX, offsetY } = ev
    self.value.mousePosition = { x: offsetX, y: offsetY }
    socket.emit('toServerCollaboratorMoved', {
      x: offsetX,
      y: offsetY
    })
  })

  const COLLAB_MOVE_REPAINT_ID = 'collaborative-graph/collaborator-mouse-move'
  const collaboratorMoveRepaint = graph.repaint(COLLAB_MOVE_REPAINT_ID)
  socket.on('toClientCollaboratorMoved', ({ x, y, id }) => {
    const movedCollaborator = collaborators.value.get(id)
    if (!movedCollaborator) throw new Error('moving collaborator not found')
    movedCollaborator.mousePosition = { x, y }
    collaboratorMoveRepaint()
  })

  graph.subscribe('onRepaint', (ctx) => {
    // TODO - update with border radius when its added to rect api
    for (const collaborator of collaborators.value.values()) {
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
    self,
    joinCollaborativeRoom,
    collaborators: readonly(collaborators),
    collaborativeRoomId: readonly(roomId),
  }
}