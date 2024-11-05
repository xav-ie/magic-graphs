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

router.beforeEach((to, _, next) => {
  const goingExternal = to.path.includes('https')
  if (goingExternal) {
    window.open(to.path.slice(1), '_blank')
    return next(false) // cancel the navigation
  }
  next()
})

export default router
