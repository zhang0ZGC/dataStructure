/**
 * @link https://malcolmyu.github.io/malnote/2015/06/12/Promises-A-Plus
 **/

type PromiseExecutor<T> = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;
type PromiseStatus = 'pending' | 'fulfilled' | 'rejected';

interface IMyPromise<T> {
  then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): MyPromise<TResult1 | TResult2>;
}

/**
 * Promise决议程序
 * @param {MyPromise} promise2
 * @param x
 * @param resolve
 * @param reject
 */
function resolutionProducer(promise2: MyPromise, x: any, resolve: Function, reject: Function) {
  if (promise2 === x) {
    reject(new TypeError('Error'))
  // } else if(x instanceof MyPromise) {
  //   x.then((xValue: any) => {
  //     resolutionProducer(promise2, xValue, resolve, reject);
  //   }, (reason: any) => reject(reason));
  } else if (x !== null && typeof x === 'object' || typeof x === 'function') {
    try {
      const then = x.then;

      if (typeof then === 'function') {
        let hasCalled = false;
        try {
          then.call(x,
            (y: any) => {
              if (!hasCalled) {
                hasCalled = true;
                resolutionProducer(promise2, y, resolve, reject);
              }
            },
            (reason: any) => {
              if (!hasCalled) {
                hasCalled = true;
                reject(reason);
              }
            },
          );
        } catch (e) {
          reject(e);
        }
      } else {
        resolve(x);
      }
    } catch (e) {
      reject(e);
    }
  } else {
    resolve(x);
  }
}

// 还是用原Promise来作为异步任务队列哈哈哈哈哈。。。
// const defer = typeof Promise === 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;
const defer = setTimeout;

class MyPromise<T=any> implements IMyPromise<T>{
  protected value?: T | PromiseLike<T>;
  protected reason?: unknown;
  protected status: PromiseStatus = 'pending';
  protected onFulfilledQueue: Function[] = [];
  protected onRejectedQueue: Function[] = [];

  constructor(executor: PromiseExecutor<T>) {
    const self = this;

    function resolve(value?: T | PromiseLike<T>) {
      if (self.status === 'pending') {
        self.status = 'fulfilled';
        self.value = value;
        self.onFulfilledQueue.forEach(func => func(value));
      }
    }

    function reject(e: unknown) {
      if (self.status === 'pending') {
        self.status = 'rejected';
        self.reason = e;
        self.onRejectedQueue.forEach(func => func(e));
      }
    }

    try{
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ){
    if (typeof onFulfilled !== 'function') onFulfilled = function onResolved(v: any){return v};
    if (typeof onRejected !== 'function') onRejected = function onRejected(e: any){throw e};

    const self = this;

    function resolveByStatus(resolve: Function, reject: Function) {
      defer(function resolveDeferFunc(){
        try {
          const x = onFulfilled!(self.value as T);
          resolutionProducer(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      })
    }

    function rejectByStatus(resolve: Function, reject: Function) {
      defer(function rejectDeferFunc(){
        try {
          const x = onRejected!(self.value);
          resolutionProducer(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      })
    }

    const promise2 = new MyPromise<TResult1 | TResult2>(function executor(resolve, reject) {
      switch (self.status) {
        case "pending":
          self.onFulfilledQueue.push(function fulfilledCb() {
            resolveByStatus(resolve, reject);
          });
          self.onRejectedQueue.push(function rejectedCb() {
            rejectByStatus(resolve, reject);
          })
          break;
        case "fulfilled":
          resolveByStatus(resolve, reject);
          break;
        case "rejected":
          rejectByStatus(resolve, reject);
          break;
        default:
          break;
      }
    });

    return promise2;
  }
}

export default MyPromise;