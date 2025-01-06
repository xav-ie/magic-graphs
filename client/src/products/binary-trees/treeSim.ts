import { computed, ref } from "vue";
import type { Graph } from "@graph/types";
import { useTargetNodeColor } from "./theme/useTargetNodeColor";
import { treeArrayToGraph } from "./tree/treeArrayToGraph";
import type { AVLTree, TreeTrace } from "./tree/avl";
import state from "./state";

const ROOT_POS = { x: 2300, y: 1500 };

const { activeSim } = state;

type SetTreeSimOptions = {
  graph: Graph;
  tree: AVLTree;
  trace: TreeTrace[];
};

export const setTreeSim = ({
  graph,
  tree,
  trace
}: SetTreeSimOptions) => {
  const { targetNode, activate } = useTargetNodeColor(graph);
  activate();

  const step = ref(0);

  const runStep = async () => {
    const traceAtStep = trace[step.value];
    if (traceAtStep === undefined) return;

    targetNode.value = undefined;

    if (traceAtStep.action === "compare") {
      const { treeNodeKey } = traceAtStep;
      const node = graph.getNode(treeNodeKey.toString());
      if (!node) throw new Error("could not find node in graph (avl compare)");
      targetNode.value = node;
    } else {
      await treeArrayToGraph(graph, traceAtStep.treeState, tree.root!, ROOT_POS);
    }
  }

  const next = async () => {
    ++step.value;
    await runStep();
  }

  const prev = async () => {
    --step.value;
    await runStep();
  }

  const exit = async () => {
    step.value = trace.length - 1;
    await runStep();
    activeSim.value = undefined;
  }

  activeSim.value = {
    step: computed(() => step.value),
    next,
    prev,
    exit,
    trace: computed(() => trace),
  }
};