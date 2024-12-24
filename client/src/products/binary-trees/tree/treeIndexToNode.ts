import type { TreeNode } from "./avl";

export const getTreeIndexToNode = ({
  root,
  treeDepth,
}: {
  root: TreeNode | undefined,
  treeDepth: number,
}) => {
  const treeIndexToNodeId: (TreeNode | undefined)[] = [];
  if (!root) return treeIndexToNodeId;

  let nodesAtDepth: (TreeNode | undefined)[] = [root];

  for (let i = 0; i <= treeDepth; i++) {
    const nodesAtNextDepth: (TreeNode | undefined)[] = [];

    for (const maybeTreeNode of nodesAtDepth) {
      treeIndexToNodeId.push(maybeTreeNode);
      nodesAtNextDepth.push(maybeTreeNode?.left);
      nodesAtNextDepth.push(maybeTreeNode?.right);
    }

    nodesAtDepth = [...nodesAtNextDepth];
  }

  return treeIndexToNodeId;
}