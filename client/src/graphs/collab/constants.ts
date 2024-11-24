

const IS_PROD = window.location.hostname !== 'localhost'

const LOCAL_SOCKET_URL = 'http://localhost:3000'
const PROD_SOCKET_URL = '/'

export const SOCKET_URL = IS_PROD ? PROD_SOCKET_URL : LOCAL_SOCKET_URL