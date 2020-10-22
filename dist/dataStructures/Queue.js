export class Queue {
    constructor() {
        this.items = {};
        this.count = 0;
        this.headIndex = 0;
    }
    /**
     * 入队
     * @param item
     */
    enqueue(item) {
        this.items[this.count++] = item;
    }
    /**
     * 出队
     */
    dequeue() {
        if (this.isEmpty())
            return undefined;
        const res = this.items[this.headIndex];
        delete this.items[this.headIndex];
        this.headIndex++;
        return res;
    }
    isEmpty() {
        return this.headIndex === this.count;
    }
    peek() {
        return this.items[this.headIndex];
    }
    size() {
        return this.count - this.headIndex;
    }
    clear() {
        this.items = {};
        this.count = 0;
        this.headIndex = 0;
    }
    toString() {
        let res = [];
        for (let index = this.headIndex; index < this.count; index++) {
            res.push(this.items[index]);
        }
        return res.join(',');
    }
}
