"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduce = exports.Future = void 0;
class Future {
    constructor(resolve) {
        this.resolve = resolve;
    }
    static resolve(value) {
        return value instanceof Future ? value.resolve() : value;
    }
    static create(message = 'Trying to get value from unresolved future.') {
        let resolved = false;
        let value;
        const future = new Future(() => {
            if (!resolved) {
                throw new Error(message);
            }
            return value;
        });
        return [
            future,
            (result) => {
                resolved = true;
                value = result;
            },
        ];
    }
    map(fn) {
        return new Future(() => Future.resolve(fn(this.resolve())));
    }
    get(key) {
        return this.map((value) => value[key]);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    equals(other) {
        throw new Error('This will get overridden.');
    }
}
exports.Future = Future;
function reduce(futures, fn) {
    return new Future(() => Future.resolve(fn(...futures.map((f) => f.resolve()))));
}
exports.reduce = reduce;
//# sourceMappingURL=future.js.map