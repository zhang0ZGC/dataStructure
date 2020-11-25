"use strict";
/**
 * @link https://malcolmyu.github.io/malnote/2015/06/12/Promises-A-Plus
 **/
exports.__esModule = true;
/**
 * Promise决议程序
 * @param {MyPromise} promise2
 * @param x
 * @param resolve
 * @param reject
 */
function resolutionProducer(promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError('Error'));
        // } else if(x instanceof MyPromise) {
        //   x.then((xValue: any) => {
        //     resolutionProducer(promise2, xValue, resolve, reject);
        //   }, (reason: any) => reject(reason));
    }
    else if (x !== null && typeof x === 'object' || typeof x === 'function') {
        try {
            var then = x.then;
            if (typeof then === 'function') {
                var hasCalled_1 = false;
                try {
                    then.call(x, function (y) {
                        if (!hasCalled_1) {
                            hasCalled_1 = true;
                            resolutionProducer(promise2, y, resolve, reject);
                        }
                    }, function (reason) {
                        if (!hasCalled_1) {
                            hasCalled_1 = true;
                            reject(reason);
                        }
                    });
                }
                catch (e) {
                    reject(e);
                }
            }
            else {
                resolve(x);
            }
        }
        catch (e) {
            reject(e);
        }
    }
    else {
        resolve(x);
    }
}
// 还是用原Promise来作为异步任务队列哈哈哈哈哈。。。
// const defer = typeof Promise === 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;
var defer = setTimeout;
var MyPromise = /** @class */ (function () {
    function MyPromise(executor) {
        this.status = 'pending';
        this.onFulfilledQueue = [];
        this.onRejectedQueue = [];
        var self = this;
        function resolve(value) {
            if (self.status === 'pending') {
                self.status = 'fulfilled';
                self.value = value;
                self.onFulfilledQueue.forEach(function (func) { return func(value); });
            }
        }
        function reject(e) {
            if (self.status === 'pending') {
                self.status = 'rejected';
                self.reason = e;
                self.onRejectedQueue.forEach(function (func) { return func(e); });
            }
        }
        try {
            executor(resolve, reject);
        }
        catch (e) {
            reject(e);
        }
    }
    MyPromise.prototype.then = function (onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function')
            onFulfilled = function onResolved(v) { return v; };
        if (typeof onRejected !== 'function')
            onRejected = function onRejected(e) { throw e; };
        var self = this;
        function resolveByStatus(resolve, reject) {
            defer(function resolveDeferFunc() {
                try {
                    var x = onFulfilled(self.value);
                    resolutionProducer(promise2, x, resolve, reject);
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        function rejectByStatus(resolve, reject) {
            defer(function rejectDeferFunc() {
                try {
                    var x = onRejected(self.value);
                    resolutionProducer(promise2, x, resolve, reject);
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        var promise2 = new MyPromise(function executor(resolve, reject) {
            switch (self.status) {
                case "pending":
                    self.onFulfilledQueue.push(function fulfilledCb() {
                        resolveByStatus(resolve, reject);
                    });
                    self.onRejectedQueue.push(function rejectedCb() {
                        rejectByStatus(resolve, reject);
                    });
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
    };
    return MyPromise;
}());
exports["default"] = MyPromise;
