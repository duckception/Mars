import { ConstructorParams, Contract, NoParams, WithParams } from './contract';
import { ArtifactFrom } from './artifact';
declare type Params<T> = T extends (...args: infer A) => any ? A : never;
/**
 * Optional arguments for proxy instance creation
 */
declare type ProxyOptionals<T, U extends keyof T> = {
    /**
     * Custom name for the proxied contract
     */
    name?: string;
    /**
     * Routine to be executed at first deployment
     */
    onInitialize?: U;
    /**
     * Params for the initialization routine
     */
    params?: Params<T[U]>;
};
/**
 * Proxy that wraps contract implementations. Exposes factory methods that create wrapped instances of contracts.
 * Such proxy instances take care of specific contract proxies deployment, initialization and upgrades if underlying
 * implementation changes.
 */
export interface Proxy {
    /**
     * Creates a proxied implementation for a contract with optional initialization routine.
     * @param contract logic contract
     * @param onInitialize initialization routine to be performed once at the first deployment
     */ <T>(contract: Contract<T>, onInitialize?: (contract: Contract<T>) => unknown): Contract<T>;
    /**
     * Creates a proxied implementation for a contract with optional initialization routine and its params.
     * @param contract logic contract
     * @param onInitialize initialization routine to be performed once at the first deployment
     * @param params parameters to the initialization routine
     */ <T, U extends keyof T>(contract: Contract<T>, onInitialize?: U, params?: Params<T[U]>): Contract<T>;
    /**
     * Creates a named proxied implementation for a contract with optional initialization routine.
     * @param name custom name of the proxied contract
     * @param contract logic contract
     * @param onInitialize initialization routine to be performed once at the first deployment
     */ <T>(name: string, contract: Contract<T>, onInitialize?: (contract: Contract<T>) => unknown): Contract<T>;
    /**
     * Creates a named proxied implementation for a contract with optional initialization routine and its params.
     * @param name custom name of the proxied contract
     * @param contract logic contract
     * @param onInitialize initialization routine to be performed once at the first deployment
     * @param params parameters to the initialization routine
     */ <T, U extends keyof T>(name: string, contract: Contract<T>, onInitialize?: U, params?: Params<T[U]>): Contract<T>;
    /**
     * Creates a proxied implementation for a contract with a set of optional arguments.
     * @param contract logic contract
     * @param optionals set of optional parameters
     */ <T, U extends keyof T>(contract: Contract<T>, optionals: ProxyOptionals<T, U>): Contract<T>;
}
declare type MethodCall<T> = keyof T | ((contract: Contract<T>) => unknown);
export declare function createProxy<T extends NoParams>(artifact: ArtifactFrom<T>, onUpgrade?: MethodCall<T>): Proxy;
export declare function createProxy<T extends WithParams>(artifact: ArtifactFrom<T>, params: ConstructorParams<T>, onUpgrade?: MethodCall<T>): Proxy;
export {};
