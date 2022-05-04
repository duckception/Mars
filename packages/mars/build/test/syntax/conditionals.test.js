"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const chai_1 = require("chai");
const testDeploy_1 = require("../utils/testDeploy");
const src_1 = require("../../src");
const exampleArtifacts_1 = require("../fixtures/exampleArtifacts");
const ethers_1 = require("ethers");
describe('RunIf', () => {
    const futureBool = (result) => new src_1.Future(() => result);
    const getDeployResult = () => JSON.parse(fs_1.default.readFileSync('./test/deployments.json').toString());
    const deployFileExists = () => fs_1.default.existsSync('./test/deployments.json');
    describe('runIf', () => {
        it('executes action if condition is true', async () => {
            await (0, testDeploy_1.testDeploy)(() => (0, src_1.runIf)(futureBool(true), () => (0, src_1.contract)(exampleArtifacts_1.SimpleContract)));
            (0, chai_1.expect)(getDeployResult().test.simpleContract.address).to.be.not.undefined;
        });
        it('does not execute action if condition is false', async () => {
            await (0, testDeploy_1.testDeploy)(() => (0, src_1.runIf)(futureBool(false), () => (0, src_1.contract)(exampleArtifacts_1.SimpleContract)));
            (0, chai_1.expect)(deployFileExists()).to.be.false;
        });
        it('else clause is not called when condition is true', async () => {
            await (0, testDeploy_1.testDeploy)(() => (0, src_1.runIf)(futureBool(true), () => (0, src_1.contract)(exampleArtifacts_1.SimpleContract)).else(() => (0, src_1.contract)('alternative', exampleArtifacts_1.SimpleContract)));
            (0, chai_1.expect)(getDeployResult().test.simpleContract.address).to.be.not.undefined;
            (0, chai_1.expect)(getDeployResult().test.alternative).to.be.undefined;
        });
        it('else clause is called when condition is false', async () => {
            await (0, testDeploy_1.testDeploy)(() => (0, src_1.runIf)(futureBool(false), () => (0, src_1.contract)(exampleArtifacts_1.SimpleContract)).else(() => (0, src_1.contract)('alternative', exampleArtifacts_1.SimpleContract)));
            (0, chai_1.expect)(getDeployResult().test.simpleContract).to.be.undefined;
            (0, chai_1.expect)(getDeployResult().test.alternative.address).to.be.not.undefined;
        });
        it('multiple elseIfs', async () => {
            const futureNumber = new src_1.FutureNumber(() => ethers_1.BigNumber.from(2));
            await (0, testDeploy_1.testDeploy)(() => (0, src_1.runIf)(futureNumber.equals(0), () => (0, src_1.contract)('0', exampleArtifacts_1.SimpleContract))
                .elseIf(futureNumber.equals(1), () => (0, src_1.contract)('1', exampleArtifacts_1.SimpleContract))
                .elseIf(futureNumber.equals(2), () => (0, src_1.contract)('2', exampleArtifacts_1.SimpleContract))
                .elseIf(futureNumber.equals(3), () => (0, src_1.contract)('3', exampleArtifacts_1.SimpleContract))
                .else(() => (0, src_1.contract)('other', exampleArtifacts_1.SimpleContract)));
            (0, chai_1.expect)(getDeployResult().test['0']).to.be.undefined;
            (0, chai_1.expect)(getDeployResult().test['1']).to.be.undefined;
            (0, chai_1.expect)(getDeployResult().test['3']).to.be.undefined;
            (0, chai_1.expect)(getDeployResult().test.other).to.be.undefined;
            (0, chai_1.expect)(getDeployResult().test['2'].address).to.be.not.undefined;
        });
        it('nested conditionals', async () => {
            const futureNumber = new src_1.FutureNumber(() => ethers_1.BigNumber.from(2));
            const deploy = (name) => () => (0, src_1.contract)(name, exampleArtifacts_1.SimpleContract);
            await (0, testDeploy_1.testDeploy)(() => (0, src_1.runIf)(futureNumber.equals(0), () => (0, src_1.runIf)(futureNumber.equals(2), deploy('02')).else(deploy('0')))
                .elseIf(futureNumber.equals(1), () => (0, src_1.runIf)(futureNumber.equals(3), deploy('13')).else(deploy('1')))
                .elseIf(futureNumber.equals(2), () => (0, src_1.contract)('2', exampleArtifacts_1.SimpleContract))
                .elseIf(futureNumber.equals(3), () => (0, src_1.contract)('3', exampleArtifacts_1.SimpleContract))
                .else(() => (0, src_1.contract)('other', exampleArtifacts_1.SimpleContract)));
            (0, chai_1.expect)(getDeployResult().test['0']).to.be.undefined;
            (0, chai_1.expect)(getDeployResult().test['02']).to.be.undefined;
            (0, chai_1.expect)(getDeployResult().test['13']).to.be.undefined;
            (0, chai_1.expect)(getDeployResult().test['1']).to.be.undefined;
            (0, chai_1.expect)(getDeployResult().test['3']).to.be.undefined;
            (0, chai_1.expect)(getDeployResult().test.other).to.be.undefined;
            (0, chai_1.expect)(getDeployResult().test['2'].address).to.be.not.undefined;
        });
        afterEach(() => {
            if (deployFileExists()) {
                fs_1.default.unlinkSync('./test/deployments.json');
            }
        });
    });
});
//# sourceMappingURL=conditionals.test.js.map