import type { ProductInfo } from 'src/types'
import type { Graph } from '@graph/types'
import { useBFSSimulationRunner, useDFSSimulationRunner } from './sim/runner'
import { canRunBasicSearch } from './sim/guard'
import state from './state'

const info: ProductInfo = {
  route: {
    path: '/basic-search',
    component: () => import('./Main.vue'),
  },
  name: 'Basic Search',
  description: 'Visualize basic search algorithms',
  productId: 'basic-search',
  menu: {
    name: 'Basic Search',
    description: 'Visualize basic search algorithms like BFS and DFS',
    thumbnail: '/products/thumbnails/dijkstras.png',
    category: 'algorithms',
  },
  simulations: (graph: Graph) => [
    {
      name: 'Breadth First Search',
      description: 'Explore all neighbors of a node before moving to the next level',
      thumbnail: '/products/thumbnails/dijkstras.png',
      canRun: canRunBasicSearch(graph),
      runner: useBFSSimulationRunner(graph),
    },
    {
      name: 'Depth First Search',
      description: 'Explore as far as possible along each branch before backtracking',
      thumbnail: '/products/thumbnails/dijkstras.png',
      canRun: canRunBasicSearch(graph),
      runner: useDFSSimulationRunner(graph),
    }
  ],
  state,
}

export default info