import { height, TreeNode } from "./avl";

/**
* inserts a new key into the AVL tree
*
* @param node - The root of the current subtree
* @param key - The key to insert
* @returns The new root of the subtree after insertion
*/
export function insert(
  node: TreeNode | undefined,
  key: number,
  trace: number[] = [],
) {
  // Perform standard BST insertion
  if (node === undefined) {
    return {
      node: new TreeNode(key),
      trace,
    };
  }

  // Equal keys are not allowed in BST
  if (key === node.key) {
    return {
      node,
      trace,
    }
  }

  let traceCopy = [...trace];
  if (key < node.key) {
    const { node: left, trace: leftTrace } = insert(node.left, key, [...trace, node.key]);
    node.left = left;
    traceCopy = leftTrace;
  } else if (key > node.key) {
    const { node: right, trace: rightTrace } = insert(node.right, key, [...trace, node.key]);
    node.right = right;
    traceCopy = rightTrace;
  }

  node.height = 1 + Math.max(height(node.left), height(node.right));

  // all the logic beyond this point is for AVL tree balancing

  // Get the balance factor and handle the 4 unbalanced cases
  // const balance = getBalance(node);

  // // Left Left Case
  // if (balance > 1 && key < node.left!.key) {
  //   return rightRotate(node);
  // }

  // // Right Right Case
  // if (balance < -1 && key > node.right!.key) {
  //   return leftRotate(node);
  // }

  // // Left Right Case
  // if (balance > 1 && key > node.left!.key) {
  //   node.left = leftRotate(node.left!);
  //   return rightRotate(node);
  // }

  // // Right Left Case
  // if (balance < -1 && key < node.right!.key) {
  //   node.right = rightRotate(node.right!);
  //   return leftRotate(node);
  // }

  return {
    node,
    trace: traceCopy,
  };
}