import type { Graph } from "@graph/types";
import type { Coordinate } from "@shape/types";
import { getTreeIndexToPosition } from "@product/graph-sandbox/ui/tree/getTreeBinaryPos";
import { type InsertTrace } from "./insert";
import { getTreeIndexToNode } from "./treeIndexToNode";

/**
 * a binary search tree
 */
export class BinaryTree {
  root: TreeNode | undefined;

  constructor() {
    this.root = undefined;
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

/**
 * a binary search tree with AVL balancing capabilities
 */
export class AVLTree extends BinaryTree {
  constructor() {
    super();
  }

  insert(key: TreeNode['key']) {
    const preserveRoot = this.root;

    const runInsertion = (
      node: TreeNode | undefined,
      key: number,
      trace: InsertTrace[] = [],
    ): {
      node: TreeNode,
      trace: InsertTrace[],
    } => {
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
        const { node: left, trace: leftTrace } = runInsertion(node.left, key, [...trace, {
          action: "compare",
          nodeId: node.key,
        }]);
        node.left = left;
        traceCopy = leftTrace;
      } else if (key > node.key) {
        const { node: right, trace: rightTrace } = runInsertion(node.right, key, [...trace, {
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
            treeState: treeToArray(preserveRoot),
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
            treeState: treeToArray(preserveRoot),
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
            treeState: treeToArray(preserveRoot),
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
            treeState: treeToArray(preserveRoot),
          }],
        }
      }

      return {
        node,
        trace:
          [...traceCopy, {
            action: "insert",
            treeState: treeToArray(preserveRoot),
          }],
      };
    }

    const { node, trace } = runInsertion(this.root, key);

    const finalTreeState = treeToArray(node);

    const newTrace = operateTrace(trace, finalTreeState);

    this.root = node;

    return newTrace;
  }

  getNode(key: number) {
    let current = this.root;
    while (current) {
      if (key === current.key) return current;
      if (key < current.key) current = current.left;
      else current = current.right;
    }
    return undefined;
  }
}

/**
 * turns trace into consumable format by removing recursive artifacts
 */
const operateTrace = (trace: InsertTrace[], finalTreeState: ReturnType<AVLTree['toArray']>) => {
  if (trace.length === 0) return trace;
  const hasBalanced = trace.some(t => t.action === "balance");
  if (hasBalanced) {
    trace.pop();
    const obj = trace.at(-1);
    if (obj?.action === "balance") {
      obj.treeState = finalTreeState;
    }
  } else {
    const last = trace.pop();
    if (!last || last.action !== 'insert') throw new Error("last action in trace must be insert");
    last.treeState = finalTreeState;
    const removeExtraInserts = trace.filter(t => t.action !== "insert");
    trace = [...removeExtraInserts, last];
  }

  return trace;
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

export const treeToArray = (root: TreeNode | undefined) => {
  const treeDepth = height(root) - 1;
  const treeIndexToNodeKey = getTreeIndexToNode({ root, treeDepth });
  return treeIndexToNodeKey.map(node => node?.key)
};

/**
* Gets the height of a node in the AVL tree
* @param node - The node to get the height from
* @returns The height of the node, or 0 if the node is null
*/
export function height(node: TreeNode | undefined): number {
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
export function rightRotate(y: TreeNode): TreeNode {
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
export function leftRotate(x: TreeNode): TreeNode {
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
export function getBalance(node: TreeNode | undefined): number {
  if (node === undefined) return 0;
  return height(node.left) - height(node.right);
}

export const treeArrayToGraph = async (
  graph: Graph,
  treeArray: ReturnType<AVLTree['toArray']>,
  treeRoot: TreeNode,
  rootPosition: Coordinate,
) => {
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

  addTreeNodeToGraph(treeRoot);
  const rootHeight = height(treeRoot);

  const depthToXOffset: Record<number, number> = {
    1: 250,
    2: 200,
    3: 150,
  }

  const positions = getTreeIndexToPosition({
    rootCoordinate: rootPosition,
    xOffset: depthToXOffset[rootHeight] ?? 100,
    yOffset: 200,
    treeDepth: rootHeight - 1,
  })

  for (let i = 0; i < treeArray.length; i++) {
    const nodeId = treeArray[i]?.toString();
    if (!nodeId) continue;
    graph.animate.node({
      nodeId,
      endCoords: positions[i],
    })
  }
};