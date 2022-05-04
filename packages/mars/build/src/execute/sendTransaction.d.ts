import { BigNumber, providers, Signer } from 'ethers';
export interface TransactionOptions {
    signer: Signer;
    provider: providers.Provider;
    gasPrice: BigNumber;
    gasLimit?: number | BigNumber;
    noConfirm: boolean;
    logFile: string;
    dryRun: boolean;
}
export declare function withGas(transaction: providers.TransactionRequest, gasLimit: number | BigNumber | undefined, gasPrice: BigNumber, signer: Signer): Promise<providers.TransactionRequest & {
    gasLimit: number | BigNumber;
}>;
export declare function sendTransaction(name: string, { signer, gasPrice, noConfirm, gasLimit: overwrittenGasLimit, dryRun }: TransactionOptions, transaction: providers.TransactionRequest): Promise<{
    txHash: string;
    address: string;
    txWithGas: providers.TransactionRequest & {
        gasLimit: number | BigNumber;
    };
}>;
