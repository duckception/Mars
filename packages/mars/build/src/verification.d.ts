export declare function createJsonInputs(sourcePath: string): Promise<Record<string, {
    sources: {
        [key: string]: {
            content: string;
        };
    };
    language: string;
}>>;
declare type Awaited<T> = T extends Promise<infer U> ? U : never;
export declare type JsonInputs = Awaited<ReturnType<typeof createJsonInputs>>;
export declare function verifySingleFile(etherscanApiKey: string, flattenScript: (name: string) => Promise<string>, waffleConfigPath: string, contractName: string, address: string, constructorArgs?: string, network?: string): Promise<void>;
export declare function verify(etherscanApiKey: string, jsonInputs: JsonInputs, waffleConfigPath: string, contractName: string, address: string, constructorArgs?: string, network?: string): Promise<void>;
export {};
