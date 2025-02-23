import type { BaseGraph } from '@graph/base';
import type { AdjacencyLists } from '@graph/useAdjacencyList';
import { useConnected } from './connected';
import { useStronglyConnectedComponents } from './scc';
import { useBipartite } from './bipartite';
import { useCycles } from './cycles';
import { useBidirectionalEdges } from './bidirectional';
import { useComplete } from './complete';

export const useCharacteristics = (graph: BaseGraph & AdjacencyLists) => {
  const connected = useConnected(graph);
  const bidirectionalEdges = useBidirectionalEdges(graph);
  const sccs = useStronglyConnectedComponents(graph);
  const bipartite = useBipartite(graph.adjacencyList);
  const cycles = useCycles({ ...graph, ...sccs });
  const complete = useComplete(graph);

  return {
    ...complete,
    ...cycles,
    ...sccs,
    ...bidirectionalEdges,
    ...bipartite,
    ...connected,
  };
};
