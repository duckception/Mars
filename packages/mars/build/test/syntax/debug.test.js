"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const execute_1 = require("../../src/execute/execute");
const ethers_1 = require("ethers");
const testDeploy_1 = require("../utils/testDeploy");
const src_1 = require("../../src");
const exampleArtifacts_1 = require("../fixtures/exampleArtifacts");
const symbols_1 = require("../../src/symbols");
const fs_1 = __importDefault(require("fs"));
describe('Debug', () => {
    describe('object conversions', () => {
        it('BigNumber', () => {
            (0, chai_1.expect)((0, execute_1.printableToString)(ethers_1.BigNumber.from('123'))).to.equal('123');
        });
        it('For contracts prints contract solidity name and address', async () => {
            const deployed = await (0, testDeploy_1.testDeploy)(() => (0, src_1.contract)('name', exampleArtifacts_1.SimpleContract));
            const address = src_1.Future.resolve(deployed.result[symbols_1.Address]);
            (0, chai_1.expect)((0, execute_1.printableToString)(deployed.result)).to.equal(`SimpleContract#${address}`);
            fs_1.default.unlinkSync('./test/deployments.json');
        });
        it('Array', () => {
            (0, chai_1.expect)((0, execute_1.printableToString)([ethers_1.BigNumber.from('123'), '321'])).to.deep.equal('["123","321"]');
        });
        it('Object', () => {
            (0, chai_1.expect)((0, execute_1.printableToString)({
                foo: ethers_1.BigNumber.from('123'),
                bar: 'bar',
            })).to.deep.equal('{\n  "foo": "123",\n  "bar": "bar"\n}');
        });
        it('Future', async () => {
            (0, chai_1.expect)((0, execute_1.printableToString)(new src_1.Future(() => ethers_1.BigNumber.from('123')))).to.equal('123');
        });
    });
});
//# sourceMappingURL=debug.test.js.map