"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureBoolean = void 0;
const future_1 = require("./future");
class FutureBoolean extends future_1.Future {
    not() {
        return new FutureBoolean(() => !this.resolve());
    }
    and(other) {
        return new FutureBoolean(() => this.resolve() && future_1.Future.resolve(other));
    }
    or(other) {
        return new FutureBoolean(() => this.resolve() || future_1.Future.resolve(other));
    }
    thenElse(thenValue, elseValue) {
        return this.map((x) => (x ? future_1.Future.resolve(thenValue) : future_1.Future.resolve(elseValue)));
    }
}
exports.FutureBoolean = FutureBoolean;
future_1.Future.prototype.equals = function (other) {
    return new FutureBoolean(() => this.resolve() === future_1.Future.resolve(other));
};
//# sourceMappingURL=boolean.js.map