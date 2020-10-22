
export class Stack<T> {
  private items: {[key: number]: T} = [];
  private length: number = 0;

  push(item: T) {
    this.items[this.length++] = item;
  }

  pop(): T {
    const res = this.items[this.length - 1];
    delete this.items[this.length - 1];
    this.length -= 1;
    return res;
  }

  top() {
    return this.items[this.length - 1];
  }

  size(): number {
    return this.length;
  }

  isEmpty() {
    return this.length === 0;
  }
}