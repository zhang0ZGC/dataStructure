
/**
 * 单队列
 */
export default class Queue<T> {
  private items: {[key: number]: T} = {};
  private count: number = 0;
  private headIndex: number = 0;

  /**
   * 入队
   * @param item
   */
  enqueue(item: T){
    this.items[this.count++] = item;
    return this;
  }

  /**
   * 出队
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const res = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex++;
    return res;
  }

  isEmpty(): boolean {
    return this.headIndex === this.count;
  }

  peek(): T {
    return this.items[this.headIndex];
  }

  get size(): number {
    return this.count - this.headIndex;
  }

  clear() {
    this.items = {};
    this.count = 0;
    this.headIndex = 0;
  }

  toString(){
    let res:T[] = [];
    for (let index=this.headIndex; index<this.count; index++) {
      res.push(this.items[index]);
    }
    return res.join(',');
  }
  /**
   * 迭代器方法
   */
  [Symbol.iterator]() {
    let index = this.headIndex - 1;
    return {
      next: () => {
        index++;
        return {value: this.items[index], done: index===this.count};
      }
    }
  }
}

