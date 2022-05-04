"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureMultisigConfig = void 0;
/**
 * Returns either a valid multisig configuration or undefined in case multisig is not configured at all.
 * It guarantees that no invalid/partial multisig configuration is ever to be processed.
 * @param config multisig configuration -like structure
 */
function ensureMultisigConfig(config) {
    const intendedToBeEnabled = !!(config.gnosisSafeAddress || config.gnosisServiceUri);
    const fullyConfigured = !!(config.gnosisSafeAddress && config.gnosisServiceUri);
    if (!intendedToBeEnabled)
        return undefined;
    if (!fullyConfigured)
        throw new Error('Invalid multisig configuration. ' +
            `Chain ID=${config.networkChainId}, Safe=${config.gnosisSafeAddress}, Service=${config.gnosisServiceUri}`);
    return config;
}
exports.ensureMultisigConfig = ensureMultisigConfig;
//# sourceMappingURL=multisigConfig.js.map