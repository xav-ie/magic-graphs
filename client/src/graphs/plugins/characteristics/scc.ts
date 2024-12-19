import { computed } from 'vue';
import TarjanGraph from './tarjans'
import type { GEdge, GNode } from "@graph/types";
import type { BaseGraph } from '@graph/base';

type GetSCCs = (nodes: GNode[], edges: GEdge[]) => GNode[][];

/**
 * maps a node id to the index of the strongly connected component it belongs to
 */
export type NodeIdToSCC = Map<GNode['id'], number>;

/**
 * uses Tarjan's algorithm to find the strongly connected components of a graph
 */
export const getStronglyConnectedComponents: GetSCCs = (nodes, edges) => {
  const tarjan = new TarjanGraph(nodes.length);
  const nodeIds = nodes.map(node => node.id);

  for (const edge of edges) {
    tarjan.addEdge(nodeIds.indexOf(edge.from), nodeIds.indexOf(edge.to));
  }

  const result = tarjan.SCC();
  return result.map(component => component.map(nodeIndex => nodes[nodeIndex]));
}

export const useStronglyConnectedComponents = (graph: BaseGraph) => {
  const { nodes, edges } = graph;

  const stronglyConnectedComponents = computed(() => {
    return getStronglyConnectedComponents(nodes.value, edges.value);
  });

  const nodeIdToStronglyConnectedComponent = computed(() => {
    const sccs = stronglyConnectedComponents.value;
    return sccs.reduce<NodeIdToSCC>((acc, scc, i) => {
      for (const { id } of scc) acc.set(id, i);
      return acc;
    }, new Map());
  })

  return {
    stronglyConnectedComponents,
    nodeIdToStronglyConnectedComponent
  }
}