import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/shape-playground',
  component: () => import('./ShapePlayground.vue'),
}

export default route