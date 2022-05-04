"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const options_1 = require("../../src/options");
const PRIVATE_KEY_1 = `0x${'1'.repeat(64)}`;
const PRIVATE_KEY_2 = `0x${'2'.repeat(64)}`;
const PRIVATE_KEY_3 = `0x${'3'.repeat(64)}`;
const defaults = { gasPrice: ethers_1.BigNumber.from(1) }; // speeds things up
describe('getConfig', () => {
    let envBackup;
    let argvBackup;
    beforeEach(() => {
        process.argv = ['mars'];
        envBackup = process.env;
        argvBackup = process.argv;
    });
    afterEach(() => {
        process.env = envBackup;
        process.argv = argvBackup;
    });
    function setEnv(values) {
        process.env = { ...envBackup, ...values };
    }
    function setArgv(values) {
        process.argv = [argvBackup[0], argvBackup[1], ...values];
    }
    it('respects options precedence', async () => {
        const result1 = await (0, options_1.getConfig)({ privateKey: PRIVATE_KEY_1, ...defaults });
        (0, chai_1.expect)(result1.signer.privateKey).to.equal(PRIVATE_KEY_1);
        setEnv({ PRIVATE_KEY: PRIVATE_KEY_2 });
        const result2 = await (0, options_1.getConfig)({ privateKey: PRIVATE_KEY_1, ...defaults });
        (0, chai_1.expect)(result2.signer.privateKey).to.equal(PRIVATE_KEY_2);
        setArgv(['-p', PRIVATE_KEY_3]);
        const result3 = await (0, options_1.getConfig)({ privateKey: PRIVATE_KEY_1, ...defaults });
        (0, chai_1.expect)(result3.signer.privateKey).to.equal(PRIVATE_KEY_3);
    });
    it('dry run implies noConfirm', async () => {
        const result = await (0, options_1.getConfig)({ dryRun: true, ...defaults });
        (0, chai_1.expect)(result.noConfirm).to.equal(true);
    });
    it('throws if private key is missing', async () => {
        const reverted = await (0, options_1.getConfig)({}).then(() => false, () => true);
        (0, chai_1.expect)(reverted).to.equal(true);
    });
});
//# sourceMappingURL=config.test.js.map