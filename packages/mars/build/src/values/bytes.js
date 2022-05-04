"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureBytes = exports.resolveBytesLike = void 0;
const future_1 = require("./future");
const boolean_1 = require("./boolean");
function resolveBytesLike(value) {
    const resolved = future_1.Future.resolve(value);
    if (typeof resolved === 'string') {
        if (resolved.startsWith('0x')) {
            return Buffer.from(resolved.slice(2), 'hex');
        }
        else {
            return Buffer.from(resolved, 'hex');
        }
    }
    else if (Array.isArray(resolved)) {
        return Buffer.from(resolved);
    }
    else {
        return resolved;
    }
}
exports.resolveBytesLike = resolveBytesLike;
class FutureBytes extends future_1.Future {
    equals(other) {
        return new boolean_1.FutureBoolean(() => this.resolve().equals(future_1.Future.resolve(other)));
    }
}
exports.FutureBytes = FutureBytes;
//# sourceMappingURL=bytes.js.map