import type { Graph } from '@graph/types'
import type { ProductInfo } from 'src/types'
import { useFlowSimulation } from './useFlowSimulation'

const info: ProductInfo = {
  route: {
    path: '/flow',
    component: () => import('./Main.vue'),
  },
  name: 'Network Flow',
  description: 'Visualize Network Flow',
  productId: 'network-flow',
  menu: {
    name: 'Network Flow',
    description: 'Visualize Network Flow',
    thumbnail: '/products/thumbnails/network-flow.png',
  },
  simulations: [
    {
      name: 'Ford Fulkerson',
      controls: (graph: Graph) => useFlowSimulation(graph),
    }
  ]
}

export default info