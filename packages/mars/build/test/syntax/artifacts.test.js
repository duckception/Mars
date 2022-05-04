"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ethereum_waffle_1 = require("ethereum-waffle");
const src_1 = require("../../src");
const utils_1 = require("../utils");
const exampleArtifacts_1 = require("../fixtures/exampleArtifacts");
const ethers_1 = require("ethers");
const symbols_1 = require("../../src/symbols");
const utils_2 = require("../utils");
(0, chai_1.use)(ethereum_waffle_1.solidity);
describe('Artifacts', () => {
    const testRun = async () => (0, utils_1.testDeploy)(() => {
        const testContract = (0, src_1.contract)(exampleArtifacts_1.ComplexContract, [1, 'test']);
        testContract.setter('hello world', [1, 2, 3]);
        const number = testContract.number();
        const str = testContract.str();
        const mapping = testContract.simpleMapping(2);
        const complexMapping = testContract.complexMapping(12, ethers_1.constants.AddressZero);
        const array = testContract.simpleArray(2);
        const twoDArray = testContract.twoDArray(1, 1);
        const noArgs = testContract.viewNoArgs();
        const tuple = testContract.viewReturnsTuple();
        const struct = testContract.viewReturnsStruct();
        const sum = testContract.add(struct.get('c').get(0).get('x'));
        return { testContract, number, str, mapping, complexMapping, array, twoDArray, noArgs, tuple, struct, sum };
    }, { saveDeploy: false });
    it('check inputs', async () => {
        const { result: { testContract }, provider, } = await testRun();
        const contract = new ethers_1.Contract(testContract[symbols_1.Address].resolve(), exampleArtifacts_1.ComplexContract[symbols_1.AbiSymbol], provider);
        (0, chai_1.expect)('setter').to.be.calledOnContractWith(contract, ['hello world', [1, 2, 3]]);
        (0, chai_1.expect)('number').to.be.calledOnContractWith(contract, []);
        (0, chai_1.expect)('str').to.be.calledOnContractWith(contract, []);
        (0, chai_1.expect)('simpleMapping').to.be.calledOnContractWith(contract, [2]);
        (0, chai_1.expect)('complexMapping').to.be.calledOnContractWith(contract, [12, ethers_1.constants.AddressZero]);
        (0, chai_1.expect)('simpleArray').to.be.calledOnContractWith(contract, [2]);
        (0, chai_1.expect)('viewNoArgs').to.be.calledOnContractWith(contract, []);
        (0, chai_1.expect)('viewReturnsTuple').to.be.calledOnContractWith(contract, []);
        (0, chai_1.expect)('viewReturnsStruct').to.be.calledOnContractWith(contract, []);
        (0, chai_1.expect)('add').to.be.calledOnContractWith(contract, [15]);
    });
    it('check outputs', async () => {
        const { result } = await testRun();
        (0, utils_2.expectFuture)(result.number, 1);
        (0, utils_2.expectFuture)(result.str, 'hello world');
        (0, utils_2.expectFuture)(result.mapping, '');
        (0, utils_2.expectFuture)(result.complexMapping, [ethers_1.BigNumber.from(0), ethers_1.BigNumber.from(0)]);
        (0, utils_2.expectFuture)(result.array, 3);
        (0, utils_2.expectFuture)(result.twoDArray, 20);
        (0, utils_2.expectFuture)(result.noArgs, 42);
        (0, utils_2.expectFuture)(result.tuple, [ethers_1.BigNumber.from(1), 'hello', false]);
        (0, utils_2.expectFuture)(result.struct, [ethers_1.BigNumber.from(10), ethers_1.BigNumber.from(20), [[ethers_1.BigNumber.from(15), ethers_1.BigNumber.from(16)]]]);
        (0, utils_2.expectFuture)(result.sum, 16);
    });
});
//# sourceMappingURL=artifacts.test.js.map