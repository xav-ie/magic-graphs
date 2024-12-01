import type { ProductInfo } from 'src/types'
import type { Graph } from '@graph/types'
import { useSimulationRunner } from './sim/runner'
import state from './state'

const info: ProductInfo = {
  route: {
    path: '/dijkstras',
    component: () => import('./Main.vue'),
  },
  name: 'Dijkstras',
  description: 'Visualize Dijkstras Algorithm',
  productId: 'dijkstras',
  menu: {
    name: 'Dijkstras Algorithm',
    description: 'Visualize Dijkstras Algorithm',
    thumbnail: '/products/thumbnails/dijkstras.png',
  },
  simulations: (graph: Graph) => [{
    name: 'Dijkstras Algorithm',
    description: 'Finds the shortest path from a source node to all other nodes in a graph',
    thumbnail: '/products/thumbnails/dijkstras.png',
    runner: useSimulationRunner(graph),
  }],
  state,
}

export default info