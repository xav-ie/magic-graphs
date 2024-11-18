import type { ProductInfo } from 'src/types'
import { useDijkstraSimulation } from './useSimulation'

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
  simulations: (graph) => ([
    {
      name: 'Dijkstras Algorithm',
      description: 'Finds the shortest path from a source node to all other nodes in a graph',
      thumbnail: '/products/thumbnails/dijkstras.png',
      controls: () => useDijkstraSimulation(graph),
    },
  ]),
}

export default info