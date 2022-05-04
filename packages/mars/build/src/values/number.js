"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureNumber = exports.resolveNumberLike = void 0;
const ethers_1 = require("ethers");
const boolean_1 = require("./boolean");
const future_1 = require("./future");
function resolveNumberLike(value) {
    const resolved = future_1.Future.resolve(value);
    return ethers_1.BigNumber.from(resolved);
}
exports.resolveNumberLike = resolveNumberLike;
class FutureNumber extends future_1.Future {
    add(other) {
        return new FutureNumber(() => this.resolve().add(resolveNumberLike(other)));
    }
    sub(other) {
        return new FutureNumber(() => this.resolve().sub(resolveNumberLike(other)));
    }
    mul(other) {
        return new FutureNumber(() => this.resolve().mul(resolveNumberLike(other)));
    }
    div(other) {
        return new FutureNumber(() => this.resolve().div(resolveNumberLike(other)));
    }
    mod(other) {
        return new FutureNumber(() => this.resolve().mod(resolveNumberLike(other)));
    }
    pow(other) {
        return new FutureNumber(() => this.resolve().pow(resolveNumberLike(other)));
    }
    lt(other) {
        return new boolean_1.FutureBoolean(() => this.resolve().lt(resolveNumberLike(other)));
    }
    lte(other) {
        return new boolean_1.FutureBoolean(() => this.resolve().lte(resolveNumberLike(other)));
    }
    gt(other) {
        return new boolean_1.FutureBoolean(() => this.resolve().gt(resolveNumberLike(other)));
    }
    gte(other) {
        return new boolean_1.FutureBoolean(() => this.resolve().gte(resolveNumberLike(other)));
    }
    equals(other) {
        return new boolean_1.FutureBoolean(() => this.resolve().eq(resolveNumberLike(other)));
    }
}
exports.FutureNumber = FutureNumber;
//# sourceMappingURL=number.js.map