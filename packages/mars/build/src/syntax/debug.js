"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = void 0;
const context_1 = require("../context");
function debug(...messages) {
    context_1.context.ensureEnabled();
    context_1.context.actions.push({
        type: 'DEBUG',
        messages,
    });
}
exports.debug = debug;
//# sourceMappingURL=debug.js.map