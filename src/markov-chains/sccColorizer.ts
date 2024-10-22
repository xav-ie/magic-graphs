import { getStronglyConnectedComponents } from "./tarjansSCC";
import type { Graph } from "@/useGraph/useGraph"
import { nodesEdgesToAdjList } from '@/graphConverters';

export const sccColorizer = (graph: Graph) => {
  const adjList = nodesEdgesToAdjList(graph.nodes.value, graph.edges.value);
  console.log(adjList)
  const components = getStronglyConnectedComponents(adjList);
  return components
}