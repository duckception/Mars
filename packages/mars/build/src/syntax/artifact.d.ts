import { Abi } from '../abi';
import { AbiSymbol, Bytecode, DeployedBytecode, Name, Type } from '../symbols';
export interface ArtifactJSON {
    abi: Abi;
    bytecode: string;
    evm: {
        deployedBytecode: {
            object: string;
        };
    };
}
export declare type ArtifactFrom<T> = {
    [Name]: string;
    [AbiSymbol]: Abi;
    [Bytecode]: string;
    [DeployedBytecode]: string;
    [Type]: T;
} & {
    [K in keyof T]: T[K] extends (...args: infer A) => any ? (...args: A) => string : never;
};
export declare function createArtifact<T>(name: string, json: ArtifactJSON): ArtifactFrom<T>;
