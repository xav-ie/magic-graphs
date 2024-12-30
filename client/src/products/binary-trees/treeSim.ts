import { ref } from "vue";
import type { Graph } from "@graph/types";
import { useTargetNodeColor } from "./theme/useTargetNodeColor";
import { treeArrayToGraph } from "./tree/treeArrayToGraph";
import type { AVLTree, TreeTrace } from "./tree/avl";

const ROOT_POS = { x: 2300, y: 1500 };

export const useTreeSim = (graph: Graph, tree: AVLTree) => {
  const { targetNode, activate } = useTargetNodeColor(graph);
  activate();

  const simInProgress = ref(false);

  const runSim = async (trace: TreeTrace[]) => {
    const runStep = async (stepIndex: number) => {
      if (stepIndex >= trace.length) return;

      const step = trace[stepIndex];
      targetNode.value = undefined;

      if (step.action === "compare") {
        const { treeNodeKey } = step;
        const node = graph.getNode(treeNodeKey.toString());
        if (!node) throw new Error("could not find node in graph (avl compare)");
        targetNode.value = node;
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        await treeArrayToGraph(graph, step.treeState, tree.root!, ROOT_POS);
      }

      await runStep(stepIndex + 1);
    }
    
    simInProgress.value = true;
    await runStep(0);
    simInProgress.value = false;
  }

  return {
    runSim,
    simInProgress,
  }
}