import BinarySearchTree, { Node } from "./BinarySearchTree";
import {defaultCompare} from "../../utils";

type TreeNode<T> = Node<T> | null;

export class AVLTree<T=any> extends BinarySearchTree<T> {
  constructor(compareFn=defaultCompare) {
    super(compareFn);
    this.root = null;
  }

  getNodeHeight(node: TreeNode<T>): number {
    if (node === null) return -1;

    return Math.max(
      this.getNodeHeight(node.left),
      this.getNodeHeight(node.right)
    ) + 1;
  }
}
