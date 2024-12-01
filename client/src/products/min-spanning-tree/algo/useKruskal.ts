import { computed, ref } from "vue";
import type { Graph, GEdge } from "@graph/types";
import { clone } from "@utils/clone";

export type Parent = Map<string, string>

export type Rank = Map<string, number>

export const useKruskal = (graph: Graph) => {

  const find = (parent: Parent, nodeId: string): string => {
    if (parent.get(nodeId) !== nodeId) {
      parent.set(nodeId, find(parent, parent.get(nodeId)!));
    }
    return parent.get(nodeId)!;
  };

  const union = (parent: Parent, rank: Rank, nodeA: string, nodeB: string) => {
    const rootA = find(parent, nodeA);
    const rootB = find(parent, nodeB);

    if (rootA !== rootB) {
      const rankA = rank.get(rootA)!;
      const rankB = rank.get(rootB)!;

      if (rankA < rankB) {
        parent.set(rootA, rootB);
      } else if (rankA > rankB) {
        parent.set(rootB, rootA);
      } else {
        parent.set(rootB, rootA);
        rank.set(rootA, rankA + 1);
      }
    }
  };

  const kruskal = () => {
    const sortedEdges: GEdge[] = Object.values(clone(graph.edges.value)).sort(
      (a, b) => Number(a.label) - Number(b.label)
    );

    const parent = new Map<string, string>();
    const rank = new Map<string, number>();

    graph.nodes.value.forEach((node) => {
      parent.set(node.id, node.id);
      rank.set(node.id, 0);
    });

    const mst: GEdge[] = [];
    for (const edge of sortedEdges) {
      const sourceRoot = find(parent, edge.from);
      const targetRoot = find(parent, edge.to);

      if (sourceRoot !== targetRoot) {
        mst.push(edge);
        union(parent, rank, sourceRoot, targetRoot);

        if (mst.length === graph.nodes.value.length - 1) break;
      }
    }
    return mst;
  };

  /**
   * just the mst array, to get the first n steps, slice the array at (0, n)
   */
  const trace = ref<GEdge[]>(kruskal());

  const update = () =>  trace.value = kruskal();

  graph.subscribe("onStructureChange", update);
  graph.subscribe("onEdgeLabelChange", update);
  graph.subscribe("onGraphReset", update);

  return {
    output: {
      mst: computed(() => trace.value.at(-1)),
    },
    trace: computed(() => trace.value),
  }
};
