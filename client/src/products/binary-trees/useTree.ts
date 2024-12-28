import { computed, ref } from "vue";
import type { Graph } from "@graph/types";
import { AVLTree } from "./tree/avl";
import { useTreeSim } from "./treeSim";

export const useTree = (graph: Graph) => {
  const tree = new AVLTree()

  const { currTrace, sim } = useTreeSim(graph, tree)

  const insertNode = (value: number) => {
    sim.stop();
    currTrace.value = tree.insert(value);
    sim.start();
  }

  const removeNode = (value: number) => {
    sim.stop();
    currTrace.value = tree.remove(value);
    console.log(JSON.stringify(currTrace.value, null, 2))
    sim.start();
  }

  return {
    tree,

    insertNode,
    removeNode,
  }
}

export type TreeControls = ReturnType<typeof useTree>