"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const ethers_1 = require("ethers");
const ganache_core_1 = __importDefault(require("ganache-core"));
const verification_1 = require("../verification");
const checks_1 = require("./checks");
const cli_1 = require("./cli");
const defaults_1 = require("./defaults");
const environment_1 = require("./environment");
const multisigConfig_1 = require("../multisig/multisigConfig");
const logging_1 = require("../logging");
const chain_1 = require("./chain");
async function getConfig(options) {
    var _a, _b, _c;
    const merged = {
        ...(0, defaults_1.getDefaultOptions)(),
        ...options,
        ...(0, environment_1.getEnvironmentOptions)(),
        ...(options.disableCommandLineOptions ? false : (0, cli_1.getCommandLineOptions)()),
    };
    if (merged.dryRun && merged.noConfirm === undefined) {
        merged.noConfirm = true;
    }
    let verification = undefined;
    if (merged.verify) {
        verification = {
            etherscanApiKey: merged.etherscanApiKey,
            jsonInputs: await (0, verification_1.createJsonInputs)(merged.sources),
            waffleConfig: merged.waffleConfig,
            flattenScript: merged.flattenScript,
        };
    }
    const { signer, networkName, multisigSigner } = await getSigner(merged);
    const gasPrice = (_a = merged.gasPrice) !== null && _a !== void 0 ? _a : (await signer.getGasPrice());
    const multisig = merged.multisig
        ? (0, multisigConfig_1.ensureMultisigConfig)({
            // @typescript-eslint/no-non-null-assertion
            networkChainId: (await multisigSigner.provider.getNetwork()).chainId,
            gnosisSafeAddress: merged.multisigGnosisSafe,
            gnosisServiceUri: merged.multisigGnosisServiceUri,
            multisigSigner: multisigSigner,
        })
        : undefined;
    logging_1.logConfig.mode.file = !!merged.logFile;
    logging_1.logConfig.filepath = (_b = merged.logFile) !== null && _b !== void 0 ? _b : '';
    return {
        gasPrice,
        noConfirm: !!merged.noConfirm,
        signer,
        provider: signer.provider,
        networkName: networkName,
        dryRun: !!merged.dryRun,
        logFile: (_c = merged.logFile) !== null && _c !== void 0 ? _c : '',
        deploymentsFile: merged.outputFile,
        verification,
        multisig,
    };
}
exports.getConfig = getConfig;
function isNetworkProvider(network) {
    return !!network && typeof network === 'object' && network.send !== undefined;
}
// Refactoring candidate - https://github.com/EthWorks/Mars/issues/50
// signer returned here has non-empty provider
async function getSigner(options) {
    const { network, infuraApiKey, alchemyApiKey, dryRun, fromAddress, privateKey, multisig } = options;
    if (network === undefined) {
        throw new Error('No network specified. This should never happen.');
    }
    let rpcUrl;
    let provider;
    if (isNetworkProvider(network)) {
        // this causes 'MaxListenersExceededWarning: Possible EventEmitter memory leak detected.' when many contracts in use
        // details at https://github.com/ChainSafe/web3.js/issues/1648
        provider = new ethers_1.providers.Web3Provider(network);
    }
    else if (network.startsWith('http')) {
        rpcUrl = network;
    }
    else if (alchemyApiKey) {
        rpcUrl = chain_1.chains[network].getAlchemyRpc(alchemyApiKey);
    }
    else if (infuraApiKey) {
        rpcUrl = chain_1.chains[network].getInfuraRpc(infuraApiKey);
    }
    else {
        rpcUrl = chain_1.chains[network].getPublicRpc();
    }
    let signer;
    let multisigSigner;
    if (multisig) {
        if (privateKey === undefined) {
            (0, checks_1.exit)('No private key specified. In dry-run multisig a private key must be provided');
        }
        const multisigProvider = provider !== null && provider !== void 0 ? provider : new ethers_1.providers.JsonRpcProvider(rpcUrl);
        multisigSigner = new ethers_1.Wallet(privateKey, multisigProvider);
        const ganache = ganache_core_1.default.provider({
            fork: rpcUrl,
        });
        provider = new ethers_1.providers.Web3Provider(ganache);
        signer = new ethers_1.Wallet(privateKey, provider);
    }
    else if (dryRun) {
        const randomWallet = ethers_1.Wallet.createRandom();
        const ganache = ganache_core_1.default.provider({
            fork: network !== null && network !== void 0 ? network : rpcUrl,
            unlocked_accounts: fromAddress ? [fromAddress] : [],
            accounts: [{ balance: '10000000000000000000000000000000000', secretKey: randomWallet.privateKey }],
        });
        provider = new ethers_1.providers.Web3Provider(ganache);
        signer = fromAddress ? provider.getSigner(fromAddress) : new ethers_1.Wallet(privateKey !== null && privateKey !== void 0 ? privateKey : randomWallet, provider);
    }
    else {
        provider !== null && provider !== void 0 ? provider : (provider = new ethers_1.providers.JsonRpcProvider(rpcUrl));
        if (privateKey === undefined) {
            (0, checks_1.exit)('No private key specified.');
        }
        signer = new ethers_1.Wallet(privateKey, provider);
    }
    const networkName = isNetworkProvider(network) || network.startsWith('http') ? (await provider.getNetwork()).name : network;
    return { signer, networkName, multisigSigner };
}
//# sourceMappingURL=config.js.map