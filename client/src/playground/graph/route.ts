import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/graph-playground',
  component: () => import('./GraphPlayground.vue'),
}

export default route