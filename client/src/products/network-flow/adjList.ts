import { doesEdgeFlowOutOfToNode } from "@graph/helpers";
import type { GEdge, GNode } from "@graph/types";
import type { AdjacencyList } from "@graph/useAdjacencyList";

export const getAdjacencyList = ({ nodes, edges }: { nodes: GNode[], edges: GEdge[] }) => {
  return nodes.reduce<AdjacencyList>((acc, node) => {
    acc[node.id] = edges
      .filter(edge => doesEdgeFlowOutOfToNode(edge, node))
      .map(edge => {
        if (edge.type === 'undirected') {
          if (edge.from === node.id) return edge.to
          return edge.from
        }
        return edge.to
      });
    return acc;
  }, {});
}