import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// import all route.ts files dynamically
const routeModules = import.meta.glob<{
  default: RouteRecordRaw[]
}>('/src/**/route.ts', { eager: true })

const routes = [
  ...Object.values(routeModules).flatMap((mod) => mod.default ?? []),
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
