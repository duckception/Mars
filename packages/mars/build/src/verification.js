"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.verifySingleFile = exports.createJsonInputs = void 0;
const imports_fs_1 = require("@resolver-engine/imports-fs");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const chain_1 = require("./options/chain");
const isDirectory = (directoryPath) => fs_1.default.existsSync(path_1.default.resolve(directoryPath)) && fs_1.default.statSync(path_1.default.resolve(directoryPath)).isDirectory();
function findInputs(sourcePath) {
    const stack = [sourcePath];
    const inputFiles = [];
    while (stack.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const dir = stack.pop();
        const files = fs_1.default.readdirSync(dir);
        for (const file of files) {
            const filePath = path_1.default.join(dir, file);
            if (isDirectory(filePath)) {
                stack.push(filePath);
            }
            else if (file.endsWith('.sol')) {
                inputFiles.push(filePath);
            }
        }
    }
    return inputFiles;
}
function fromEntries(args) {
    return args.reduce((result, [key, value]) => ({
        ...result,
        [key]: value,
    }), {});
}
function canonizeImports(source, globalUrls) {
    let canonizedSource = source;
    for (const globalUrl of globalUrls) {
        canonizedSource = canonizedSource.replace(new RegExp(globalUrl, 'gim'), path_1.default.basename(globalUrl));
    }
    return canonizedSource;
}
async function createJsonInputs(sourcePath) {
    const resolver = (0, imports_fs_1.ImportsFsEngine)().addResolver(imports_fs_1.resolvers.BacktrackFsResolver());
    const allContracts = findInputs(sourcePath);
    return fromEntries(await Promise.all(allContracts.map(async (contract) => {
        const sources = await (0, imports_fs_1.gatherSourcesAndCanonizeImports)([contract], '.', resolver);
        const globalUrls = sources.map(({ url }) => url);
        return [
            path_1.default.parse(contract).name,
            {
                sources: fromEntries(sources.map(({ source, url }) => [path_1.default.basename(url), { content: canonizeImports(source, globalUrls) }])),
                language: 'Solidity',
            },
        ];
    })));
}
exports.createJsonInputs = createJsonInputs;
const etherscanUrl = (network) => {
    if (!network) {
        return chain_1.chains.mainnet.getEtherscanVerifierApi();
    }
    const url = chain_1.chains[network].getEtherscanVerifierApi();
    if (url) {
        return url;
    }
    else {
        throw new Error('Block explorer not supported for requested network');
    }
};
function getBlockExplorerContractAddress(address, network) {
    if (!network || network === 'mainnet') {
        return chain_1.chains.mainnet.getBlockExplorerContractAddress(address);
    }
    return chain_1.chains[network].getBlockExplorerContractAddress(address);
}
async function getCompilerOptions(waffleConfigPath) {
    var _a, _b, _c, _d, _e, _f;
    const config = JSON.parse(fs_1.default.readFileSync(waffleConfigPath).toString());
    const compilerVersion = config.compilerVersion;
    const isOptimized = (_c = (_b = (_a = config.compilerOptions) === null || _a === void 0 ? void 0 : _a.optimizer) === null || _b === void 0 ? void 0 : _b.enabled) !== null && _c !== void 0 ? _c : true;
    const optimizerRuns = !isOptimized ? 0 : (_f = (_e = (_d = config.compilerOptions) === null || _d === void 0 ? void 0 : _d.optimizer) === null || _e === void 0 ? void 0 : _e.runs) !== null && _f !== void 0 ? _f : 200;
    return {
        compilerVersion,
        isOptimized,
        optimizerRuns,
    };
}
async function isContractVerified(etherscanApiKey, address, network) {
    const response = (await axios_1.default.get(`${etherscanUrl(network)}?${querystring_1.default.stringify({
        module: 'contract',
        action: 'getabi',
        apikey: etherscanApiKey,
        address,
    })}`)).data;
    return (response === null || response === void 0 ? void 0 : response.status) === '1';
}
async function getVerificationRequestBody(etherscanApiKey, waffleConfigPath, jsonInput, address, contractName, constructorArgs) {
    var _a;
    const waffleConfig = await getCompilerOptions(waffleConfigPath);
    const inputWithOptions = {
        ...jsonInput,
        settings: {
            optimizer: {
                enabled: waffleConfig.isOptimized,
                runs: waffleConfig.optimizerRuns,
            },
        },
    };
    return querystring_1.default.stringify({
        apikey: etherscanApiKey,
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: address.toLowerCase(),
        sourceCode: JSON.stringify(inputWithOptions),
        codeformat: 'solidity-standard-json-input',
        contractname: `${contractName}.sol:${contractName}`,
        compilerversion: waffleConfig.compilerVersion,
        constructorArguements: (_a = constructorArgs === null || constructorArgs === void 0 ? void 0 : constructorArgs.slice(2)) !== null && _a !== void 0 ? _a : '',
        licenseType: '1',
    });
}
async function getSingleFileVerificationRequestBody(etherscanApiKey, waffleConfigPath, source, address, contractName, constructorArgs) {
    var _a;
    const waffleConfig = await getCompilerOptions(waffleConfigPath);
    return querystring_1.default.stringify({
        apikey: etherscanApiKey,
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: address.toLowerCase(),
        sourceCode: source,
        codeformat: 'solidity-single-file',
        contractname: contractName,
        compilerversion: waffleConfig.compilerVersion,
        constructorArguements: (_a = constructorArgs === null || constructorArgs === void 0 ? void 0 : constructorArgs.slice(2)) !== null && _a !== void 0 ? _a : '',
        licenseType: '3',
        optimizationUsed: waffleConfig.isOptimized ? 1 : 0,
        runs: waffleConfig.optimizerRuns,
    });
}
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
async function waitForContract() {
    process.stdout.write(chalk_1.default.blue('Waiting for Etherscan to acknowledge the contract...'));
    await sleep(30000);
}
function clearLine() {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
}
async function sendRequest(body, contractName, network) {
    clearLine();
    process.stdout.write(chalk_1.default.blue('Sending request to Etherscan...'));
    const res = (await axios_1.default.post(etherscanUrl(network), body, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
    })).data;
    if (res.status === '0') {
        console.log(chalk_1.default.bold(chalk_1.default.yellow(`\nVerification of ${contractName} failed: ${res.result}`)));
        return;
    }
    return res.result;
}
async function waitForResult(etherscanApiKey, guid, network) {
    clearLine();
    process.stdout.write(chalk_1.default.blue('Patiently waiting for verification in queue...'));
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await sleep(5000);
        const res = (await axios_1.default.get(`${etherscanUrl(network)}?${querystring_1.default.stringify({
            apikey: etherscanApiKey,
            guid,
            module: 'contract',
            action: 'checkverifystatus',
        })}`)).data;
        if (res.result.startsWith('Fail')) {
            clearLine();
            console.log(chalk_1.default.bold(chalk_1.default.yellow(`Verification of failed: ${res.result}`)));
            return false;
        }
        if (res.result.startsWith('Pass')) {
            clearLine();
            return true;
        }
    }
}
async function verifySingleFile(etherscanApiKey, flattenScript, waffleConfigPath, contractName, address, constructorArgs, network) {
    var _a;
    const flatContract = await flattenScript(`${contractName}.sol`);
    if (await isContractVerified(etherscanApiKey, address, network)) {
        console.log(chalk_1.default.bold(chalk_1.default.green(`Contract ${contractName} is already verified under ${address}. Skipping\n`)));
        return;
    }
    console.log(chalk_1.default.green(`Verifying ${contractName} on Etherscan`));
    try {
        const body = await getSingleFileVerificationRequestBody(etherscanApiKey, waffleConfigPath, flatContract, address, contractName, constructorArgs);
        await waitForContract();
        const guid = await sendRequest(body, contractName, network);
        if (!guid) {
            return;
        }
        if (await waitForResult(etherscanApiKey, guid)) {
            console.log(chalk_1.default.bold(chalk_1.default.green(`Contract verified at ${getBlockExplorerContractAddress(address, network)}\n`)));
        }
    }
    catch (err) {
        console.log(chalk_1.default.bold(chalk_1.default.yellow(`Error during verification: ${(_a = err.message) !== null && _a !== void 0 ? _a : err}. Skipping\n`)));
    }
}
exports.verifySingleFile = verifySingleFile;
async function verify(etherscanApiKey, jsonInputs, waffleConfigPath, contractName, address, constructorArgs, network) {
    var _a;
    const jsonInput = jsonInputs[contractName];
    if (!jsonInput) {
        console.log(chalk_1.default.bold(chalk_1.default.yellow(`No sources found for ${contractName}. Skipping\n`)));
        return;
    }
    if (await isContractVerified(etherscanApiKey, address, network)) {
        console.log(chalk_1.default.bold(chalk_1.default.green(`Contract ${contractName} is already verified under ${address}. Skipping\n`)));
        return;
    }
    console.log(chalk_1.default.green(`Verifying ${contractName} on Etherscan`));
    try {
        const body = await getVerificationRequestBody(etherscanApiKey, waffleConfigPath, jsonInput, address, contractName, constructorArgs);
        await waitForContract();
        const guid = await sendRequest(body, contractName, network);
        if (!guid) {
            return;
        }
        if (await waitForResult(etherscanApiKey, guid)) {
            console.log(chalk_1.default.bold(chalk_1.default.green(`Contract verified at ${getBlockExplorerContractAddress(address, network)}\n`)));
        }
    }
    catch (err) {
        console.log(chalk_1.default.bold(chalk_1.default.yellow(`Error during verification: ${(_a = err.message) !== null && _a !== void 0 ? _a : err}. Skipping\n`)));
    }
}
exports.verify = verify;
//# sourceMappingURL=verification.js.map