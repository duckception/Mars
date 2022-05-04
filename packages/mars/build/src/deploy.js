"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const context_1 = require("./context");
const options_1 = require("./options");
const execute_1 = require("./execute/execute");
const multisig_1 = require("./multisig");
const logging_1 = require("./logging");
async function deploy(options, callback) {
    const config = await (0, options_1.getConfig)(options);
    context_1.context.enabled = true;
    context_1.context.actions = [];
    context_1.context.multisig = config.multisig ? new multisig_1.MultisigTxDispatcher(config.multisig) : undefined;
    const result = callback(await config.signer.getAddress(), config);
    context_1.context.enabled = false;
    await (0, execute_1.execute)(context_1.context.actions, config);
    // Refactor -> extract to multisig extension
    if (config.multisig && context_1.context.multisig) {
        if (context_1.context.multisig.txBatch.length > 0) {
            const multisigId = await context_1.context.multisig.propose();
            await context_1.context.multisig.approve(multisigId);
        }
        else {
            (0, logging_1.log)('Multisig batch empty. Nothing to process.');
        }
    }
    return { result, config };
}
exports.deploy = deploy;
//# sourceMappingURL=deploy.js.map