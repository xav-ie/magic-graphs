import type { Graph } from "@graph/types";
import type { AVLTree } from "./avl";

export const graphToAVL = (graph: Graph, tree: AVLTree) => {
  tree.reset();
  if (graph.nodes.value.length === 0) return;

  const { getInboundEdges, getChildrenOfNode } = graph.helpers;
  const newRoot = graph.nodes.value.find(
    (node) => getInboundEdges(node.id).length === 0
  );

  if (!newRoot) {
    console.warn("could not parse tree from graph");
    return graph.reset();
  }

  const q = [newRoot];

  while (q.length > 0) {
    const node = q.shift();
    if (!node) continue;
    tree.insert(Number(node.label), false);
    q.push(...getChildrenOfNode(node.id));
  }
};
