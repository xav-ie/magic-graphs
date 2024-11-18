import type { ProductInfo, SimulationDeclaration } from 'src/types'
import { useDijkstraSimulation } from './useSimulation'
import type { Graph } from '@graph/types'

const simulations = (graph: Graph): SimulationDeclaration[] => {
  const controls = useDijkstraSimulation(graph)

  return [
    {
      name: 'Dijkstras Algorithm',
      description: 'Finds the shortest path from a source node to all other nodes in a graph',
      thumbnail: '/products/thumbnails/dijkstras.png',
      controls,
    },
  ]
}

const info: ProductInfo = {
  route: {
    path: '/dijkstras',
    component: () => import('./Main.vue'),
  },
  name: 'Dijkstras Algorithm',
  description: 'Visualize Dijkstras Algorithm',
  productId: 'dijkstras',
  menu: {
    name: 'Dijkstras Algorithm',
    description: 'Visualize Dijkstras Algorithm',
    thumbnail: '/products/thumbnails/dijkstras.png',
  },
  simulations,
}

export default info