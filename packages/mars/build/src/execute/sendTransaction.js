"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransaction = exports.withGas = void 0;
const ethers_1 = require("ethers");
const readline_1 = __importDefault(require("readline"));
const getEthPriceUsd_1 = require("./getEthPriceUsd");
const chalk_1 = __importDefault(require("chalk"));
const logging_1 = require("../logging");
const context_1 = require("../context");
async function withGas(transaction, gasLimit, gasPrice, signer) {
    const effectiveGasLimit = gasLimit !== null && gasLimit !== void 0 ? gasLimit : (await signer.estimateGas({ ...transaction, from: await signer.getAddress() }));
    return { ...transaction, gasLimit: effectiveGasLimit, gasPrice };
}
exports.withGas = withGas;
function getLogTxTitle(name, dryRun) {
    const isDryRunLike = dryRun || context_1.context.multisig;
    return (isDryRunLike ? '🧸 DRYRUN' : '🚀') + ' Transaction: ' + name;
}
async function sendTransaction(name, { signer, gasPrice, noConfirm, gasLimit: overwrittenGasLimit, dryRun }, transaction) {
    const txWithGas = await withGas(transaction, overwrittenGasLimit, gasPrice, signer);
    const price = await (0, getEthPriceUsd_1.getEthPriceUsd)();
    const fee = ethers_1.utils.formatEther(gasPrice.mul(txWithGas.gasLimit));
    const feeInUsd = (parseFloat(fee) * price).toFixed(2);
    const balance = ethers_1.utils.formatEther(await signer.getBalance());
    const balanceInUsd = (parseFloat(balance) * price).toFixed(2);
    console.log(chalk_1.default.yellow(getLogTxTitle(name, dryRun)));
    console.log(chalk_1.default.blue('  Fee:'), `$${feeInUsd}, Ξ${fee}`);
    console.log(chalk_1.default.blue('  Balance:'), `$${balanceInUsd}, Ξ${balance}`);
    if (!noConfirm) {
        await waitForKeyPress();
    }
    console.log(chalk_1.default.blue('  Sending'), '...');
    const tx = await signer.sendTransaction(txWithGas);
    console.log(chalk_1.default.blue('  Hash:'), tx.hash);
    const receipt = await tx.wait();
    console.log(chalk_1.default.blue('  Block:'), receipt.blockNumber);
    if (receipt.contractAddress) {
        console.log(chalk_1.default.blue('  Address:'), receipt.contractAddress);
    }
    console.log();
    (0, logging_1.log)(`${getLogTxTitle(name, dryRun)}  Hash: ${tx.hash} Hex data: ${tx.data}`);
    return {
        txHash: receipt.transactionHash,
        address: receipt.contractAddress || ethers_1.constants.AddressZero,
        txWithGas,
    };
}
exports.sendTransaction = sendTransaction;
async function waitForKeyPress() {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.write('ENTER to submit, Ctrl+C to exit...');
    return new Promise((resolve) => {
        rl.on('line', () => {
            process.stdout.moveCursor(0, -1);
            process.stdout.clearLine(1);
            resolve();
            rl.close();
        });
    });
}
//# sourceMappingURL=sendTransaction.js.map