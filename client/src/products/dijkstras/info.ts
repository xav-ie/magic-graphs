import type { ProductInfo, SimulationDeclaration } from 'src/types'
import type { Graph } from '@graph/types'
import { useSimulationRunner } from './useSimulationRunner'

const simulations = (graph: Graph): SimulationDeclaration[] => {
  const manager = useSimulationRunner(graph)

  return [
    {
      name: 'Dijkstras Algorithm',
      description: 'Finds the shortest path from a source node to all other nodes in a graph',
      thumbnail: '/products/thumbnails/dijkstras.png',
      controls: manager.simControls,
      onInit: manager.start,
      onDismiss: manager.stop,
    },
  ]
}

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
  simulations,
}

export default info