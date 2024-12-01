import type { ProductInfo } from 'src/types'
import type { Graph } from '@graph/types'
import state from './state'
import { useSimulationRunner } from './sim/runner'

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
  simulations: (graph: Graph) => ([
    {
      name: 'Ford Fulkerson',
      description: 'Iteratively find augmenting paths until the residual graph is revealed',
      thumbnail: '/products/thumbnails/network-flow.png',
      runner: useSimulationRunner(graph),
    }
  ]),
  state,
}

export default info