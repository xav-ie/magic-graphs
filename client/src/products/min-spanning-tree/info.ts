import type { ProductInfo } from 'src/types'
import { useMSTSimulation } from './useSimulation'
import type { Graph } from '@graph/types'
import { ref } from 'vue'

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
  simulations: [
    {
      name: 'Kruskal\'s Algorithm',
      description: 'Sort edges by weight and add them to the MST if they do not create a cycle',
      thumbnail: '/products/thumbnails/mst.png',
      controls: (graph: Graph) => useMSTSimulation(graph, ref('kruskal')),
    },
    {
      name: 'Prim\'s Algorithm',
      description: 'Start with a single vertex and grow the MST by adding the smallest edge',
      thumbnail: '/products/thumbnails/mst.png',
      controls: (graph: Graph) => useMSTSimulation(graph, ref('prim')),
    }
  ]
}

export default info