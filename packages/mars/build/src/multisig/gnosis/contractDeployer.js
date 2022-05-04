"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractDeployer = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
/**
 * Creates contract deployment transactions targeting deterministic addresses using CREATE2 opcode.
 */
// TODO: rename as the current logic does not interact with the network (no deployment takes place); but it creates a tx
class ContractDeployer {
    constructor(networkChainId) {
        this.networkChainId = networkChainId;
    }
    /**
     * Creates a new contract deployment transactions and precomputes its deterministic creation address.
     * @param unwrappedDeploymentTx a raw deployment transaction
     * @returns wrapped contract deployment transaction and contract deployment address
     */
    async createDeploymentTx(unwrappedDeploymentTx) {
        const deployerContract = this.getDeployerContract();
        const salt = (0, utils_1.randomBytes)(32);
        if (!unwrappedDeploymentTx.data)
            throw new Error('Deployment transaction data is empty.');
        const transaction = await deployerContract.populateTransaction.performCreate2(0, unwrappedDeploymentTx.data, salt);
        const address = ethers_1.utils.getCreate2Address(deployerContract.address, salt, (0, utils_1.keccak256)(unwrappedDeploymentTx.data));
        return { address, transaction };
    }
    getDeployerContract() {
        const address = createCall.networkAddresses[this.networkChainId];
        return new ethers_1.Contract(address, createCall.abi);
    }
}
exports.ContractDeployer = ContractDeployer;
const createCall = {
    defaultAddress: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
    released: true,
    contractName: 'CreateCall',
    version: '1.3.0',
    networkAddresses: {
        1: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        4: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        10: '0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d',
        42: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        5: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        56: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        69: '0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d',
        100: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        137: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        246: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        1285: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        1287: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        4002: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        42161: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        42220: '0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d',
        43114: '0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d',
        73799: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        333999: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
    },
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'newContract',
                    type: 'address',
                },
            ],
            name: 'ContractCreation',
            type: 'event',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes',
                    name: 'deploymentData',
                    type: 'bytes',
                },
            ],
            name: 'performCreate',
            outputs: [
                {
                    internalType: 'address',
                    name: 'newContract',
                    type: 'address',
                },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes',
                    name: 'deploymentData',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes32',
                    name: 'salt',
                    type: 'bytes32',
                },
            ],
            name: 'performCreate2',
            outputs: [
                {
                    internalType: 'address',
                    name: 'newContract',
                    type: 'address',
                },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ],
};
//# sourceMappingURL=contractDeployer.js.map