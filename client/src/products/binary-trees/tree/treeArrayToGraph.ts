import type { Coordinate } from "@shape/types";
import type { AVLTree, TreeNodeKeyArray } from "./avl";
import type { TreeNode } from "./treeNode";
import type { GEdge, Graph } from "@graph/types";
import { getTreeIndexToPosition } from "@product/graph-sandbox/ui/tree/getTreeBinaryPos";
import type { TreeArray } from "./treeArray";

const newEdge = (from: number, to: number) => ({
  from: from.toString(),
  to: to.toString(),
  id: `${from}-${to}`,
  label: '',
});

const edgesInTree = (
  graph: Graph,
  treeRoot: TreeNode | undefined,
) => {
  const edges: GEdge[] = [];

  const getEdges = (treeNode: TreeNode | undefined) => {
    if (!treeNode) return;

    if (treeNode.left) {
      const edge = graph.getEdge(`${treeNode.key}-${treeNode.left.key}`);
      edges.push(edge ?? newEdge(treeNode.key, treeNode.left.key));
      getEdges(treeNode.left);
    }

    if (treeNode.right) {
      const edge = graph.getEdge(`${treeNode.key}-${treeNode.right.key}`);
      edges.push(edge ?? newEdge(treeNode.key, treeNode.right.key));
      getEdges(treeNode.right);
    }
  };

  getEdges(treeRoot);
  return edges;
};

export const treeArrayToGraph = async (
  graph: Graph,
  treeArray: TreeNodeKeyArray,
  treeRoot: TreeNode,
  rootPosition: Coordinate,
) => {
  const newTreeEdges = edgesInTree(graph, treeRoot);
  const edgesNotInNewTree = graph.edges.value
    .filter(edge => !newTreeEdges.some(newEdge => newEdge.id === edge.id));

  const rootHeight = treeRoot.height;

  const depthToXOffset: Record<number, number> = {
    2: 150,
    3: 150,
    4: 150,
  }

  console.log(rootHeight, depthToXOffset[rootHeight]);
  const positions = getTreeIndexToPosition({
    rootCoordinate: rootPosition,
    xOffset: depthToXOffset[rootHeight] ?? 100,
    yOffset: 200,
    treeDepth: rootHeight,
  })

  for (const nodeIndex in treeArray) {
    const node = treeArray[nodeIndex];
    if (!node) continue;
    await graph.addNode({
      id: node.toString(),
      label: node.toString(),
      ...positions[nodeIndex],
    }, { animate: true, focus: false });
  }

  await Promise.all(edgesNotInNewTree.map(edge => graph.removeEdge(edge.id, { animate: true })));

  await new Promise(resolve => setTimeout(resolve, 500));

  await Promise.all(treeArray.map((treeNodeKey, i) => {
    if (!treeNodeKey) return;
    const node = graph.getNode(treeNodeKey.toString());
    if (!node) return;
    if (node.x === positions[i].x && node.y === positions[i].y) return;
    graph.animate.node({
      nodeId: node.id,
      endCoords: positions[i],
      durationMs: 750,
    })
  }));

  for (const edge of newTreeEdges) {
    await graph.addEdge(edge, { animate: true });
  }
};