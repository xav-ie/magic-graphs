import { computed, readonly, ref } from "vue";
import { COLLAB_COLORS, type Collaborator, type CollaboratorMap, type CollaboratorProfile, type SocketEvents } from "./types";
import { SOCKET_URL } from "./constants";
import { io, type Socket } from "socket.io-client";
import type { Graph } from "@graph/types";
import { startEmitting, stopEmitting } from "./emit";
import type { ProductInfo } from "src/types";
import { useLocalStorage } from "@vueuse/core";
import { getRandomElement } from "@utils/array";
import { startListening } from "./listen";
import { paintCollabTags } from "./collabTag";
import { useRoute } from "vue-router";

export const myCollaboratorProfile = useLocalStorage<CollaboratorProfile>('collab-profile', {
  name: 'Dila',
  color: getRandomElement(COLLAB_COLORS),
})

const meAsACollaborator = ref<Collaborator | undefined>();
const socket = ref<Socket<SocketEvents, SocketEvents> | undefined>();
const collaborators = ref<CollaboratorMap>({});
const connectedRoomId = ref<string | undefined>();
const currentGraph = ref<Graph | undefined>();

const collabTagPainter = paintCollabTags(collaborators)

const resetCollabState = () => {
  meAsACollaborator.value = undefined;
  connectedRoomId.value = undefined;
  collaborators.value = {};
  if (socket.value) {
    if (currentGraph.value) {
      currentGraph.value.unsubscribe('onRepaint', collabTagPainter)
      stopEmitting(socket.value, { graph: currentGraph.value })
    }
    socket.value.disconnect();
    socket.value = undefined;
  }
}

const connectSocket = async () => new Promise<Socket<SocketEvents, SocketEvents>>((res, rej) => {
  if (socket.value) return res(socket.value);

  const socketInstance = io(SOCKET_URL)

  socketInstance.on('connect', () => {
    resetCollabState()
    if (!socketInstance) throw new Error('this should never happen')
    res(socketInstance)
  })

  socketInstance.on('connect_error', (err) => {
    console.error('socket connection error', err)
    rej(err)
  })

  socketInstance.on('disconnect', () => {
    resetCollabState()
    console.log('disconnected from socket')
  })
})

const disconnectSocket = () => {
  if (!socket.value) return
  socket.value.disconnect()
}

type ConnectOptions = {
  /**
   * graph instance for the collab system to write new nodes/edges to when received
   * and to read from when sending new nodes/edges to other collaborators
   */
  graph: Graph,
  /**
   * room id to connect to
   */
  roomId: string,
  /**
   * product id that the graph belongs to
   */
  productId: ProductInfo['productId']
}

const connectToRoom = async (options: ConnectOptions) => {
  if (socket.value) return

  socket.value = await connectSocket()
  if (!socket.value.id) throw new Error('socket id not found')

  currentGraph.value = options.graph
  connectedRoomId.value = options.roomId

  meAsACollaborator.value = {
    id: socket.value.id,
    name: myCollaboratorProfile.value.name,
    color: myCollaboratorProfile.value.color,
    mousePosition: { x: 0, y: 0 },
    productId: options.productId,
  }

  return new Promise<void>((res) => {
    if (!socket.value) throw new Error('socket not connected')
    if (!meAsACollaborator.value) throw new Error('meAsACollaborator not found')

    const joinOptions = {
      roomId: options.roomId,
      me: meAsACollaborator.value,
      graphState: {
        nodes: options.graph.nodes.value,
        edges: options.graph.edges.value,
      }
    }

    options.graph.subscribe('onRepaint', collabTagPainter)
    startListening(socket.value, { graph: options.graph, collaborators })
    startEmitting(socket.value, { graph: options.graph })

    socket.value.emit('joinRoom', joinOptions, (collabMap, graphState) => {
      collaborators.value = collabMap
      options.graph.nodes.value = graphState.nodes
      options.graph.edges.value = graphState.edges
      options.graph.emit('onStructureChange', graphState.nodes, graphState.edges)
      res()
    })
  })
}

const disconnectFromRoom = () => {
  if (!socket.value) return
  disconnectSocket()
}

const switchProduct = async ({ productId, graph }: {
  productId: ProductInfo['productId'],
  graph: Graph
}) => {
  if (!socket.value) {
    console.warn('socket not connected, connect to a room first')
    return
  }

  if (!connectedRoomId.value) throw new Error('connected room id not found')

  disconnectFromRoom()
  await connectToRoom({ graph, roomId: connectedRoomId.value, productId })
}

export const useCollab = () => ({
  currentGraph,
  meAsACollaborator: readonly(meAsACollaborator),
  collaborators: readonly(collaborators),
  connectedRoomId: readonly(connectedRoomId),

  connectToRoom,
  disconnectFromRoom,
  switchProduct,

  isConnected: computed(() => !!socket.value),
  collaboratorCount: computed(() => Object.keys(collaborators.value).length + 1),
})
