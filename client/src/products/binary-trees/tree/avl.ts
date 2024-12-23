
/**
 * a binary search tree
 */
export class BinaryTree {
  root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  insert(key: TreeNode['key']) {
    this.root = insert(this.root, key);
  }

  height() {
    return height(this.root);
  }

  getBalance(node: TreeNode | null) {
    return getBalance(node);
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
    this.root = insert(this.root, key);
    this.root = balance(this.root);
  }
}

/**
 * Represents a node in a binary/avl tree
 */
export class TreeNode {
  key: number;
  left: TreeNode | null;
  right: TreeNode | null;
  height: number;

  constructor(key: number) {
    this.key = key;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

/**
* Gets the height of a node in the AVL tree
* @param node - The node to get the height from
* @returns The height of the node, or 0 if the node is null
*/
function height(node: TreeNode | null): number {
  if (node === null) {
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
function getBalance(node: TreeNode | null): number {
  if (node === null) return 0;
  return height(node.left) - height(node.right);
}

/**
* Inserts a new key into the AVL tree
* @param node - The root of the current subtree
* @param key - The key to insert
* @returns The new root of the subtree after insertion
*/
function insert(node: TreeNode | null, key: number): TreeNode {
  // Perform standard BST insertion
  if (node === null) {
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

  return node;

  // // all the logic beyond this point is for AVL tree balancing

  // // Update height of current node
  // node.height = 1 + Math.max(height(node.left), height(node.right));

  // // Get the balance factor and handle the 4 unbalanced cases
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

  // return node;
}

/**
 * rebalances an AVL subtree rooted at the given node
 */
const balance = (node: TreeNode) => {
  const balance = getBalance(node);
  const { key } = node;

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
