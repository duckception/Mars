import { Future, MaybeFuture } from './future';
export declare type BooleanLike = MaybeFuture<boolean>;
export declare class FutureBoolean extends Future<boolean> {
    not(): FutureBoolean;
    and(other: BooleanLike): FutureBoolean;
    or(other: BooleanLike): FutureBoolean;
    thenElse<T, U>(thenValue: MaybeFuture<T>, elseValue: MaybeFuture<U>): Future<T | U>;
}
