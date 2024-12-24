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
export function insert(
  node: TreeNode | undefined,
  key: number,
  trace: InsertTrace[] = [],
): {
  node: TreeNode,
  trace: InsertTrace[],
} {
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
    const { node: left, trace: leftTrace } = insert(node.left, key, [...trace, {
      action: "compare",
      nodeId: node.key,
    }]);
    node.left = left;
    traceCopy = leftTrace;
  } else if (key > node.key) {
    const { node: right, trace: rightTrace } = insert(node.right, key, [...trace, {
      action: "compare",
      nodeId: node.key,
    }]);
    node.right = right;
    traceCopy = rightTrace;
  }

  node.height = 1 + Math.max(height(node.left), height(node.right));

  // all the logic beyond this point is for AVL tree balancing

  // Get the balance factor and handle the 4 unbalanced cases
  const balance = getBalance(node);

  // Left Left Case
  if (balance > 1 && key < node.left!.key) {
    return {
      node: rightRotate(node),
      trace: [...traceCopy, {
        action: "balance",
        type: "left-left",
        treeState: treeToArray(node),
      }],
    };
  }

  // Right Right Case
  if (balance < -1 && key > node.right!.key) {
    return {
      node: leftRotate(node),
      trace: [...traceCopy, {
        action: "balance",
        type: "right-right",
        treeState: treeToArray(node),
      }],
    };
  }

  // Left Right Case
  if (balance > 1 && key > node.left!.key) {
    node.left = leftRotate(node.left!);
    return {
      node: rightRotate(node),
      trace: [...traceCopy, {
        action: "balance",
        type: "left-right",
        treeState: treeToArray(node),
      }],
    }
  }

  // Right Left Case
  if (balance < -1 && key < node.right!.key) {
    node.right = rightRotate(node.right!);
    return {
      node: leftRotate(node),
      trace:
      [...traceCopy, {
        action: "balance",
        type: "right-left",
        treeState: treeToArray(node),
      }],
    }
  }

  return {
    node,
    trace:
    [...traceCopy, {
      action: "insert",
      treeState: treeToArray(node),
    }],
  };
}