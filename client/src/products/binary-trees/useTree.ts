import { computed } from "vue";
import type { GNode, Graph } from "@graph/types";
import { AVLTree, getBalance, getHeight } from "./tree/avl";
import { useTreeSim } from "./treeSim";
import type { TreeNode } from "./tree/treeNode";

export const useTree = (graph: Graph) => {
  const tree = new AVLTree()

  const { currTrace, sim } = useTreeSim(graph, tree)

  const insertNode = (value: number) => {
    sim.stop();
    currTrace.value = tree.insert(value, false);
    sim.start();
  }

  const balanceTree = () => {
    sim.stop();
    currTrace.value = tree.balance();
    sim.playbackSpeed.value = 2000;
    if (currTrace.value.length === 0) return
    sim.start();
  }

  const removeNode = (value: number) => {
    sim.stop();
    currTrace.value = tree.remove(value);
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

  const nodeIdToBalanceFactor = computed(() => mapNodeIds(getBalance))
  const nodeIdToHeight = computed(() => mapNodeIds(getHeight))

  const getRoot = () => {
    const { root } = tree
    if (!root) return undefined
    return graph.getNode(root.toString())
  }

  return {
    tree,

    insertNode,
    removeNode,
    balanceTree,

    nodeIdToBalanceFactor,
    nodeIdToHeight,

    getRoot,
  }
}

export type TreeControls = ReturnType<typeof useTree>