"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandLineOptions = void 0;
const ethers_1 = require("ethers");
const minimist_1 = __importDefault(require("minimist"));
const checks_1 = require("./checks");
const usage_1 = require("./usage");
const path_1 = __importDefault(require("path"));
const STRING_ARGUMENTS = ['p', 'private-key', 'i', 'infura-key', 'a', 'alchemy-key', 'e', 'etherscan-key', 'f', 'from'];
function getCommandLineOptions() {
    const parsed = (0, minimist_1.default)(process.argv.slice(2), { string: STRING_ARGUMENTS });
    const result = {};
    const showHelp = get(parsed, 'h', 'help');
    if (showHelp) {
        console.log(usage_1.usage);
        process.exit(0);
    }
    checkAllowed(parsed);
    const privateKey = get(parsed, 'p', 'private-key');
    if (privateKey) {
        (0, checks_1.ensurePrivateKey)(privateKey, 'Invalid private key provided as argument');
        result.privateKey = privateKey;
    }
    const network = get(parsed, 'n', 'network');
    if (network) {
        (0, checks_1.ensureNetwork)(network, 'Invalid network provided as argument');
        result.network = network;
    }
    const infuraApiKey = get(parsed, 'i', 'infura-key');
    if (infuraApiKey) {
        (0, checks_1.ensureApiKey)(infuraApiKey, 'Invalid infura api key provided as argument');
        result.infuraApiKey = infuraApiKey;
    }
    const alchemyApiKey = get(parsed, 'a', 'alchemy-key');
    if (alchemyApiKey) {
        (0, checks_1.ensureApiKey)(alchemyApiKey, 'Invalid alchemy api key provided as argument');
        result.alchemyApiKey = alchemyApiKey;
    }
    const outputFile = get(parsed, 'o', 'out-file');
    if (outputFile) {
        (0, checks_1.ensureString)(outputFile, 'Invalid output file provided as argument');
        result.outputFile = outputFile;
    }
    const gasPrice = get(parsed, 'g', 'gas-price');
    if (gasPrice) {
        (0, checks_1.ensureNumber)(gasPrice, 'Invalid gas price (gwei) provided as argument');
        result.gasPrice = ethers_1.BigNumber.from(gasPrice).mul('1000000000');
    }
    const dryRun = get(parsed, 'd', 'dry-run');
    if (dryRun) {
        (0, checks_1.ensureBoolean)(dryRun, 'You cannot specify a value alongside dry run');
        result.dryRun = dryRun;
    }
    const fromAddress = get(parsed, 'f', 'from');
    if (fromAddress) {
        (0, checks_1.ensureAddress)(fromAddress, 'Invalid transaction sender address provided');
        result.fromAddress = fromAddress;
    }
    const logFile = get(parsed, 'l', 'log');
    if (logFile) {
        (0, checks_1.ensureString)(logFile, 'Invalid log file provided as argument');
        result.logFile = logFile;
    }
    const noConfirm = get(parsed, 'y', 'yes');
    if (noConfirm) {
        (0, checks_1.ensureBoolean)(noConfirm, 'You cannot specify a value alongside yes');
        result.noConfirm = noConfirm;
    }
    const verify = get(parsed, 'v', 'verify');
    if (verify) {
        if (typeof verify === 'string') {
            const scriptPath = path_1.default.join(process.cwd(), verify);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            result.flattenScript = require(scriptPath).default;
            result.verify = true;
        }
        else {
            (0, checks_1.ensureBoolean)(verify, 'You cannot specify a value alongside verify');
            result.verify = verify;
        }
    }
    const etherscanApiKey = get(parsed, 'e', 'etherscan-key');
    if (etherscanApiKey) {
        (0, checks_1.ensureApiKey)(etherscanApiKey, 'Invalid etherscan api key provided as argument');
        result.etherscanApiKey = etherscanApiKey;
    }
    const sources = get(parsed, 's', 'sources');
    if (sources) {
        (0, checks_1.ensureString)(sources, 'Invalid sources directory provided as argument');
        result.sources = sources;
    }
    const waffleConfig = get(parsed, 'w', 'waffle-config');
    if (waffleConfig) {
        (0, checks_1.ensureString)(waffleConfig, 'Invalid waffle config file provided as argument');
        result.waffleConfig = waffleConfig;
    }
    return result;
}
exports.getCommandLineOptions = getCommandLineOptions;
function checkAllowed(parsed) {
    const options = Object.keys(parsed).filter((x) => x !== '_');
    for (const option of options) {
        if (!usage_1.ALLOWED_OPTIONS.includes(option)) {
            (0, checks_1.exit)(`Invalid option specified: ${option}`);
        }
    }
    if (parsed._.length !== 0) {
        (0, checks_1.exit)(`Invalid option specified: ${parsed._[0]}`);
    }
}
function get(parsed, short, full) {
    var _a;
    if (parsed[short] && parsed[full]) {
        (0, checks_1.exit)(`Both -${short} and --${full} specified`);
    }
    return (_a = parsed[short]) !== null && _a !== void 0 ? _a : parsed[full];
}
//# sourceMappingURL=cli.js.map