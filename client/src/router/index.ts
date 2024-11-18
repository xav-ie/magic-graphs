import { createWebHistory, createRouter } from 'vue-router'
import type { ProductInfo } from 'src/types'

// import all route.ts files dynamically
const infoModules = import.meta.glob<{
  default: ProductInfo
}>('/src/**/info.ts', { eager: true })

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...Object.values(infoModules).flatMap((mod) => mod.default.route ?? []),
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('./404.vue'),
    }
  ],
})

router.beforeEach((to, _, next) => {
  const goingExternal = to.path.includes('https')
  if (goingExternal) window.location.replace(to.path.slice(1))
  next()
})

export default router
