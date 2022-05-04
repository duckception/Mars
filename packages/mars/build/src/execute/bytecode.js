"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBytecodeEqual = void 0;
function isBytecodeEqual(a, b) {
    if (a === undefined)
        throw new Error('left-side operand undefined');
    if (b === undefined)
        throw new Error('right-side operand undefined');
    return removeHashes(normalize(a)) === removeHashes(normalize(b));
}
exports.isBytecodeEqual = isBytecodeEqual;
const normalize = (bytecode) => (bytecode.startsWith('0x') ? bytecode.substring(2) : bytecode).toLowerCase();
const BZZR1_PATTERN = /65627a7a72305820[a-f\d]{64}/g;
const IPFS_PATTERN = /64697066735822[a-f\d]{68}/g;
function removeHashes(bytecode) {
    return bytecode.replace(BZZR1_PATTERN, '0'.repeat(80)).replace(IPFS_PATTERN, '0'.repeat(82));
}
//# sourceMappingURL=bytecode.js.map