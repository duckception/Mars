"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentOptions = void 0;
const checks_1 = require("./checks");
function getEnvironmentOptions() {
    const privateKey = process.env.PRIVATE_KEY;
    const etherscanApiKey = process.env.ETHERSCAN_KEY;
    const infuraApiKey = process.env.INFURA_KEY;
    const alchemyApiKey = process.env.ALCHEMY_KEY;
    const result = {};
    if (privateKey) {
        (0, checks_1.ensurePrivateKey)(privateKey, 'Invalid private key provided in the environment variable: PRIVATE_KEY');
        result.privateKey = privateKey;
    }
    if (etherscanApiKey) {
        (0, checks_1.ensureApiKey)(etherscanApiKey, 'Invalid api key provided in the environment variable: ETHERSCAN_KEY');
        result.etherscanApiKey = etherscanApiKey;
    }
    if (infuraApiKey) {
        (0, checks_1.ensureApiKey)(infuraApiKey, 'Invalid api key provided in the environment variable: INFURA_KEY');
        result.infuraApiKey = infuraApiKey;
    }
    if (alchemyApiKey) {
        (0, checks_1.ensureApiKey)(alchemyApiKey, 'Invalid api key provided in the environment variable: ALCHEMY_KEY');
        result.alchemyApiKey = alchemyApiKey;
    }
    return result;
}
exports.getEnvironmentOptions = getEnvironmentOptions;
//# sourceMappingURL=environment.js.map