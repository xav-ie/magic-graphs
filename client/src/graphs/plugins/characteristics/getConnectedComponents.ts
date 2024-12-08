import TarjanGraph from './tarjans'
import type { GEdge, GNode } from "@graph/types";

/**
 * uses Tarjan's algorithm to find the strongly connected components of a graph
 */
export const getStronglyConnectedComponents = (nodes: GNode[], edges: GEdge[]) => {
  const tarjan = new TarjanGraph(nodes.length);
  const nodeIds = nodes.map(node => node.id);

  for (const edge of edges) {
    tarjan.addEdge(nodeIds.indexOf(edge.from), nodeIds.indexOf(edge.to));
  }

  const result = tarjan.SCC();
  return result.map(component => component.map(nodeIndex => nodes[nodeIndex]));
}
