"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArtifact = void 0;
const context_1 = require("../context");
const symbols_1 = require("../symbols");
const values_1 = require("../values");
function createArtifact(name, json) {
    const artifact = {
        [symbols_1.Name]: name,
        [symbols_1.AbiSymbol]: json.abi,
        [symbols_1.Bytecode]: json.bytecode,
        [symbols_1.DeployedBytecode]: json.evm.deployedBytecode.object,
    };
    for (const entry of json.abi) {
        if (entry.type === 'function') {
            artifact[entry.name] = (...args) => {
                context_1.context.ensureEnabled();
                const [result, resolveResult] = values_1.Future.create();
                context_1.context.actions.push({
                    type: 'ENCODE',
                    method: entry,
                    params: args,
                    resolve: resolveResult,
                });
                return result;
            };
        }
    }
    return artifact;
}
exports.createArtifact = createArtifact;
//# sourceMappingURL=artifact.js.map