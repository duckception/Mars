import { Action } from '../actions';
import { TransactionOptions } from './sendTransaction';
import { JsonInputs } from '../verification';
import { MultisigConfig } from '../multisig';
export declare type TransactionOverrides = Partial<TransactionOptions> & {
    skipUpgrade?: boolean;
};
export interface ExecuteOptions extends TransactionOptions {
    networkName: string;
    deploymentsFile: string;
    dryRun: boolean;
    logFile: string;
    verification?: {
        etherscanApiKey: string;
        jsonInputs: JsonInputs;
        waffleConfig: string;
        flattenScript?: (name: string) => Promise<string>;
    };
    multisig?: MultisigConfig;
}
export declare function execute(actions: Action[], options: ExecuteOptions): Promise<void>;
export declare function printableToString(data: unknown): string | number | boolean | null | undefined;
