export class Stack {
    constructor() {
        this.items = [];
        this.length = 0;
    }
    push(item) {
        this.items[this.length++] = item;
    }
    pop() {
        const res = this.items[this.length - 1];
        delete this.items[this.length - 1];
        return res;
    }
    top() {
        return this.items[this.length - 1];
    }
    size() {
        return this.length;
    }
    isEmpty() {
        return this.length === 0;
    }
}
