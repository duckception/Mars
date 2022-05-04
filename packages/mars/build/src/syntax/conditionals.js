"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runIf = void 0;
const values_1 = require("../values");
const context_1 = require("../context");
function negate(condition) {
    if (typeof condition === 'boolean') {
        return new values_1.FutureBoolean(() => !condition);
    }
    return new values_1.FutureBoolean(() => condition.resolve()).not();
}
function runIf(condition, action) {
    context_1.context.ensureEnabled();
    context_1.context.actions.push({
        type: 'CONDITIONAL_START',
        condition,
    });
    action();
    context_1.context.actions.push({
        type: 'CONDITIONAL_END',
    });
    let wasNotExecuted = negate(condition);
    const result = {
        else: (alternate) => {
            runIf(wasNotExecuted, alternate);
        },
        elseIf: (otherCondition, alternate) => {
            runIf(wasNotExecuted.and(otherCondition), alternate);
            wasNotExecuted = wasNotExecuted.and(negate(otherCondition));
            return result;
        },
    };
    return result;
}
exports.runIf = runIf;
//# sourceMappingURL=conditionals.js.map