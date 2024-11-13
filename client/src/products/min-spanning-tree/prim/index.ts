import type { Graph, GEdge } from "@graph/types";
import { clone } from "@utils/clone";
import { ref } from "vue";
import { useColorizeGraph } from "../useColorizeGraph";

export const usePrims = (graph: Graph) => {

    // Trace is just mst array, to get steps render intervals starting at index 0
    const trace = ref<GEdge[]>([])

  const getMinEdge = (edges: GEdge[], inMST: Set<string>): GEdge | null => {
    let minEdge: GEdge | null = null;

    for (const edge of edges) {
      if (
        (inMST.has(edge.from) && !inMST.has(edge.to)) ||
        (inMST.has(edge.to) && !inMST.has(edge.from))
      ) {
        if (!minEdge || Number(edge.label) < Number(minEdge.label)) {
          minEdge = edge;
        }
      }
    }

    return minEdge;
  };

  const prims = () => {
    if (graph.nodes.value.length === 0) return [];

    const mst: GEdge[] = [];
    const inMST = new Set<string>();

    const startNode = graph.nodes.value[0].id;
    inMST.add(startNode);

    const allEdges: GEdge[] = Object.values(clone(graph.edges.value));

    while (mst.length < graph.nodes.value.length - 1) {
      const minEdge = getMinEdge(allEdges, inMST);

      if (!minEdge) {
        break;
      }

      mst.push(minEdge);
      inMST.add(minEdge.from);
      inMST.add(minEdge.to);
    }

    return mst;
  };

  const update = () => {
    trace.value = prims()
    useColorizeGraph(graph, trace.value)
  }

  graph.subscribe("onStructureChange", update);
  graph.subscribe("onEdgeLabelChange", update);
  graph.subscribe("onGraphReset", update);

  return {
    trace
  };
};
