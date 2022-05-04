"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exampleArtifacts_1 = require("../fixtures/exampleArtifacts");
const logging_1 = require("../../src/logging");
const src_1 = require("../../src");
const options = {
    network: 'rinkeby',
    privateKey: process.env.PRIVATE_KEY,
    infuraApiKey: process.env.INFURA_KEY,
    multisig: true,
    multisigGnosisSafe: '0x8772CD484C059EC5c61459a0abb5A45ece16701f',
    multisigGnosisServiceUri: 'https://safe-transaction.rinkeby.gnosis.io',
    disableCommandLineOptions: true,
    noConfirm: true,
};
logging_1.logConfig.mode.console = false;
describe('Multisig', () => {
    it('Dry-runs transactions, collects them as multisig batch and proposes to Gnosis Safe', async () => {
        await (0, src_1.deploy)(options, (deployer) => {
            (0, src_1.debug)(`Deployer is ${deployer}`);
            const proxy = (0, src_1.createProxy)(exampleArtifacts_1.UpgradeabilityProxy);
            const impl = (0, src_1.contract)('impl', exampleArtifacts_1.UpgradeableContract);
            const proxied = proxy(impl, {
                onInitialize: 'initialize',
                params: [112233],
            });
            (0, src_1.debug)('Proxied value:', proxied.x());
            (0, src_1.runIf)(proxied.x().equals(112233), () => {
                proxied.resetTo(102030);
            });
        });
    });
});
//# sourceMappingURL=multisig.e2e.js.map