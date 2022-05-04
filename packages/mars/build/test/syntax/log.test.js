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
describe('Log', () => {
    const logPath = 'test.log';
    it('logs deployment transaction', async () => {
        await deploySomething();
        const text = readLog();
        (0, chai_1.expect)(text).to.match(/Transaction: (.*) Hash: (.*) Hex data: (.*)/);
    });
    it('separates log entries with new lines', async () => {
        await deploySomething();
        const text = readLog();
        (0, chai_1.expect)(text.split('\n').length).to.eq(2);
    });
    beforeEach(async () => {
        (0, chai_1.expect)(fs_1.default.existsSync(logPath)).to.be.false;
    });
    afterEach(async () => {
        fs_1.default.unlinkSync(logPath);
        fs_1.default.unlinkSync('./test/deployments.json');
    });
    async function deploySomething() {
        await (0, testDeploy_1.testDeploy)(() => (0, src_1.contract)(exampleArtifacts_1.SimpleContract), {
            saveDeploy: true,
            logFile: logPath,
        });
    }
    function readLog() {
        return fs_1.default.readFileSync(logPath).toString();
    }
});
//# sourceMappingURL=log.test.js.map