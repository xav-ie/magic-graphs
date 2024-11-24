import { ref } from "vue";
import type { Collaborator, CollaboratorMap } from "./types";
import { SOCKET_URL } from "./constants";
import { io, type Socket } from "socket.io-client";

export const meAsACollaborator = ref<Collaborator | undefined>();
export const socket = ref<Socket | undefined>();
export const collaborators = ref<CollaboratorMap>({});
export const roomId = ref<string | undefined>();

const connect = async () => new Promise<void>((res, rej) => {
  if (socket.value) return res()

  socket.value = io(SOCKET_URL)

  socket.value.on('connect', () => {
    console.log('connected to socket')
    res()
  })

  socket.value.on('connect_error', (err) => {
    console.error('socket connection error', err)
    rej(err)
  })
})

const disconnect = () => {}