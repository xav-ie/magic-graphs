import type { ProductInfo, SimulationDeclaration } from 'src/types'
import type { Graph } from '@graph/types'
import { useSimulationRunner } from './useSimulationRunner'

const flowSimulations = (graph: Graph): SimulationDeclaration[] => {
  const runner = useSimulationRunner(graph)

  return [
    {
      name: 'Ford Fulkerson',
      description: 'Iteratively find augmenting paths until the residual graph is revealed',
      thumbnail: '/products/thumbnails/network-flow.png',
      runner,
    }
  ]
}

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
  simulations: (graph: Graph) => flowSimulations(graph),
}

export default info