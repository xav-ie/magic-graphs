import { computed, ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { AVLTree, getBalance, getHeight } from "./tree/avl";
import { useTreeSim } from "./treeSim";
import { useTreeHistory } from "./treeHistory";
import { TreeNode } from "./tree/treeNode";
import { graphToAVL } from "./tree/graphToAVL";

export const useTree = (graph: Graph) => {
  const tree = new AVLTree();

  const { simInProgress, runSim } = useTreeSim(graph, tree);
  const { undoStack, redoStack, undo, redo } = useTreeHistory(graph, tree);

  const saveToHistory = () => {
    const state = JSON.parse(JSON.stringify({ 
      nodes: graph.nodes.value, 
      edges: graph.edges.value 
    }));

    undoStack.value.push(state);
  }

  const insertNode = async (value: number) => {
    if (simInProgress.value) return;
    saveToHistory();
    const trace = tree.insert(value, false);
    await runSim(trace);
    recomputeMaps();
  };

  const balanceTree = async () => {
    if (simInProgress.value) return;
    saveToHistory();
    const trace = tree.balance();
    await runSim(trace);
    recomputeMaps();
    undoStack.value.push({ nodes: graph.nodes.value, edges: graph.edges.value });
  };

  const removeNode = async (value: number) => {
    if (simInProgress.value) return;
    saveToHistory();
    const trace = tree.remove(value);
    await runSim(trace);
    recomputeMaps();
    undoStack.value.push({ nodes: graph.nodes.value, edges: graph.edges.value });
  };

  const mapNodeIds = <T>(getter: (node: TreeNode) => T) => {
    const nodes = graph.nodes.value;
    return nodes.reduce<Map<GNode["id"], T>>((acc, node) => {
      const tNode = tree.getNode(Number(node.id));
      if (!tNode) return acc;
      acc.set(node.id, getter(tNode));
      return acc;
    }, new Map());
  };

  const nodeIdToBalanceFactor = ref(mapNodeIds(getBalance));
  const nodeIdToHeight = ref(mapNodeIds(getHeight));

  const recomputeMaps = () => {
    nodeIdToBalanceFactor.value = mapNodeIds(getBalance);
    nodeIdToHeight.value = mapNodeIds(getHeight);
  }

  const getRoot = () => {
    const { root } = tree;
    if (!root) return undefined;
    return graph.getNode(root.toString());
  };

  const isBalanced = computed(() => {
    const balanceFactors = Array.from(nodeIdToBalanceFactor.value.values());
    return balanceFactors.every((bf) => bf >= -1 && bf <= 1);
  })

  graph.subscribe("onGraphLoaded", () => {
    graphToAVL(graph, tree);
    recomputeMaps();
  });

  return {
    tree,

    insertNode,
    removeNode,
    balanceTree,

    nodeIdToBalanceFactor,
    isBalanced,
    nodeIdToHeight,

    getRoot,

    undo,
    redo,
  };
};

export type TreeControls = ReturnType<typeof useTree>;
