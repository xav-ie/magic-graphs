import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/search-visualizer',
  component: () => import('./Main.vue'),
}

export default route