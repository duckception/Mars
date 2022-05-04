export interface SaveEntry {
    txHash?: string;
    address: string;
    multisig: boolean;
}
export declare function save<T>(fileName: string, network: string, key: string, value: T): void;
export declare function read<T>(fileName: string, network: string, key: string): T | undefined;
