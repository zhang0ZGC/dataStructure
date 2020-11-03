/**
 * 关于 Preact 异步批量更新的核心代码学习
 * 看完以后发现实现真的简洁
 * 配合DevTool的performance火焰图理解更佳
 *
 * 核心思想：浏览器的 Event Loop
 *
 +-----------------------------------+       +----------------------------------+
 |                                   |       |                                  |
 |           MacroTask               |       |            MacroTask             |
 |                                   +------->                                  |
 | +------+---------------+-------+  |       | +------------------------------+ |
 | |      |   MicroTasks  |       |  |       | |       |MicroTasks            | |
 | |      |       |       |       |  |       | |       |          |           | |
 | +------------------------------+  |       | +------------------------------+ |
 +-----------------------------------+       +----------------------------------+
 */

function log(...args: any[]) {
  console.log('#' + log.no++, ...args);
}
log.no = 1;

// 异步执行函数，如果Promise可用，则使用微任务队列，否则放到下一次宏任务执行队列中
const defer = typeof Promise === 'function' ? Promise.prototype.then.bind(Promise.resolve()) :
  setTimeout;

// 定义需要更新的渲染队列
let renderQueue: number[] = [];

// 队列入队
function enqueue(item: number) {
  log('[enqueue]', item);
  renderQueue.push(item);
  // 结合下面`process`函数可知，_renderCount不为0时表示已经有更新任务添加到任务队列等待执行，不需要重复加入微任务队列
  if (!process._renderCount++) {
    log('[start up process]', item);
    defer(process);
  }
}

// 定义一个模拟组件渲染的函数
function renderComponent(item: number) {
  log('[render]', item);

  // 模拟在更新过程中又入队，会在process的while一次循环结束后立即再次循环
  if (item === 2) {
    enqueue(1000);
  }
}

function process() {
  let queue: number[] = [];
  // 循环检查渲染队列中是否有任务，直到队列为空
  // 因为在执行队列任务的同时可能会有新的任务入队
  while ((process._renderCount = renderQueue.length)) {
    // 使用queue暂存renderQueue并清空renderQueue
    // 以防止执行任务时有新内容入队影响
    [queue, renderQueue] = [renderQueue, []];
    log('[process]', queue);

    queue.some(c => {
      renderComponent(c);
    })
  }
  log('-------------------');
}

process._renderCount = 0;


enqueue(1);
enqueue(2);

setTimeout(function addNewItem() {
  enqueue(3);
});

enqueue(4);
defer(function addItem2() {
  enqueue(5);
});
enqueue(6);

// #1 [enqueue] 1
// * 首次入队时将 process 函数放入微任务队列，但不会立即执行(当本次宏任务结束后才会执行微任务队列)
// #2 [start up process] 1
// #3 [enqueue] 2
// #4 [enqueue] 4
// #5 [enqueue] 6
// * 经过 #5 步骤，宏任务队列代码已经执行完毕，开始执行微任务队列
// #6 [process] (4) [1, 2, 4, 6]
// #7 [render] 1
// #8 [render] 2
// * 在执行过程中在 renderQueue 中添加了一个元素
// #9 [enqueue] 1000
// #10 [render] 4
// #11 [render] 6
// * 一次process循环结束，发现还有任务，继续循环
// #12 [process] [1000]
// #13 [render] 1000
// * 一次 process 微任务 到此结束
// #14 ------------------
// * 由于在defer函数中执行的入队，addItem2就是下一个微任务，会在上一个微任务执行完执行此微任务
// #15 [enqueue] 5
// #16 [run process] 5
// #17 [process] [5]
// #18 [render] 5
// * 此时微任务队列为空
// #19 -------------------
// < undefined
// * 检查宏任务队列，执行(由setTimeout添加的)宏任务
// #20 [enqueue] 3
// #21 [run process] 3
// #22 [process] [3]
// #23 [render] 3
// #24 -------------------