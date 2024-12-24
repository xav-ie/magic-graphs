import { getBalance, height, leftRotate, rightRotate, TreeNode, AVLTree, treeToArray } from "./avl";

export type InsertTrace = {
  action: "compare",
  nodeId: number,
} | {
  action: "insert",
  treeState: ReturnType<AVLTree['toArray']>,
} | {
  action: "balance",
  type: "left-left" | "right-right" | "left-right" | "right-left",
  treeState: ReturnType<AVLTree['toArray']>,
}

/**
* inserts a new key into the AVL tree
*
* @param node - The root of the current subtree
* @param key - The key to insert
* @returns The new root of the subtree after insertion
*/
// export function insert(
//   node: TreeNode | undefined,
//   key: number,
//   trace: InsertTrace[] = [],
// ): {
//   node: TreeNode,
//   trace: InsertTrace[],
// } {

// }