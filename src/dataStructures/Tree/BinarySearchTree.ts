import {defaultCompare, Compare, ICompareFunction} from "../../utils";


export class Node<T=any> {
  constructor(public key: T, public left: Node | null=null, public right: Node | null=null) {
  }
}

export default class BinarySearchTree<T> {
  private root: Node<T> | null = null;

  constructor(private compareFn: ICompareFunction<T>=defaultCompare) {
  }


  insert(key: T) {
    if (this.root !== null) {
      this.insertNode(this.root, key);
    } else {
      this.root = new Node(key, null, null);
    }
  }

  search(key: T) {

  }

  /**
   * 通过中序遍历方式遍历所有节点
   */
  inOrderTraverse(callback: Function) {
    this.inOrderTraverseNode(this.root, callback);
  }

  /**
   * 通过先序遍历方式遍历所有节点
   */
  preOrderTraverse() {

  }

  /**
   * 通过后续遍历方式遍历所有节点
   */
  postOrderTraverse() {

  }

  min() {

  }

  max() {

  }

  remove(key: T) {

  }

  private insertNode(node: Node<T>, key: T) {
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      if (node.left === null) {
        node.left = new Node(key);
      } else {
        this.insertNode(node.left, key);
      }
    } else {
      if (node.right === null) {
        node.right = new Node(key);
      } else {
        this.insertNode(node.right, key);
      }
    }
  }

  private inOrderTraverseNode(node: Node<T> | null, callback: Function) {
    if (node !== null) {
      this.inOrderTraverseNode(node.left, callback);
      callback(node.key);
      this.inOrderTraverseNode(node.right, callback);
    }
  }
}
