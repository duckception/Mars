"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = void 0;
exports.context = {
    enabled: false,
    ensureEnabled() {
        if (!this.enabled) {
            throw new Error('Context not enabled!');
        }
    },
    actions: [],
    // Counts depth of conditional transactions after the failed one
    conditionalDepth: 0,
    multisig: undefined,
};
//# sourceMappingURL=context.js.map