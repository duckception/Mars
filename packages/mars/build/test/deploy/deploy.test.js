"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const ganache_core_1 = __importDefault(require("ganache-core"));
const src_1 = require("../../src");
const exampleArtifacts_1 = require("../fixtures/exampleArtifacts");
const utils_1 = require("../utils");
const chai_1 = require("chai");
describe('Deploying', () => {
    describe('With fork and unlocked accounts using `dryRun` and `fromAccount` options', () => {
        it('using account with plenty of ETH, should deploy with success', async () => {
            const alice = ethers_1.Wallet.createRandom();
            const ganacheProvider = ganache_core_1.default.provider({
                locked: true,
                gasPrice: '0',
                accounts: [{ secretKey: alice.privateKey, balance: '10000000000000000' }],
            });
            const { result } = await (0, src_1.deploy)({
                dryRun: true,
                fromAddress: await alice.getAddress(),
                network: ganacheProvider,
                disableCommandLineOptions: true,
            }, () => {
                const contractResult = (0, src_1.contract)(exampleArtifacts_1.SimpleContract);
                return contractResult.hello();
            });
            (0, utils_1.expectFuture)(result, 'world');
        });
        it('using account with no ETH, should fail deployment', async () => {
            const alice = ethers_1.Wallet.createRandom();
            const ganacheProvider = ganache_core_1.default.provider({
                locked: true,
                gasPrice: '0',
                accounts: [{ secretKey: alice.privateKey, balance: '0' }],
            });
            try {
                await (0, src_1.deploy)({
                    dryRun: true,
                    fromAddress: await alice.getAddress(),
                    network: ganacheProvider,
                    disableCommandLineOptions: true,
                }, () => (0, src_1.contract)(exampleArtifacts_1.SimpleContract));
            }
            catch (e) {
                (0, chai_1.expect)(e.message)
                    .to.be.a('string')
                    .and.match(/^sender doesn't have enough funds to send tx/);
            }
        });
    });
});
//# sourceMappingURL=deploy.test.js.map