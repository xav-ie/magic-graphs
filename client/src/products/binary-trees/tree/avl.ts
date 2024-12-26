import { getTreeArray } from "./treeArray";
import { TreeNode } from "./treeNode";

export type TreeNodeKeyArray = (TreeNode['key'] | undefined)[];

export type InsertTrace = {
  action: "compare";
  treeNodeKey: number;
  treeState: TreeNodeKeyArray;
} | {
  action: "insert";
  treeState: TreeNodeKeyArray;
} | {
  action: "balance";
  type: "left-left" | "right-right" | "left-right" | "right-left";
  treeState: TreeNodeKeyArray;
};

export class AVLTree {
  root: TreeNode | undefined;

  constructor() {
    this.root = undefined;
  }

  private getHeight(node: TreeNode | undefined): number {
    return node ? node.height : 0;
  }

  private getBalance(node: TreeNode): number {
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  private updateHeight(node: TreeNode): void {
    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  toArray() {
    return getTreeArray({
      root: this.root,
      treeDepth: this.getHeight(this.root)
    }).map(node => node?.key);
  }

  private rotateRight(y: TreeNode): TreeNode {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  private rotateLeft(x: TreeNode): TreeNode {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  insert(key: number): InsertTrace[] {
    if (!this.root) {
      this.root = new TreeNode(key);
      return [{
        action: "insert",
        treeState: this.toArray()
      }];
    }

    const trace: InsertTrace[] = [];
    let justInserted = false;

    const insertHelper = (parent: TreeNode | undefined, node: TreeNode | undefined, key: number, isLeft: boolean): TreeNode => {
      if (!node) {
        const newNode = new TreeNode(key);
        justInserted = true;
        return newNode;
      }

      trace.push({
        action: "compare",
        treeNodeKey: node.key,
        treeState: this.toArray()
      });

      if (key < node.key) {
        node.left = insertHelper(node, node.left, key, true);
        if (justInserted) {
          trace.push({
            action: "insert",
            treeState: this.toArray()
          });
          justInserted = false;
        }
      } else if (key > node.key) {
        node.right = insertHelper(node, node.right, key, false);
        if (justInserted) {
          trace.push({
            action: "insert",
            treeState: this.toArray()
          });
          justInserted = false;
        }
      } else {
        return node;
      }

      this.updateHeight(node);
      const balance = this.getBalance(node);

      // Left Left Case
      if (balance > 1 && key < node.left!.key) {
        const result = this.rotateRight(node);
        if (parent) {
          if (isLeft) parent.left = result;
          else parent.right = result;
        } else {
          this.root = result;
        }
        trace.push({
          action: "balance",
          type: "left-left",
          treeState: this.toArray()
        });
        if (parent) {
          if (isLeft) parent.left = node;
          else parent.right = node;
        } else {
          this.root = node;
        }
        return result;
      }

      // Right Right Case
      if (balance < -1 && key > node.right!.key) {
        const result = this.rotateLeft(node);
        if (parent) {
          if (isLeft) parent.left = result;
          else parent.right = result;
        } else {
          this.root = result;
        }
        trace.push({
          action: "balance",
          type: "right-right",
          treeState: this.toArray()
        });
        if (parent) {
          if (isLeft) parent.left = node;
          else parent.right = node;
        } else {
          this.root = node;
        }
        return result;
      }

      // Left Right Case
      if (balance > 1 && key > node.left!.key) {
        node.left = this.rotateLeft(node.left!);
        const result = this.rotateRight(node);
        if (parent) {
          if (isLeft) parent.left = result;
          else parent.right = result;
        } else {
          this.root = result;
        }
        trace.push({
          action: "balance",
          type: "left-right",
          treeState: this.toArray()
        });
        if (parent) {
          if (isLeft) parent.left = node;
          else parent.right = node;
        } else {
          this.root = node;
        }
        return result;
      }

      // Right Left Case
      if (balance < -1 && key < node.right!.key) {
        node.right = this.rotateRight(node.right!);
        const result = this.rotateLeft(node);
        if (parent) {
          if (isLeft) parent.left = result;
          else parent.right = result;
        } else {
          this.root = result;
        }
        trace.push({
          action: "balance",
          type: "right-left",
          treeState: this.toArray()
        });
        if (parent) {
          if (isLeft) parent.left = node;
          else parent.right = node;
        } else {
          this.root = node;
        }
        return result;
      }

      return node;
    };

    this.root = insertHelper(undefined, this.root, key, false);
    return trace;
  }
}