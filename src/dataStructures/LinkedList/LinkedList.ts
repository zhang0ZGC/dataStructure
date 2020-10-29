import LinkedNode from "./LinkedNode";

const DEFAULT_EQUALS_FN = (a: any, b: any) => a === b;

export default class LinkedList<T>{
  private count = 0;
  private head?: LinkedNode<T> = undefined;
  private equalsFn: Function;
  constructor(equalsFn?: Function){
    this.equalsFn = equalsFn || DEFAULT_EQUALS_FN;
  }

  /**
   * 向链表尾部添加元素
   * @param element 
   */
  push(element: T) {
    const node = new LinkedNode(element);
    let current: LinkedNode<T>;
    if (typeof this.head !== 'undefined') {
      current = this.head;
      while(typeof current.next !== 'undefined') {
        current = current.next;
      }
      current.next = node;
    } else {
      current = node;
    }
    this.count++;
  }

  /**
   * 在特定位置插入元素
   * @param element 
   * @param position 
   */
  insert(element: T, position: number) {

  }

  /**
   * 获取特定位置的元素
   * @param position 
   */
  getElementAt(position: number) {

  }

  /**
   * 移除特定元素
   * @param element 
   */
  remove(element: T) {

  }

  /**
   * 移除特定位置的元素
   * @param index 
   */
  removeAt(index: number) {
    if (index >=0 && index < this.count) {
      let current = this.head;
      if (index !== 0) {
        let previous: typeof current;
        for (let i=0; i<index; i++) {
          [previous, current] = [current, current!.next]
        }
        // 将上一个节点与下一个节点连接起来从而达到移除当前节点(current)的效果
        previous!.next = current!.next;
      } else {
        this.head = current!.next;
      }
      this.count--;
      return current!.value;
    }
    return undefined;
  }

  /**
   * 
   * @param element 返回元素的位置
   */
  indexOf(element: T) {
    
  }

  isEmpty(){
    return !this.count;
  }

  get size(){
    return this.count;
  }

  toString(){

  }

  [Symbol.iterator](){
    let current = this.head;
    return {
      next: () => {
        const res = {
          value: current?.value,
          done: !!current,
        }
        if (!res.done) {
          current = current!.next;
        }
        return res;
      },
    }
  }
}