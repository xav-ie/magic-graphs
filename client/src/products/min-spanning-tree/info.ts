import type { ProductInfo } from 'src/types'
import type { Graph } from '@graph/types'
import { useKruskalSimulationRunner, usePrimSimulationRunner } from './sim/runner'

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
  simulations: (graph: Graph) => ([
    {
      name: 'Kruskal\'s Algorithm',
      description: 'Sort edges by weight and add them to the MST if they do not create a cycle',
      thumbnail: '/products/thumbnails/mst.png',
      runner: useKruskalSimulationRunner(graph),
    },
    {
      name: 'Prim\'s Algorithm',
      description: 'Start with a single vertex and grow the MST by adding the smallest edge',
      thumbnail: '/products/thumbnails/mst.png',
      runner: usePrimSimulationRunner(graph),
    }
  ]),
}

export default info