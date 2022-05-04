"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kovan = exports.goerli = exports.rinkeby = exports.ropsten = exports.mainnet = void 0;
exports.mainnet = {
    chainId: 1,
    chainName: 'Mainnet',
    getPublicRpc: () => 'https://main-light.eth.linkpool.io/',
    getInfuraRpc: (infuraApiKey) => `https://mainnet.infura.io/v3/${infuraApiKey}`,
    getAlchemyRpc: (alchemyApiKey) => `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`,
    getBlockExplorerContractAddress: (contractAddress) => `https://etherscan.io/address/${contractAddress}`,
    getEtherscanVerifierApi: () => 'https://api.etherscan.io/api',
};
exports.ropsten = {
    chainId: 3,
    chainName: 'Ropsten',
    getPublicRpc: () => 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    getInfuraRpc: (infuraApiKey) => `https://ropsten.infura.io/v3/${infuraApiKey}`,
    getAlchemyRpc: (alchemyApiKey) => `https://eth-ropsten.alchemyapi.io/v2/${alchemyApiKey}`,
    getBlockExplorerContractAddress: (contractAddress) => `https://ropsten.etherscan.io/address/${contractAddress}`,
    getEtherscanVerifierApi: () => 'https://api-ropsten.etherscan.io/api',
};
exports.rinkeby = {
    chainId: 4,
    chainName: 'Rinkeby',
    getPublicRpc: () => 'https://rinkeby-light.eth.linkpool.io/',
    getInfuraRpc: (infuraApiKey) => `https://rinkeby.infura.io/v3/${infuraApiKey}`,
    getAlchemyRpc: (alchemyApiKey) => `https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`,
    getBlockExplorerContractAddress: (contractAddress) => `https://rinkeby.etherscan.io/address/${contractAddress}`,
    getEtherscanVerifierApi: () => 'https://api-rinkeby.etherscan.io/api',
};
exports.goerli = {
    chainId: 5,
    chainName: 'Goerli',
    getPublicRpc: () => 'https://goerli-light.eth.linkpool.io/',
    getInfuraRpc: (infuraApiKey) => `https://goerli.infura.io/v3/${infuraApiKey}`,
    getAlchemyRpc: (alchemyApiKey) => `https://eth-goerli.alchemyapi.io/v2/${alchemyApiKey}`,
    getBlockExplorerContractAddress: (contractAddress) => `https://goerli.etherscan.io/address/${contractAddress}`,
    getEtherscanVerifierApi: () => 'https://api-goerli.etherscan.io/api',
};
exports.kovan = {
    chainId: 42,
    chainName: 'Kovan',
    getPublicRpc: () => 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    getInfuraRpc: (infuraApiKey) => `https://kovan.infura.io/v3/${infuraApiKey}`,
    getAlchemyRpc: (alchemyApiKey) => `https://eth-kovan.alchemyapi.io/v2/${alchemyApiKey}`,
    getBlockExplorerContractAddress: (contractAddress) => `https://kovan.etherscan.io/address/${contractAddress}`,
    getEtherscanVerifierApi: () => 'https://api-kovan.etherscan.io/api',
};
//# sourceMappingURL=ethereum.js.map