import * as Mars from "../../src";
export declare const Address: Mars.ArtifactFrom<new () => void>;
export declare const ComplexContract: Mars.ArtifactFrom<{
    new (_: Mars.NumberLike, __: Mars.StringLike): void;
    add(a: Mars.NumberLike): Mars.FutureNumber;
    complexMapping(_: Mars.NumberLike, __: Mars.AddressLike): Mars.Future<[Mars.FutureNumber, Mars.FutureNumber]>;
    number(): Mars.FutureNumber;
    setter(arg1: Mars.StringLike, arg2: Mars.MaybeFuture<Mars.NumberLike[]>, options?: Mars.TransactionOverrides | undefined): Mars.Transaction;
    simpleArray(_: Mars.NumberLike): Mars.FutureNumber;
    simpleMapping(_: Mars.NumberLike): Mars.Future<string>;
    str(): Mars.Future<string>;
    twoDArray(_: Mars.NumberLike, __: Mars.NumberLike): Mars.FutureNumber;
    viewNoArgs(): Mars.FutureNumber;
    viewReturnsStruct(): Mars.Future<{
        a: Mars.FutureNumber;
        b: Mars.FutureNumber;
        c: Mars.Future<Mars.Future<{
            x: Mars.FutureNumber;
            y: Mars.FutureNumber;
        }>[]>;
    }>;
    viewReturnsTuple(): Mars.Future<[Mars.FutureNumber, Mars.Future<string>, Mars.FutureBoolean]>;
}>;
export declare const ERC1967Proxy: Mars.ArtifactFrom<new (_logic: Mars.AddressLike, _data: Mars.BytesLike) => void>;
export declare const OpenZeppelinProxy: Mars.ArtifactFrom<{
    new (_logic: Mars.AddressLike, _data: Mars.BytesLike): void;
    upgradeTo(implementation: Mars.AddressLike, options?: Mars.TransactionOverrides | undefined): Mars.Transaction;
}>;
export declare const ReservedContract: Mars.ArtifactFrom<{
    new (): void;
    foo(_package: Mars.NumberLike, _yield: Mars.NumberLike, _void: Mars.NumberLike, _with: Mars.NumberLike, options?: Mars.TransactionOverrides | undefined): Mars.Transaction;
}>;
export declare const SimpleContract: Mars.ArtifactFrom<{
    new (): void;
    hello(): Mars.Future<string>;
}>;
export declare const StorageSlot: Mars.ArtifactFrom<new () => void>;
export declare const UpgradeabilityProxy: Mars.ArtifactFrom<{
    new (): void;
    implementation(): Mars.Future<string>;
    upgradeTo(impl: Mars.AddressLike, options?: Mars.TransactionOverrides | undefined): Mars.Transaction;
}>;
export declare const UpgradeableContract: Mars.ArtifactFrom<{
    new (): void;
    initialize(_x: Mars.NumberLike, options?: Mars.TransactionOverrides | undefined): Mars.Transaction;
    reInitializeOne(options?: Mars.TransactionOverrides | undefined): Mars.Transaction;
    resetTo(_x: Mars.NumberLike, options?: Mars.TransactionOverrides | undefined): Mars.Transaction;
    x(): Mars.FutureNumber;
}>;
export declare const UpgradeableContract2: Mars.ArtifactFrom<{
    new (): void;
    x(): Mars.FutureNumber;
}>;
