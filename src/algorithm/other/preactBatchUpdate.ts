/**
 * 关于 Preact 异步批量更新的核心代码学习
 * 看完以后发现实现真的简洁
 * 配合DevTool的performance火焰图理解更佳
 *
 * 核心思想：浏览器的 Event Loop
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
  // 结合下面`process`函数可知，_renderCount不为0时表示正在执行更新任务
  if (!process._renderCount++) {
    log('[run process]', item);
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


for (const s of [1,2]) {
  enqueue(s);
}

setTimeout(function addNewItem() {
  enqueue(3);
});

enqueue(4);
defer(function addItem2() {
  enqueue(5);
});
enqueue(6);
