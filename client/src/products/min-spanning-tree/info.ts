import type { ProductInfo } from 'src/types'
import type { Graph } from '@graph/types'
import { useKruskalSimulationRunner, usePrimSimulationRunner } from './sim/runner'
import { canRunMST } from './sim/guard'
import { generateId } from '@utils/id'

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
    category: 'algorithms',
  },
  simulations: (graph: Graph) => ([
    {
      name: 'Kruskal\'s Algorithm',
      description: 'Sort edges by weight and add them to the MST if they do not create a cycle',
      thumbnail: '/products/thumbnails/mst.png',
      canRun: canRunMST(graph),
      runner: useKruskalSimulationRunner(graph),
    },
    {
      name: 'Prim\'s Algorithm',
      description: 'Start with a single vertex and grow the MST by adding the smallest edge',
      thumbnail: '/products/thumbnails/mst.png',
      canRun: canRunMST(graph),
      runner: usePrimSimulationRunner(graph),
    }
  ]),
  templates: [
    {
      id: generateId(),
      productId: 'mst',
      title: 'Minimum Spanning Tree',
      description: 'Visualize Minimum Spanning Tree',
      thumbnail: '/products/thumbnails/mst.png',
      graphState: {
        nodes: [],
        edges: [],
      },
    }
  ],
}

export default info