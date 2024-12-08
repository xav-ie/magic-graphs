import type { ProductInfo } from 'src/types'
import type { Graph } from '@graph/types'
import state from './state'
import { useSimulationRunner } from './sim/runner'
import { CANT_RUN_REASONS } from '@ui/product/sim/cannotRunReasons'

const canRunFordFulkerson = (graph: Graph) => {
  const isWeighted = graph.settings.value.displayEdgeLabels
  if (!isWeighted) return CANT_RUN_REASONS.NOT_WEIGHTED
  const isDirected = graph.settings.value.isGraphDirected
  if (!isDirected) return CANT_RUN_REASONS.NOT_DIRECTED
  const hasAtLeastTwoNodes = graph.nodes.value.length >= 2
  if (!hasAtLeastTwoNodes) return CANT_RUN_REASONS.NOT_ENOUGH_NODES(2)
  return true
}

const info: ProductInfo = {
  route: {
    path: '/flow',
    component: () => import('./Main.vue'),
  },
  name: 'Network Flow',
  description: 'Visualize Network Flow',
  productId: 'network-flow',
  menu: {
    name: 'Network Flow',
    description: 'Visualize Network Flow',
    thumbnail: '/products/thumbnails/network-flow.png',
  },
  simulations: (graph: Graph) => ([
    {
      name: 'Ford Fulkerson',
      description: 'Iteratively find augmenting paths until the residual graph is revealed',
      thumbnail: '/products/thumbnails/network-flow.png',
      canRun: canRunFordFulkerson,
      runner: useSimulationRunner(graph),
    }
  ]),
  state,
}

export default info