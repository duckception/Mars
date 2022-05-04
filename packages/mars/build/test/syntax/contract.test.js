"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const chai_1 = require("chai");
const utils_1 = require("../utils");
const src_1 = require("../../src");
const SimpleContract_json_1 = __importDefault(require("../build/SimpleContract.json"));
const ComplexContract_json_1 = __importDefault(require("../build/ComplexContract.json"));
const symbols_1 = require("../../src/symbols");
const exampleArtifacts_1 = require("../fixtures/exampleArtifacts");
const ethers_1 = require("ethers");
describe('Contract', () => {
    const getDeployResult = () => JSON.parse(fs_1.default.readFileSync('./test/deployments.json').toString());
    it('deploys contract (no name, no params)', async () => {
        const { result, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)(exampleArtifacts_1.SimpleContract));
        (0, chai_1.expect)(await provider.getCode(result[symbols_1.Address].resolve())).to.equal(`0x${SimpleContract_json_1.default.evm.deployedBytecode.object}`);
        (0, chai_1.expect)(getDeployResult().test.simpleContract.address).to.equal(result[symbols_1.Address].resolve());
    });
    it('deploys contract (no name, no params, gas override)', async () => {
        const { result, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)(exampleArtifacts_1.SimpleContract, { gasLimit: 2000000 }));
        (0, chai_1.expect)(await provider.getCode(result[symbols_1.Address].resolve())).to.equal(`0x${SimpleContract_json_1.default.evm.deployedBytecode.object}`);
        (0, chai_1.expect)(getDeployResult().test.simpleContract.address).to.equal(result[symbols_1.Address].resolve());
        (0, chai_1.expect)((await provider.getTransaction(getDeployResult().test.simpleContract.txHash)).gasLimit).to.equal(2000000);
    });
    it('deploys contract (with name, no params)', async () => {
        const { result, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)('someName', exampleArtifacts_1.SimpleContract));
        (0, chai_1.expect)(await provider.getCode(result[symbols_1.Address].resolve())).to.equal(`0x${SimpleContract_json_1.default.evm.deployedBytecode.object}`);
        (0, chai_1.expect)(getDeployResult().test.someName.address).to.equal(result[symbols_1.Address].resolve());
    });
    it('deploys contract (with name, no params, gas override)', async () => {
        const { result, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)('someName', exampleArtifacts_1.SimpleContract, { gasLimit: 2000000 }));
        (0, chai_1.expect)(await provider.getCode(result[symbols_1.Address].resolve())).to.equal(`0x${SimpleContract_json_1.default.evm.deployedBytecode.object}`);
        (0, chai_1.expect)(getDeployResult().test.someName.address).to.equal(result[symbols_1.Address].resolve());
        (0, chai_1.expect)((await provider.getTransaction(getDeployResult().test.someName.txHash)).gasLimit).to.equal(2000000);
    });
    it('deploys contract (no name, with params)', async () => {
        const { result, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)(exampleArtifacts_1.ComplexContract, [10, 'test']));
        (0, chai_1.expect)(await provider.getCode(result[symbols_1.Address].resolve())).to.equal(`0x${ComplexContract_json_1.default.evm.deployedBytecode.object}`);
        (0, chai_1.expect)(getDeployResult().test.complexContract.address).to.equal(result[symbols_1.Address].resolve());
    });
    it('deploys contract (no name, with params, gas override)', async () => {
        const { result, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)(exampleArtifacts_1.ComplexContract, [10, 'test'], { gasLimit: 2000000 }));
        (0, chai_1.expect)(await provider.getCode(result[symbols_1.Address].resolve())).to.equal(`0x${ComplexContract_json_1.default.evm.deployedBytecode.object}`);
        (0, chai_1.expect)(getDeployResult().test.complexContract.address).to.equal(result[symbols_1.Address].resolve());
        (0, chai_1.expect)((await provider.getTransaction(getDeployResult().test.complexContract.txHash)).gasLimit).to.equal(2000000);
    });
    it('deploys contract (with name, with params)', async () => {
        const { result, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)('contractName', exampleArtifacts_1.ComplexContract, [10, 'test']));
        (0, chai_1.expect)(await provider.getCode(result[symbols_1.Address].resolve())).to.equal(`0x${ComplexContract_json_1.default.evm.deployedBytecode.object}`);
        (0, chai_1.expect)(getDeployResult().test.contractName.address).to.equal(result[symbols_1.Address].resolve());
    });
    it('deploys contract (with name, with params and gas override)', async () => {
        const { result, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)('contractName', exampleArtifacts_1.ComplexContract, [10, 'test'], { gasLimit: 2000000 }));
        (0, chai_1.expect)(await provider.getCode(result[symbols_1.Address].resolve())).to.equal(`0x${ComplexContract_json_1.default.evm.deployedBytecode.object}`);
        (0, chai_1.expect)(getDeployResult().test.contractName.address).to.equal(result[symbols_1.Address].resolve());
        (0, chai_1.expect)((await provider.getTransaction(getDeployResult().test.contractName.txHash)).gasLimit).to.equal(2000000);
    });
    it('does not deploy same contract twice', async () => {
        const { result: firstCall, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)(exampleArtifacts_1.SimpleContract));
        const { result: secondCall } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)(exampleArtifacts_1.SimpleContract), {
            injectProvider: provider,
            saveDeploy: true,
        });
        (0, chai_1.expect)(firstCall[symbols_1.Address].resolve()).to.equal(secondCall[symbols_1.Address].resolve());
        (0, chai_1.expect)(await provider.getBlockNumber()).to.equal(1);
    });
    it('does not deploy same contracts which addresses are of different cases', async () => {
        const { result: firstCall, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)(exampleArtifacts_1.SimpleContract));
        const deployment = getDeployResult();
        const addressLowerCase = deployment.test.simpleContract.address.toString().toLowerCase();
        deployment.test.simpleContract.address = addressLowerCase;
        fs_1.default.writeFileSync('./test/deployments.json', JSON.stringify(deployment));
        const { result: secondCall } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)(exampleArtifacts_1.SimpleContract), {
            injectProvider: provider,
            saveDeploy: true,
        });
        (0, chai_1.expect)(firstCall[symbols_1.Address].resolve()).to.not.equal(secondCall[symbols_1.Address].resolve());
        (0, chai_1.expect)(firstCall[symbols_1.Address].resolve().toLowerCase()).to.equal(secondCall[symbols_1.Address].resolve().toLowerCase());
        (0, chai_1.expect)(await provider.getBlockNumber()).to.equal(1);
    });
    it('deploys same contracts with different names', async () => {
        const { result: firstCall, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)('1', exampleArtifacts_1.SimpleContract));
        const { result: secondCall } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)('2', exampleArtifacts_1.SimpleContract), {
            injectProvider: provider,
            saveDeploy: true,
        });
        (0, chai_1.expect)(firstCall[symbols_1.Address].resolve()).to.not.equal(secondCall[symbols_1.Address].resolve());
        (0, chai_1.expect)(await provider.getBlockNumber()).to.equal(2);
    });
    it('does not redeploy contract if different constructor args only', async () => {
        const { result: firstCall, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)(exampleArtifacts_1.ComplexContract, [10, 'test']));
        const { result: secondCall } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)(exampleArtifacts_1.ComplexContract, [11, 'test']), {
            injectProvider: provider,
            saveDeploy: true,
        });
        (0, chai_1.expect)(firstCall[symbols_1.Address].resolve()).to.equal(secondCall[symbols_1.Address].resolve());
        (0, chai_1.expect)(await provider.getBlockNumber()).to.equal(1);
    });
    it('redeploys contract if bytecode has changed', async () => {
        const { result: firstCall, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)('contractName', exampleArtifacts_1.ComplexContract, [10, 'test']));
        const { result: secondCall } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)('contractName', exampleArtifacts_1.SimpleContract), {
            injectProvider: provider,
            saveDeploy: true,
        });
        (0, chai_1.expect)(firstCall[symbols_1.Address].resolve()).to.not.equal(secondCall[symbols_1.Address].resolve());
        (0, chai_1.expect)(await provider.getCode(firstCall[symbols_1.Address].resolve())).to.equal(`0x${ComplexContract_json_1.default.evm.deployedBytecode.object}`);
        (0, chai_1.expect)(await provider.getCode(secondCall[symbols_1.Address].resolve())).to.equal(`0x${SimpleContract_json_1.default.evm.deployedBytecode.object}`);
        (0, chai_1.expect)(getDeployResult().test.contractName.address).to.equal(secondCall[symbols_1.Address].resolve());
    });
    it('does not redeploy modified contract if update was skipped explicitly', async () => {
        const { result: firstCall, provider } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)('contractName', exampleArtifacts_1.ComplexContract, [10, 'test']));
        const { result: secondCall } = await (0, utils_1.testDeploy)(() => (0, src_1.contract)('contractName', exampleArtifacts_1.SimpleContract, { skipUpgrade: true }), {
            injectProvider: provider,
            saveDeploy: true,
        });
        (0, chai_1.expect)(firstCall[symbols_1.Address].resolve()).to.equal(secondCall[symbols_1.Address].resolve());
    });
    it('deploys using an upgradeability proxy', async () => {
        let xAfterInit = new src_1.FutureNumber(() => ethers_1.BigNumber.from(0));
        const { result: proxyDeploymentCall } = await (0, utils_1.testDeploy)(() => {
            const upgradeable = (0, src_1.contract)('upgradeable', exampleArtifacts_1.UpgradeableContract);
            const proxy = (0, src_1.createProxy)(exampleArtifacts_1.UpgradeabilityProxy, 'upgradeTo');
            const proxied = proxy(upgradeable, 'initialize', [1000]);
            xAfterInit = proxied.x();
            return proxied;
        });
        const proxyAddress = proxyDeploymentCall[symbols_1.Address].resolve();
        (0, chai_1.expect)(getDeployResult().test.upgradeable_proxy.address).to.equal(proxyAddress);
        (0, utils_1.expectFuture)(xAfterInit, ethers_1.BigNumber.from(1000));
    });
    it('deploys using an upgradeability proxy without "implementation" method', async () => {
        let xAfterInit = new src_1.FutureNumber(() => ethers_1.BigNumber.from(0));
        const { result: proxyDeploymentCall } = await (0, utils_1.testDeploy)(() => {
            const upgradeable = (0, src_1.contract)('upgradeable', exampleArtifacts_1.UpgradeableContract);
            // Will call initialize(10000)
            const proxy = (0, src_1.createProxy)(exampleArtifacts_1.OpenZeppelinProxy, [upgradeable, '0xfe4b84df0000000000000000000000000000000000000000000000000000000000002710'], 'upgradeTo');
            const proxied = proxy(upgradeable);
            xAfterInit = proxied.x();
            return proxied;
        });
        const proxyAddress = proxyDeploymentCall[symbols_1.Address].resolve();
        (0, chai_1.expect)(getDeployResult().test.upgradeable_proxy.address).to.equal(proxyAddress);
        (0, utils_1.expectFuture)(xAfterInit, ethers_1.BigNumber.from(10000));
    });
    it('deploys using an upgradeability proxy without running init function', async () => {
        let xAfterNoInit = new src_1.FutureNumber(() => ethers_1.BigNumber.from(0));
        const { result: proxyDeploymentCall } = await (0, utils_1.testDeploy)(() => {
            const upgradeable = (0, src_1.contract)('upgradeable', exampleArtifacts_1.UpgradeableContract);
            const proxy = (0, src_1.createProxy)(exampleArtifacts_1.UpgradeabilityProxy, 'upgradeTo');
            const proxied = proxy(upgradeable);
            xAfterNoInit = proxied.x();
            return proxied;
        });
        const proxyAddress = proxyDeploymentCall[symbols_1.Address].resolve();
        (0, chai_1.expect)(getDeployResult().test.upgradeable_proxy.address).to.equal(proxyAddress);
        (0, utils_1.expectFuture)(xAfterNoInit, ethers_1.BigNumber.from(0));
    });
    it('deploys using an upgradeability proxy without providing init params', async () => {
        let xAfterNoInit = new src_1.FutureNumber(() => ethers_1.BigNumber.from(0));
        const { result: proxyDeploymentCall } = await (0, utils_1.testDeploy)(() => {
            const upgradeable = (0, src_1.contract)('upgradeable', exampleArtifacts_1.UpgradeableContract);
            const proxy = (0, src_1.createProxy)(exampleArtifacts_1.UpgradeabilityProxy, 'upgradeTo');
            const proxied = proxy(upgradeable, 'reInitializeOne');
            xAfterNoInit = proxied.x();
            return proxied;
        });
        const proxyAddress = proxyDeploymentCall[symbols_1.Address].resolve();
        (0, chai_1.expect)(getDeployResult().test.upgradeable_proxy.address).to.equal(proxyAddress);
        (0, utils_1.expectFuture)(xAfterNoInit, ethers_1.BigNumber.from(1));
    });
    it('upgrades proxy without "implementation" method', async () => {
        let xAfterUpdate = new src_1.FutureNumber(() => ethers_1.BigNumber.from(0));
        const { result: proxyDeploymentCall } = await (0, utils_1.testDeploy)(() => {
            const upgradeable = (0, src_1.contract)('upgradeable', exampleArtifacts_1.UpgradeableContract);
            // Will call initialize(10000)
            const proxy = (0, src_1.createProxy)(exampleArtifacts_1.OpenZeppelinProxy, [upgradeable, '0xfe4b84df0000000000000000000000000000000000000000000000000000000000002710'], 'upgradeTo');
            proxy(upgradeable);
            const newVersion = (0, src_1.contract)('upgradeable', exampleArtifacts_1.UpgradeableContract2);
            const proxied = proxy(newVersion);
            xAfterUpdate = proxied.x();
            return proxied;
        });
        const proxyAddress = proxyDeploymentCall[symbols_1.Address].resolve();
        (0, chai_1.expect)(getDeployResult().test.upgradeable_proxy.address).to.equal(proxyAddress);
        (0, utils_1.expectFuture)(xAfterUpdate, ethers_1.BigNumber.from(420));
    });
    afterEach(() => {
        fs_1.default.unlinkSync('./test/deployments.json');
    });
});
//# sourceMappingURL=contract.test.js.map