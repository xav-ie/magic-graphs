import { computed, ref } from "vue";
import type { Graph } from "@graph/types";
import { useTargetNodeColor } from "./theme/useTargetNodeColor";
import { treeArrayToGraph } from "./tree/treeArrayToGraph";
import type { AVLTree, InsertTrace } from "./tree/avl";
import { useSimulationControls } from "@ui/product/sim/useSimulationControls";

const ROOT_POS = { x: 2300, y: 1500 };

export const useTreeSim = (graph: Graph, tree: AVLTree) => {
  const { targetNode, activate } = useTargetNodeColor(graph);
  activate();

  const currTrace = ref<InsertTrace[]>([]);
  const trace = computed(() => currTrace.value);

  const sim = useSimulationControls(trace);

  sim.onStepChange((newStep) => {
    targetNode.value = undefined;

    const step = trace.value[newStep];
    treeArrayToGraph(graph, step.treeState, tree.root!, ROOT_POS);

    if (step.action === "compare") {
      const { treeNodeKey } = step;
      const node = graph.getNode(treeNodeKey.toString());
      if (node) targetNode.value = node;
    }
  });

  return {
    sim,
    currTrace,
  }
}