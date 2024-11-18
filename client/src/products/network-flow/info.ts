import type { Graph } from '@graph/types'
import type { ProductInfo } from 'src/types'
import { useFlowSimulation } from './useFlowSimulation'
import { useSourceSinkControls } from './useSourceSinkControls'
import { useSourceSinkStyler } from './useSourceSinkStyler'
import { useEdgeThickener } from './useEdgeThickener'

const flowSimulations = (graph: Graph) => {
  const manager = useSourceSinkControls(graph)

  const {
    activate: activeEdgeThickener,
    deactivate: deactivateEdgeThickener
  } = useEdgeThickener(graph)

  const {
    stylize: activateFlowColorizer,
    destylize: deactivateFlowColorizer
  } = useSourceSinkStyler(graph, manager)

  return [
    {
      name: 'Ford Fulkerson',
      description: 'Iteratively find augmenting paths until the residual graph is revealed',
      thumbnail: '/products/thumbnails/network-flow.png',
      controls: () => useFlowSimulation(graph, manager),
      setup: async () => {
        activateFlowColorizer()
        activeEdgeThickener()
        await manager.setSourceNode()
        await manager.setSinkNode()
      },
      cleanup: () => {
        deactivateFlowColorizer()
        deactivateEdgeThickener()
      }
    }
  ]
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
  simulations: (graph: Graph) => flowSimulations(graph),
}

export default info