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
const ethers_1 = require("ethers");
const safe_core_sdk_1 = __importStar(require("@gnosis.pm/safe-core-sdk"));
const safe_service_client_1 = __importDefault(require("@gnosis.pm/safe-service-client"));
const getDeployTx_1 = require("../../src/execute/getDeployTx");
const exampleArtifacts_1 = require("../fixtures/exampleArtifacts");
const symbols_1 = require("../../src/symbols");
const contractDeployer_1 = require("../../src/multisig/gnosis/contractDeployer");
const chai_1 = require("chai");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Contract__JSON = require('./../build/UpgradeableContract.json');
const config = {
    txServiceUri: 'https://safe-transaction.rinkeby.gnosis.io',
    infuraApiKey: process.env.INFURA_KEY,
    ethNetworkName: 'rinkeby',
    ttSafe: '0x8772CD484C059EC5c61459a0abb5A45ece16701f',
    owner: {
        // one of many owners of the TT Test Safe
        address: '0x4a70cc993A25F0D57Fb37B8E8D5C7CcC0B24Cd7d',
        privateKey: process.env.OWNER_PRIVATE_KEY,
    },
    delegate: {
        // one of the delegates
        address: '0x48A1B8fF5cEa06D95187f9A1B528D0c90554A179',
        privateKey: process.env.DELEGATE_PRIVATE_KEY,
    },
};
// based on https://docs.gnosis-safe.io/build/sdks/core-sdk
describe('Gnosis Safe as multisig contract deployment and interaction service in Rinkeby', () => {
    let deployer;
    let safeServiceClient;
    let owner;
    let delegate;
    let safeByOwner; // safe managed via the owner account
    let safeByDelegate; // safe managed via the delegate account
    beforeEach(async () => {
        safeServiceClient = new safe_service_client_1.default(config.txServiceUri);
        const web3Provider = new ethers_1.providers.InfuraProvider(config.ethNetworkName, config.infuraApiKey);
        deployer = new contractDeployer_1.ContractDeployer(web3Provider.network.chainId);
        owner = new ethers_1.ethers.Wallet(config.owner.privateKey, web3Provider);
        delegate = new ethers_1.ethers.Wallet(config.delegate.privateKey, web3Provider);
        safeByOwner = await safe_core_sdk_1.default.create({
            ethAdapter: new safe_core_sdk_1.EthersAdapter({ ethers: ethers_1.ethers, signer: owner }),
            safeAddress: config.ttSafe,
        });
        safeByDelegate = await safe_core_sdk_1.default.create({
            ethAdapter: new safe_core_sdk_1.EthersAdapter({ ethers: ethers_1.ethers, signer: delegate }),
            safeAddress: config.ttSafe,
        });
    });
    it('Prints Safe address and its owners', async () => {
        const address = safeByOwner.getAddress();
        console.log(`Address: ${address}`);
        const owners = await safeByOwner.getOwners();
        console.log('Owners:');
        owners.map((owner) => console.log(owner));
    });
    it('Adds a delegate if not already assigned', async () => {
        var _a, _b;
        const delegateAddress = await delegate.getAddress();
        const delegates = (_b = (_a = (await safeServiceClient.getSafeDelegates(config.ttSafe))) === null || _a === void 0 ? void 0 : _a.results) !== null && _b !== void 0 ? _b : [];
        if (!delegates.some((d) => d.delegate === delegateAddress)) {
            const addedDelegate = await safeServiceClient.addSafeDelegate({
                safe: config.ttSafe,
                delegate: delegateAddress,
                signer: owner,
                label: "marcin's delegate",
            });
            console.log(`Delegate ${addedDelegate} added.`);
        }
        console.log('Delegates:');
        delegates.map((d) => console.log(`${d.delegate} (${d.label}) added by ${d.delegator}`));
    });
    it("Multisig-deploys a contract and multisig-calls a contract's operation", async () => {
        // Contract deployment using multisig workflow
        const bytecode = exampleArtifacts_1.UpgradeableContract[symbols_1.Bytecode];
        const directDeploymentTx = (0, getDeployTx_1.getDeployTx)(exampleArtifacts_1.UpgradeableContract[symbols_1.AbiSymbol], bytecode, []);
        const { transaction: deploymentTx, address } = await deployer.createDeploymentTx(directDeploymentTx);
        console.log(`Pre-computed address of the contract to be deployed: ${address}`);
        const { safeMultisigTx: safeDeploymentTx, safeMultisigTxHash: safeDeploymentTxHash } = await proposeInSafe(deploymentTx);
        await confirmInSafe(safeDeploymentTxHash);
        await executeInSafe(safeDeploymentTx);
        // Contract interaction using a separate multisig workflow
        const contract = new ethers_1.Contract(address, Contract__JSON.abi, delegate);
        const rawInteractionTx = await contract.populateTransaction.initialize(11223344);
        const { safeMultisigTx: safeInteractionTx, safeMultisigTxHash: safeInteractionTxHash } = await proposeInSafe(rawInteractionTx);
        await confirmInSafe(safeInteractionTxHash);
        await executeInSafe(safeInteractionTx);
        // Asserts: call the deployed and initialized contract off-multisig to examine availability and state
        const actual = await contract.x();
        (0, chai_1.expect)(actual.toNumber()).to.be.equal(11223344);
    });
    it('Multisig batched transactions to do as much work in a single shot of approvals and execution', async () => {
        const bytecode = exampleArtifacts_1.UpgradeableContract[symbols_1.Bytecode];
        const directDeploymentTx = (0, getDeployTx_1.getDeployTx)(exampleArtifacts_1.UpgradeableContract[symbols_1.AbiSymbol], bytecode, []);
        const { transaction: deploymentTx, address } = await deployer.createDeploymentTx(directDeploymentTx);
        console.log(`Pre-computed address of the contract to be deployed: ${address}`);
        const contract = new ethers_1.Contract(address, Contract__JSON.abi, delegate);
        const interactionTx = await contract.populateTransaction.initialize(11223344);
        // See: here we propose a batch of 1) deployment and 2) contract interaction
        const { safeMultisigTx, safeMultisigTxHash } = await proposeInSafe([deploymentTx, interactionTx]);
        await confirmInSafe(safeMultisigTxHash);
        await executeInSafe(safeMultisigTx);
        // Asserts: call the deployed and initialized contract off-multisig to examine availability and state
        const actual = await contract.x();
        (0, chai_1.expect)(actual.toNumber()).to.be.equal(11223344);
    });
    describe('Utility pieces that can be called separately for diagnostic or debugging', () => {
        it("Get safe's latest transactions", async () => {
            const multisigTransactions = await safeServiceClient.getMultisigTransactions(safeByOwner.getAddress());
            multisigTransactions.results.forEach((tx) => {
                console.log('=====================================================================');
                console.log(`TX ${tx.transactionHash}`);
                console.log('=====================================================================');
                console.log(JSON.stringify(tx, null, 2));
            });
        });
    });
    async function proposeInSafe(tx) {
        const txs = Array.isArray(tx) ? tx : [tx];
        const safeMultisigParts = txs.map((tx) => {
            var _a, _b;
            return ({
                to: tx.to,
                data: tx.data,
                value: (_b = (_a = tx.value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '0',
            });
        });
        const safeMultisigTx = await safeByDelegate.createTransaction(safeMultisigParts);
        const safeMultisigTxHash = await safeByDelegate.getTransactionHash(safeMultisigTx);
        await safeServiceClient.proposeTransaction({
            safeAddress: safeByDelegate.getAddress(),
            safeTxHash: safeMultisigTxHash,
            safeTransaction: safeMultisigTx,
            senderAddress: await delegate.getAddress(),
        });
        console.log(`Safe transaction proposed successfully: tx hash = ${safeMultisigTxHash}`);
        return { safeMultisigTx, safeMultisigTxHash };
    }
    async function confirmInSafe(safeTransactionHash) {
        // Off-chain approve tx in Gnosis Transaction Service
        // for an on-chain approval, you need to interact with the contract via the safe sdk (not the service client)
        const confirmationSignature = await safeByOwner.signTransactionHash(safeTransactionHash);
        const confirmationResponse = await safeServiceClient.confirmTransaction(safeTransactionHash, confirmationSignature.data);
        console.log(`Confirmed off-chain by owner ${safeByOwner.getAddress()}. ` + `Signature is: ${confirmationResponse.signature}`);
    }
    async function executeInSafe(safeDeploymentTx) {
        var _a;
        // Execute transaction
        const executionResult = await safeByOwner.executeTransaction(safeDeploymentTx);
        console.log(`Executing... (tx hash: ${executionResult.hash})`);
        await ((_a = executionResult.transactionResponse) === null || _a === void 0 ? void 0 : _a.wait());
        console.log(`Executed (tx hash ${executionResult.hash}) in the network!`);
    }
});
//# sourceMappingURL=testGnosis.e2e.js.map