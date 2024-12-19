import type { ProductInfo } from 'src/types'
// import type { Graph } from '@graph/types'

const info: ProductInfo = {
  route: {
    path: '/binary-trees',
    component: () => import('./Main.vue'),
  },
  name: 'Binary Trees',
  description: 'Visualize Binary Trees',
  productId: 'binary-trees',
  menu: {
    name: 'Binary Trees',
    description: 'Binary trees are a commonly to store and search for data',
    thumbnail: '/products/thumbnails/dijkstras.png',
    category: 'data structures',
  },
  // simulations: (graph: Graph) => [{
  //   name: 'Dijkstras Algorithm',
  //   description: 'Finds the shortest path from a source node to all other nodes in a graph',
  //   thumbnail: '/products/thumbnails/dijkstras.png',
  //   canRun: canRunDijkstras(graph),
  //   runner: useSimulationRunner(graph),
  // }],
}

export default info