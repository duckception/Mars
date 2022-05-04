"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDeploy = void 0;
const ethers_1 = require("ethers");
const ethereum_waffle_1 = require("ethereum-waffle");
const context_1 = require("../../src/context");
const execute_1 = require("../../src/execute/execute");
const logging_1 = require("../../src/logging");
async function testDeploy(callback, options = {
    saveDeploy: true,
}) {
    var _a, _b;
    if (options.logFile) {
        logging_1.logConfig.mode = { file: true, console: false };
        logging_1.logConfig.filepath = options.logFile;
    }
    const provider = (_a = options.injectProvider) !== null && _a !== void 0 ? _a : new ethereum_waffle_1.MockProvider();
    const config = {
        networkName: 'test',
        dryRun: !options.saveDeploy,
        noConfirm: true,
        logFile: (_b = options.logFile) !== null && _b !== void 0 ? _b : '',
        deploymentsFile: './test/deployments.json',
        signer: provider.getSigner(0),
        provider: provider,
        gasPrice: ethers_1.BigNumber.from(0),
    };
    context_1.context.enabled = true;
    context_1.context.actions = [];
    const result = callback();
    context_1.context.enabled = false;
    await (0, execute_1.execute)(context_1.context.actions, config);
    return { result, provider };
}
exports.testDeploy = testDeploy;
//# sourceMappingURL=testDeploy.js.map