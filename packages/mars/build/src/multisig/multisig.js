"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultisigTxDispatcher = void 0;
const ethers_1 = require("ethers");
const contractDeployer_1 = require("./gnosis/contractDeployer");
const safe_core_sdk_1 = __importStar(require("@gnosis.pm/safe-core-sdk"));
const safe_service_client_1 = __importDefault(require("@gnosis.pm/safe-service-client"));
const logging_1 = require("../logging");
const chalk_1 = __importDefault(require("chalk"));
class MultisigTxDispatcher {
    constructor(config) {
        this._config = config;
        this._signer = config.multisigSigner;
        this._safeServiceClient = new safe_service_client_1.default(config.gnosisServiceUri);
        this._config = config;
        this.txBatch = [];
        this._contractDeployer = new contractDeployer_1.ContractDeployer(config.networkChainId);
    }
    /**
     * Adds a contract deployment transaction as a multisig batch part.
     *
     * @param tx contract deployment transaction
     * @returns deterministic deployment data in order to be able replicate the transaction later on
     */
    async addContractDeployment(tx) {
        const deployment = await this._contractDeployer.createDeploymentTx(tx);
        this.txBatch.push(deployment.transaction);
        return deployment;
    }
    /**
     * Adds a contract interaction transaction as a multisig batch part.
     *
     * @param tx contract deployment transaction
     */
    addContractInteraction(tx) {
        this.txBatch.push(tx);
    }
    /**
     * Registers a multisig transaction in the multisig system for multisig participants to approve and execute later on.
     *
     * Multisig registration and its various steps may (but does not need to) be transacted in the network on-chain or
     * leveraged off-chain. It depends on the particular multisig service in use.
     * It is guaranteed though that the final execution of the multisig must be transacted and finalized in the network.
     *
     * @returns unique id of the multisig transaction
     */
    async propose() {
        const safe = await this.ensureSafe();
        const safeMultisigParts = this.txBatch.map((tx) => {
            var _a, _b;
            return ({
                to: tx.to,
                data: tx.data,
                value: (_b = (_a = tx.value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '0',
            });
        });
        const safeMultisigTx = await safe.createTransaction(safeMultisigParts);
        const safeMultisigTxHash = await safe.getTransactionHash(safeMultisigTx);
        const senderAddress = await this._signer.getAddress();
        await this._safeServiceClient.proposeTransaction({
            safeAddress: safe.getAddress(),
            safeTxHash: safeMultisigTxHash,
            safeTransaction: safeMultisigTx,
            senderAddress,
        });
        (0, logging_1.log)(chalk_1.default.yellow(`🤹 Multisig batch has been proposed (${safeMultisigParts.length} transactions) to the queue. Batch ID = ${safeMultisigTxHash}`));
        return safeMultisigTxHash;
    }
    /**
     * Adds one more approval for a given multisig tx by the current signer. The signer must be authorized to approve.
     * @param id identifies the multisig transaction to approve
     */
    async approve(id) {
        const safe = await this.ensureSafe();
        const confirmationSignature = await safe.signTransactionHash(id);
        await this._safeServiceClient.confirmTransaction(id, confirmationSignature.data);
        (0, logging_1.log)(chalk_1.default.yellow(`🎯 Multisig batch ${id} approved by ${await this._signer.getAddress()}`));
    }
    async ensureSafe() {
        if (this._safe)
            return this._safe;
        this._safe = await safe_core_sdk_1.default.create({
            ethAdapter: new safe_core_sdk_1.EthersAdapter({ ethers: ethers_1.ethers, signer: this._signer }),
            safeAddress: this._config.gnosisSafeAddress,
        });
        return this._safe;
    }
}
exports.MultisigTxDispatcher = MultisigTxDispatcher;
//# sourceMappingURL=multisig.js.map