import { Queue } from "./dataStructures/Queue";


const queue = new Queue<number>();

queue.enqueue(12);
console.log(queue.isEmpty());
console.log(queue.peek());
console.log(queue.size);
console.log(queue.dequeue());
console.log(queue.size);
console.log(queue.isEmpty());
