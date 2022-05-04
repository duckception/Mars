"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arbitrum_rinkeby = exports.arbitrum = void 0;
exports.arbitrum = {
    chainId: 42161,
    chainName: 'Arbitrum',
    getPublicRpc: () => 'https://arb1.arbitrum.io/rpc',
    getInfuraRpc: (infuraApiKey) => `https://arbitrum-mainnet.infura.io/v3/${infuraApiKey}`,
    getAlchemyRpc: (alchemyApiKey) => `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    getBlockExplorerContractAddress: (contractAddress) => `https://arbiscan.io/address/${contractAddress}`,
    getEtherscanVerifierApi: () => 'https://api.arbiscan.io/api',
};
exports.arbitrum_rinkeby = {
    chainId: 421611,
    chainName: 'Arbitrum Testnet',
    getPublicRpc: () => 'https://rinkeby.arbitrum.io/rpc',
    getInfuraRpc: (infuraApiKey) => `https://arbitrum-rinkeby.infura.io/v3/${infuraApiKey}`,
    getAlchemyRpc: (alchemyApiKey) => `https://arb-rinkeby.g.alchemy.com/v2/${alchemyApiKey}`,
    getBlockExplorerContractAddress: (contractAddress) => `https://testnet.arbiscan.io/address/${contractAddress}`,
    getEtherscanVerifierApi: () => 'https://api-testnet.arbiscan.io/api',
};
//# sourceMappingURL=arbitrum.js.map