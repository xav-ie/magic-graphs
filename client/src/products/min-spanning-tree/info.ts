import { ref } from 'vue'
import type { ProductInfo, SimulationDeclaration } from 'src/types'
import { useMSTSimulation } from './useSimulation'
import type { Graph } from '@graph/types'

const simulations = (graph: Graph): SimulationDeclaration[] => {
  const kruskalControls = useMSTSimulation(graph, ref('kruskal'))
  const primControls = useMSTSimulation(graph, ref('prim'))

  return [
    {
      name: 'Kruskal\'s Algorithm',
      description: 'Sort edges by weight and add them to the MST if they do not create a cycle',
      thumbnail: '/products/thumbnails/mst.png',
      controls: kruskalControls,
    },
    {
      name: 'Prim\'s Algorithm',
      description: 'Start with a single vertex and grow the MST by adding the smallest edge',
      thumbnail: '/products/thumbnails/mst.png',
      controls: primControls,
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