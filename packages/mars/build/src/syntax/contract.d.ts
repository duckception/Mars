import { ArtifactFrom } from './artifact';
import { Address, ArtifactSymbol, Name } from '../symbols';
import { Future } from '../values';
import { TransactionOverrides } from '../execute/execute';
export declare type Contract<T> = {
    [ArtifactSymbol]: ArtifactFrom<T>;
    [Name]: string;
    [Address]: Future<string>;
} & {
    [K in keyof T]: T[K] extends (...args: infer A) => infer R ? (...args: A) => R : never;
} & {
    getStorageAt: (address: string) => Future<string>;
};
export declare type ConstructorParams<T> = T extends {
    new (...args: infer A): any;
} ? A : any;
export interface NoParams {
    new (): any;
}
export interface WithParams {
    new (first: any, ...args: any): any;
}
export declare function contract<T extends NoParams>(artifact: ArtifactFrom<T>): Contract<T>;
export declare function contract<T extends NoParams>(artifact: ArtifactFrom<T>, options: TransactionOverrides): Contract<T>;
export declare function contract<T extends NoParams>(name: string, artifact: ArtifactFrom<T>): Contract<T>;
export declare function contract<T extends NoParams>(name: string, artifact: ArtifactFrom<T>, options: TransactionOverrides): Contract<T>;
export declare function contract<T extends WithParams>(artifact: ArtifactFrom<T>, params: ConstructorParams<T>): Contract<T>;
export declare function contract<T extends WithParams>(artifact: ArtifactFrom<T>, params: ConstructorParams<T>, options: TransactionOverrides): Contract<T>;
export declare function contract<T extends WithParams>(name: string, artifact: ArtifactFrom<T>, params: ConstructorParams<T>): Contract<T>;
export declare function contract<T extends WithParams>(name: string, artifact: ArtifactFrom<T>, params: ConstructorParams<T>, options: TransactionOverrides): Contract<T>;
export declare function makeContractInstance<T>(name: string, artifact: ArtifactFrom<T>, address: Future<string>): Contract<T>;
