"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeployTx = void 0;
const ethers_1 = require("ethers");
function getDeployTx(abi, bytecode, args) {
    return new ethers_1.ContractFactory(abi, bytecode).getDeployTransaction(...args);
}
exports.getDeployTx = getDeployTx;
//# sourceMappingURL=getDeployTx.js.map