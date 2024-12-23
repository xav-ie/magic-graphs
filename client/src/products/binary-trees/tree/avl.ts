import type { Graph } from "@graph/types";
import type { Coordinate } from "@shape/types";
import { getTreeIndexToPosition } from "@product/graph-sandbox/ui/tree/getTreeBinaryPos";

/**
 * a binary search tree
 */
export class BinaryTree {
  root: TreeNode | undefined;

  constructor() {
    this.root = undefined;
  }

  insert(key: TreeNode['key']) {
    this.root = insert(this.root, key);
  }

  height() {
    return height(this.root);
  }

  getBalance(node: TreeNode | undefined) {
    return getBalance(node);
  }

  toArray() {
    const treeDepth = this.height() - 1;
    const treeIndexToNodeKey = getTreeIndexToNode({ root: this.root, treeDepth });
    return treeIndexToNodeKey.map(node => node?.key);
  }

  async toGraph(graph: Graph, rootPosition: Coordinate) {
    graph.reset();

    const addTreeNodeToGraph = (treeNode: TreeNode | undefined) => {
      if (!treeNode) return;

      graph.addNode({
        id: treeNode.key.toString(),
        label: treeNode.key.toString(),
        ...rootPosition,
      }, { animate: true, focus: false });

      if (treeNode.left) {
        // edge must be added after both parent and child nodes are added
        setTimeout(() => {
          graph.addEdge({
            from: treeNode.key.toString(),
            to: treeNode.left!.key.toString(),
          }, { animate: true })
        }, 150)
        addTreeNodeToGraph(treeNode.left);
      }

      if (treeNode.right) {
        setTimeout(() => {
          graph.addEdge({
            from: treeNode.key.toString(),
            to: treeNode.right!.key.toString(),
          }, { animate: true })
        }, 150)
        addTreeNodeToGraph(treeNode.right);
      }
    }

    addTreeNodeToGraph(this.root);

    const depthToXOffset: Record<number, number> = {
      1: 250,
      2: 200,
      3: 150,
    }

    const positions = getTreeIndexToPosition({
      rootCoordinate: rootPosition,
      xOffset: depthToXOffset[this.height()] ?? 100,
      yOffset: 200,
      treeDepth: this.height() - 1,
    })

    const arr = this.toArray();

    for (let i = 0; i < arr.length; i++) {
      const nodeId = arr[i]?.toString();
      if (!nodeId) continue;
      graph.animate.node({
        nodeId,
        endCoords: positions[i],
      })
    }
  }
}

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

/**
 * a binary search tree with AVL balancing capabilities
 */
export class AVLTree extends BinaryTree {
  constructor() {
    super();
  }

  insert(key: TreeNode['key']) {
    this.root = insert(this.root, key);
  }
}

/**
 * Represents a node in a binary/avl tree
 */
export class TreeNode {
  key: number;
  left: TreeNode | undefined;
  right: TreeNode | undefined;
  height: number;

  constructor(key: number) {
    this.key = key;
    this.left = undefined;
    this.right = undefined;
    this.height = 1;
  }
}

/**
* Gets the height of a node in the AVL tree
* @param node - The node to get the height from
* @returns The height of the node, or 0 if the node is null
*/
function height(node: TreeNode | undefined): number {
  if (node === undefined) {
    return 0;
  }
  return node.height;
}

/**
* Performs a right rotation on the given node
* @param y - The root of the subtree to rotate
* @returns The new root after rotation
*/
function rightRotate(y: TreeNode): TreeNode {
  const x = y.left!;  // We know this exists because right rotation is only called when left child exists
  const T2 = x.right;

  x.right = y;
  y.left = T2;

  y.height = 1 + Math.max(height(y.left), height(y.right));
  x.height = 1 + Math.max(height(x.left), height(x.right));

  return x;
}

/**
* Performs a left rotation on the given node
* @param x - The root of the subtree to rotate
* @returns The new root after rotation
*/
function leftRotate(x: TreeNode): TreeNode {
  const y = x.right!;  // We know this exists because left rotation is only called when right child exists
  const T2 = y.left;

  y.left = x;
  x.right = T2;

  x.height = 1 + Math.max(height(x.left), height(x.right));
  y.height = 1 + Math.max(height(y.left), height(y.right));

  return y;
}

/**
* Calculates the balance factor of a node
* @param node - The node to calculate the balance factor for
* @returns The balance factor (difference between left and right subtree heights)
*/
function getBalance(node: TreeNode | undefined): number {
  if (node === undefined) return 0;
  return height(node.left) - height(node.right);
}

/**
* Inserts a new key into the AVL tree
* @param node - The root of the current subtree
* @param key - The key to insert
* @returns The new root of the subtree after insertion
*/
function insert(node: TreeNode | undefined, key: number): TreeNode {
  // Perform standard BST insertion
  if (node === undefined) {
    return new TreeNode(key);
  }

  // Equal keys are not allowed in BST
  if (key === node.key) {
    return node;
  }

  if (key < node.key) {
    node.left = insert(node.left, key);
  } else if (key > node.key) {
    node.right = insert(node.right, key);
  }

  node.height = 1 + Math.max(height(node.left), height(node.right));

  // all the logic beyond this point is for AVL tree balancing

  // Get the balance factor and handle the 4 unbalanced cases
  const balance = getBalance(node);

  // Left Left Case
  if (balance > 1 && key < node.left!.key) {
    return rightRotate(node);
  }

  // Right Right Case
  if (balance < -1 && key > node.right!.key) {
    return leftRotate(node);
  }

  // Left Right Case
  if (balance > 1 && key > node.left!.key) {
    node.left = leftRotate(node.left!);
    return rightRotate(node);
  }

  // Right Left Case
  if (balance < -1 && key < node.right!.key) {
    node.right = rightRotate(node.right!);
    return leftRotate(node);
  }

  return node;
}