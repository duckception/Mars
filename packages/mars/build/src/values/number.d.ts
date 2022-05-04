import { BigNumber } from 'ethers';
import { FutureBoolean } from './boolean';
import { Future, MaybeFuture } from './future';
export declare type NumberLike = MaybeFuture<number> | MaybeFuture<BigNumber>;
export declare function resolveNumberLike(value: NumberLike): BigNumber;
export declare class FutureNumber extends Future<BigNumber> {
    add(other: NumberLike): FutureNumber;
    sub(other: NumberLike): FutureNumber;
    mul(other: NumberLike): FutureNumber;
    div(other: NumberLike): FutureNumber;
    mod(other: NumberLike): FutureNumber;
    pow(other: NumberLike): FutureNumber;
    lt(other: NumberLike): FutureBoolean;
    lte(other: NumberLike): FutureBoolean;
    gt(other: NumberLike): FutureBoolean;
    gte(other: NumberLike): FutureBoolean;
    equals(other: NumberLike): FutureBoolean;
}
