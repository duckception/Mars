export declare type Chain = {
    chainId: number;
    chainName: string;
    getPublicRpc: () => string;
    getInfuraRpc: (infuraApiKey: string) => string;
    getAlchemyRpc: (alchemyApiKey: string) => string;
    getBlockExplorerContractAddress: (contractAddress: string) => string;
    getEtherscanVerifierApi: () => string;
};
export declare type ChainSet = {
    [chainName: string]: Chain;
};
