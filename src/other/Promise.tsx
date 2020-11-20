/**
 * @link https://malcolmyu.github.io/malnote/2015/06/12/Promises-A-Plu
 **/

interface IPromise<T=any> {
  then(onResolved?: Function, onRejected?: Function): IPromise<T>;
}

/**
 * Promise决议程序
 * @param promise
 * @param x
 * @param resolve
 * @param reject
 */
function resolutionProducer(promise: IPromise, x: any, resolve: Function, reject: Function) {
  if (promise === x) {
    reject(new TypeError('Error'))

  } else if(x instanceof Promise) {
    x.then(xValue => {
      resolutionProducer(promise, xValue, resolve, reject);
    }, reason => reject(reason));
  } else if (x !== null && typeof x === 'object' || typeof x === 'function') {
    try {
      const then = x.then;

      if (typeof then === 'function') {
        let hasCalled = false;
        then.call(x,
          (y: any) => {
            if (!hasCalled) {
              resolutionProducer(promise, y, resolve, reject);
              hasCalled = true;
            }
          },
          (reason: any) => {
            reject(reason);
          },
        );
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