import type { ProductInfo } from 'src/types'
import { createWebHistory, createRouter } from 'vue-router'

// import all route.ts files dynamically
const infoModules = import.meta.glob<{
  default: ProductInfo
}>('/src/**/info.ts', { eager: true })

const routes = [
  ...Object.values(infoModules).flatMap((mod) => mod.default.route ?? []),
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
