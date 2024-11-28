import type { ProductInfo, SimulationDeclaration } from 'src/types'
import type { Graph } from '@graph/types'
import { useKruskalSimulationRunner } from './useSimulationRunner'

const simulations = (graph: Graph): SimulationDeclaration[] => {
  const kruskalRunner = useKruskalSimulationRunner(graph)
  const primRunner = useKruskalSimulationRunner(graph)

  return [
    {
      name: 'Kruskal\'s Algorithm',
      description: 'Sort edges by weight and add them to the MST if they do not create a cycle',
      thumbnail: '/products/thumbnails/mst.png',
      runner: kruskalRunner,
    },
    {
      name: 'Prim\'s Algorithm',
      description: 'Start with a single vertex and grow the MST by adding the smallest edge',
      thumbnail: '/products/thumbnails/mst.png',
      runner: primRunner,
    }
  ]
}

const info: ProductInfo = {
  route: {
    path: '/mst',
    component: () => import('./Main.vue'),
  },
  name: 'Minimum Spanning Trees',
  description: 'Visualize Minimum Spanning Trees',
  productId: 'mst',
  menu: {
    name: 'Minimum Spanning Trees',
    description: 'Visualize Minimum Spanning Trees',
    thumbnail: '/products/thumbnails/mst.png',
  },
  simulations,
}

export default info