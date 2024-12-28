import { computed, ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { AVLTree } from "./tree/avl";
import { useTreeSim } from "./treeSim";
import type { TreeNode } from "./tree/treeNode";

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

  const mapNodeIds = <T>(getter: (node: TreeNode) => T) => {
    const nodes = graph.nodes.value;
    return nodes.reduce<Map<GNode['id'], T>>((acc, node) => {
      const tNode = tree.getNode(Number(node.id))
      if (!tNode) return acc
      acc.set(node.id, getter(tNode))
      return acc
    }, new Map())
  }

  const nodeIdToBalanceFactor = computed(() => mapNodeIds(tree.getBalance))
  const nodeIdToHeight = computed(() => mapNodeIds(tree.getHeight))

  const getRoot = () => {
    const { root } = tree
    if (!root) return undefined
    return graph.getNode(root.toString())
  }

  return {
    tree,

    insertNode,
    removeNode,

    nodeIdToBalanceFactor,
    nodeIdToHeight,

    getRoot,
  }
}

export type TreeControls = ReturnType<typeof useTree>