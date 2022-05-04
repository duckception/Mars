"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProxy = void 0;
const contract_1 = require("./contract");
const symbols_1 = require("../symbols");
const ethers_1 = require("ethers");
const conditionals_1 = require("./conditionals");
function getImplementation(proxy) {
    // Storage slot defined in EIP-1967 https://eips.ethereum.org/EIPS/eip-1967
    const IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
    if (proxy.implementation) {
        return proxy.implementation();
    }
    const stored64Bytes = proxy.getStorageAt(IMPLEMENTATION_SLOT);
    const extractAddress = (slot) => ethers_1.utils.getAddress(`0x${slot.slice(-40)}`);
    return stored64Bytes.map(extractAddress);
}
function createProxy(...args) {
    var _a;
    const artifact = args[0];
    const params = Array.isArray(args[1]) ? args[1] : [];
    const onUpgradeIndex = params.length > 0 ? 2 : 1;
    const onUpgrade = (_a = args[onUpgradeIndex]) !== null && _a !== void 0 ? _a : 'upgradeTo';
    return (...args) => {
        const [name, implementation, onInitialize] = parseProxyArgs(...args);
        const proxy = (0, contract_1.contract)(name !== null && name !== void 0 ? name : `${implementation[symbols_1.Name]}_proxy`, artifact, params);
        const currentImplementation = getImplementation(proxy);
        const normalizedOnUpgrade = normalizeCall(proxy, onUpgrade, [implementation]);
        (0, conditionals_1.runIf)(currentImplementation.equals(implementation[symbols_1.Address]).not(), () => normalizedOnUpgrade(proxy));
        const contractBehindProxy = (0, contract_1.makeContractInstance)(implementation[symbols_1.Name], implementation[symbols_1.ArtifactSymbol], proxy[symbols_1.Address]);
        (0, conditionals_1.runIf)(currentImplementation.equals(ethers_1.constants.AddressZero), () => onInitialize && onInitialize(contractBehindProxy));
        return contractBehindProxy;
    };
}
exports.createProxy = createProxy;
// refactoring: provide a proxy instance with params convergence function
function parseProxyArgs(...args) {
    var _a;
    const hasObjectParam = args.length == 2 && typeof args[1] !== 'function' && typeof args[1] !== 'string';
    const objectParam = (hasObjectParam ? args[1] : {});
    const withName = typeof args[0] === 'string';
    const name = withName ? args[0] : objectParam.name;
    const contract = args[withName ? 1 : 0];
    const onInitialize = hasObjectParam ? objectParam.onInitialize : args[withName ? 2 : 1];
    const onInitializeParams = (_a = (hasObjectParam ? objectParam.params : args[withName ? 3 : 2])) !== null && _a !== void 0 ? _a : [];
    const onInitializeNormalized = onInitialize ? normalizeCall(contract, onInitialize, onInitializeParams) : undefined;
    return [name, contract, onInitializeNormalized];
}
function normalizeCall(contract, call, params) {
    if (typeof call === 'function') {
        return call;
    }
    const methodName = call;
    return (contract) => contract[methodName](...params);
}
//# sourceMappingURL=createProxy.js.map