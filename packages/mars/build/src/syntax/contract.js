"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeContractInstance = exports.contract = void 0;
const symbols_1 = require("../symbols");
const context_1 = require("../context");
const values_1 = require("../values");
function contract(...args) {
    context_1.context.ensureEnabled();
    const { name, artifact, params, options } = parseContractArgs(...args);
    const constructor = artifact[symbols_1.AbiSymbol].find(({ type }) => type === 'constructor');
    const [address, resolveAddress] = values_1.Future.create();
    context_1.context.actions.push({
        type: 'DEPLOY',
        name,
        constructor,
        artifact,
        params,
        options,
        resolve: resolveAddress,
        skipUpgrade: !!options.skipUpgrade,
    });
    return makeContractInstance(name, artifact, address);
}
exports.contract = contract;
function unCapitalize(value) {
    return value !== '' ? `${value[0].toLowerCase()}${value.substring(1)}` : '';
}
function parseContractArgs(...args) {
    var _a;
    const withName = typeof args[0] === 'string';
    const artifactIndex = withName ? 1 : 0;
    const artifact = args[artifactIndex];
    const name = withName ? args[0] : unCapitalize(artifact[symbols_1.Name]);
    const withParams = Array.isArray(args[artifactIndex + 1]);
    const params = withParams ? args[artifactIndex + 1] : [];
    const options = (_a = (withParams ? args[artifactIndex + 2] : args[artifactIndex + 1])) !== null && _a !== void 0 ? _a : {};
    return { name, artifact, options, params };
}
function makeContractInstance(name, artifact, address) {
    const contract = {
        [symbols_1.ArtifactSymbol]: artifact,
        [symbols_1.Address]: address,
        [symbols_1.Name]: name,
    };
    for (const entry of artifact[symbols_1.AbiSymbol]) {
        if (entry.type === 'function') {
            contract[entry.name] = (...args) => {
                var _a, _b, _c;
                context_1.context.ensureEnabled();
                const [result, resolveResult] = values_1.Future.create();
                const isView = ['pure', 'view'].includes(entry.stateMutability);
                let options = {};
                let params = args;
                if (!isView && args.length > entry.inputs.length) {
                    options = args[args.length - 1];
                    params = params.slice(0, args.length - 1);
                }
                context_1.context.actions.push({
                    type: isView ? 'READ' : 'TRANSACTION',
                    name,
                    address: address,
                    method: entry,
                    params,
                    options,
                    resolve: resolveResult,
                });
                const type = (_b = (_a = entry.outputs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.type;
                const length = (_c = entry.outputs) === null || _c === void 0 ? void 0 : _c.length;
                return type && length === 1 && isView ? castFuture(type, result) : result;
            };
        }
    }
    contract.getStorageAt = (storageAddress) => {
        context_1.context.ensureEnabled();
        const [result, resolveResult] = values_1.Future.create();
        context_1.context.actions.push({
            type: 'GET_STORAGE_AT',
            address,
            storageAddress,
            resolve: resolveResult,
        });
        return result;
    };
    return contract;
}
exports.makeContractInstance = makeContractInstance;
function castFuture(type, future) {
    if (type.startsWith('uint') || type.startsWith('int')) {
        return new values_1.FutureNumber(future.map(values_1.resolveNumberLike).resolve);
    }
    else if (type === 'bool') {
        return new values_1.FutureBoolean(future.resolve);
    }
    else if (type.startsWith('byte')) {
        return new values_1.FutureBytes(future.map(values_1.resolveBytesLike).resolve);
    }
    else {
        return future;
    }
}
//# sourceMappingURL=contract.js.map