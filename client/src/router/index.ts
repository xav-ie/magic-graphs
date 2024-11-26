import { createWebHistory, createRouter } from 'vue-router'
import type { ProductInfo } from 'src/types'
import GraphSandboxInfo from '@product/graph-sandbox/info'
import { collabControls } from '@graph/collab'

// import all route.ts files dynamically
const infoModules = import.meta.glob<{
  default: ProductInfo
}>('/src/**/info.ts', { eager: true })

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: GraphSandboxInfo.route.path,
    },
    ...Object.values(infoModules).flatMap((mod) => mod.default.route ?? []),
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('./404.vue'),
    }
  ],
})

router.beforeEach(() => {
  collabControls.disconnectFromRoom()
})

export default router
