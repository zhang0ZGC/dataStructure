import {defaultCompare, Compare, ICompareFunction} from "../../utils";


export class Node<T=any> {
  constructor(public key: T, public left: Node | null=null, public right: Node | null=null) {
  }
}

type TreeNode<T> = Node<T> | null;

export default class BinarySearchTree<T> {
  protected root: TreeNode<T> = null;

  constructor(protected compareFn: ICompareFunction<T>=defaultCompare) {
  }


  insert(key: T) {
    if (this.root !== null) {
      this.insertNode(this.root, key);
    } else {
      this.root = new Node(key, null, null);
    }
  }

  search(key: T): boolean {
    return this.searchNode(this.root, key);
  }

  min() {
    return this.minNode(this.root);
  }

  max() {
    return this.maxNode(this.root);
  }

  remove(key: T) {
    this.root = this.removeNode(this.root, key);
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
  preOrderTraverse(callback: Function) {
    this.preOrderTraverseNode(this.root, callback);
  }

  /**
   * 通过后续遍历方式遍历所有节点
   */
  postOrderTraverse(callback: Function) {
    this.postOrderTraverseNode(this.root, callback);
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

  private inOrderTraverseNode(node: TreeNode<T>, callback: Function) {
    if (node !== null) {
      this.inOrderTraverseNode(node.left, callback);
      callback(node.key);
      this.inOrderTraverseNode(node.right, callback);
    }
  }

  private preOrderTraverseNode(node: TreeNode<T>, callback: Function) {
    if (node !== null) {
      callback(node.key);
      this.preOrderTraverseNode(node.left, callback);
      this.preOrderTraverseNode(node.right, callback);
    }
  }

  private postOrderTraverseNode(node: TreeNode<T>, callback: Function) {
    if (node !== null) {
      this.postOrderTraverseNode(node.left, callback);
      this.postOrderTraverseNode(node.right, callback);
      callback(node.key);
    }
  }

  private searchNode(node: TreeNode<T>, key: T): boolean {
    if (node === null) return false;
    const compareRes = this.compareFn(key, node.key);
    if (compareRes === Compare.LESS_THAN) {
      return this.searchNode(node.left, key);
    } else if (compareRes === Compare.BIGGER_THAN) {
      return this.searchNode(node.right, key);
    } else {
      return true;
    }
  }

  private maxNode(node: TreeNode<T>) {
    let current = node;
    while (current !== null && current.right !== null) {
      current = current.right;
    }
    return current;
  }

  private minNode(node: TreeNode<T>) {
    let current = node;
    while (current !== null && current.left !== null) {
      current = current.left;
    }
    return current;
  }

  private removeNode(node: TreeNode<T>, key: T): TreeNode<T> {
    if (node === null) return null;

    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      node.left = this.removeNode(node.left, key);
      return node;
    } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      node.right = this.removeNode(node.right, key);
      return node;
    } else {
      if (node.left === null && node.right === null ) {
        node = null;
        return node;
      }
      if (node.left === null) {
        node = node.right;
        return node;
      } else if(node.right === null) {
        node = node.left;
        return node;
      }

      const minNode = this.minNode(node.right) as Node<T>;
      node.key = minNode.key;
      node.right = this.removeNode(node.right, minNode.key);
      return node;
    }
  }
}
