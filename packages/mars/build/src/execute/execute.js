"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printableToString = exports.execute = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ethers_1 = require("ethers");
const symbols_1 = require("../symbols");
const values_1 = require("../values");
const getDeployTx_1 = require("./getDeployTx");
const sendTransaction_1 = require("./sendTransaction");
const save_1 = require("./save");
const bytecode_1 = require("./bytecode");
const verification_1 = require("../verification");
const context_1 = require("../context");
async function execute(actions, options) {
    for (const action of actions) {
        await executeAction(action, options);
    }
}
exports.execute = execute;
async function executeGetStorageAt({ address: futureAddress, storageAddress, resolve }, options) {
    var _a;
    const address = resolveValue(futureAddress);
    const storageValue = await ((_a = options.signer.provider) === null || _a === void 0 ? void 0 : _a.getStorageAt(address, storageAddress));
    resolve(storageValue !== null && storageValue !== void 0 ? storageValue : '0x');
}
async function executeAction(action, options) {
    if (context_1.context.conditionalDepth > 0) {
        if (action.type === 'CONDITIONAL_START') {
            context_1.context.conditionalDepth++;
        }
        if (action.type === 'CONDITIONAL_END') {
            context_1.context.conditionalDepth--;
        }
        return;
    }
    switch (action.type) {
        case 'DEPLOY':
            return executeDeploy(action, options);
        case 'READ':
            return executeRead(action, options);
        case 'TRANSACTION':
            return executeTransaction(action, options);
        case 'ENCODE':
            return executeEncode(action);
        case 'CONDITIONAL_START':
            return executeConditionalStart(action);
        case 'DEBUG':
            return executeDebug(action);
        case 'GET_STORAGE_AT':
            return executeGetStorageAt(action, options);
    }
}
function executeConditionalStart({ condition }) {
    if (!values_1.Future.resolve(condition)) {
        context_1.context.conditionalDepth++;
    }
}
function getDeployedAddress(fileName, networkName, localContractName) {
    const localEntry = (0, save_1.read)(fileName, networkName, localContractName);
    return localEntry ? localEntry.address : undefined;
}
async function isDeployedContractSameAsLocal(provider, address, localContractBytecode) {
    const networkBytecode = await provider.getCode(address);
    return networkBytecode !== undefined && (0, bytecode_1.isBytecodeEqual)(networkBytecode, localContractBytecode);
}
async function isNewDeploymentNeeded(localAddress, provider, localBytecode, skipEqualityCheck) {
    if (!localAddress)
        return true;
    const contractsAreEqual = skipEqualityCheck || (await isDeployedContractSameAsLocal(provider, localAddress, localBytecode));
    return !contractsAreEqual;
}
async function executeDeploy(action, globalOptions) {
    const options = { ...globalOptions, ...action.options };
    const params = action.params.map((param) => resolveValue(param));
    let tx = (0, getDeployTx_1.getDeployTx)(action.artifact[symbols_1.AbiSymbol], action.artifact[symbols_1.Bytecode], params);
    const existingAddress = getDeployedAddress(options.deploymentsFile, options.networkName, action.name);
    let address, txHash;
    if (!(await isNewDeploymentNeeded(existingAddress, options.provider, action.artifact[symbols_1.DeployedBytecode], action.skipUpgrade))) {
        console.log(`Skipping deployment ${action.name} - ${existingAddress}`);
        address = existingAddress;
    }
    else {
        if (context_1.context.multisig) {
            // eslint-disable-next-line no-extra-semi,@typescript-eslint/no-extra-semi
            ;
            ({ transaction: tx, address } = await context_1.context.multisig.addContractDeployment(tx));
            ({ txHash } = await (0, sendTransaction_1.sendTransaction)(`Deploy ${action.name}`, options, tx));
        }
        else {
            // eslint-disable-next-line no-extra-semi,@typescript-eslint/no-extra-semi
            ;
            ({ txHash, address } = await (0, sendTransaction_1.sendTransaction)(`Deploy ${action.name}`, options, tx));
        }
        if (!options.dryRun) {
            const multisig = !!context_1.context.multisig;
            (0, save_1.save)(options.deploymentsFile, options.networkName, action.name, { txHash, address, multisig });
        }
    }
    if (options.verification) {
        if (options.verification.flattenScript) {
            await (0, verification_1.verifySingleFile)(options.verification.etherscanApiKey, options.verification.flattenScript, options.verification.waffleConfig, action.artifact[symbols_1.Name], address, action.constructor ? new ethers_1.utils.Interface([action.constructor]).encodeDeploy(params) : undefined, options.networkName);
        }
        else {
            await (0, verification_1.verify)(options.verification.etherscanApiKey, options.verification.jsonInputs, options.verification.waffleConfig, action.artifact[symbols_1.Name], address, action.constructor ? new ethers_1.utils.Interface([action.constructor]).encodeDeploy(params) : undefined, options.networkName);
        }
    }
    action.resolve(address);
}
async function executeRead(action, options) {
    const params = action.params.map((param) => resolveValue(param));
    const address = resolveValue(action.address);
    const contract = new ethers_1.Contract(address, [action.method], options.signer);
    const result = await contract[action.method.name](...params);
    action.resolve(result);
}
async function executeTransaction(action, globalOptions) {
    var _a;
    const options = { ...globalOptions, ...action.options };
    const params = action.params.map((param) => resolveValue(param));
    const transaction = {
        to: resolveValue(action.address),
        data: new ethers_1.utils.Interface([action.method]).encodeFunctionData(action.method.name, params),
    };
    const { txHash, txWithGas } = await (0, sendTransaction_1.sendTransaction)(`${action.name}.${action.method.name}(${printableTransactionParams(params)})`, options, transaction);
    (_a = context_1.context.multisig) === null || _a === void 0 ? void 0 : _a.addContractInteraction(txWithGas);
    action.resolve((0, values_1.resolveBytesLike)(txHash));
}
function printableTransactionParams(params) {
    return params.map(printableToString).join(', ');
}
async function executeEncode(action) {
    const params = action.params.map((param) => resolveValue(param));
    const result = new ethers_1.utils.Interface([action.method]).encodeFunctionData(action.method.name, params);
    action.resolve(Buffer.from(result, 'hex'));
}
function resolveValue(value) {
    const resolved = values_1.Future.resolve(value);
    const address = resolved && resolved[symbols_1.Address];
    if (address) {
        return values_1.Future.resolve(address);
    }
    return resolved;
}
function executeDebug({ messages }) {
    console.log(chalk_1.default.yellow('🛠', ...messages.map(printableToString)));
}
function printableToString(data) {
    const resolved = data instanceof values_1.Future ? values_1.Future.resolve(data) : data;
    if (!resolved || typeof resolved !== 'object') {
        return resolved;
    }
    if (resolved instanceof ethers_1.BigNumber) {
        return resolved.toString();
    }
    if (symbols_1.ArtifactSymbol in resolved && symbols_1.Address in resolved) {
        return `${resolved[symbols_1.ArtifactSymbol][symbols_1.Name]}#${values_1.Future.resolve(resolved[symbols_1.Address])}`;
    }
    if (Array.isArray(resolved)) {
        return JSON.stringify(resolved.map(printableToString));
    }
    return JSON.stringify(Object.fromEntries(Object.entries(resolved).map(([key, value]) => [key, printableToString(value)])), null, 2);
}
exports.printableToString = printableToString;
//# sourceMappingURL=execute.js.map