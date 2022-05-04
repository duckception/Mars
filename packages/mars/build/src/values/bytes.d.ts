/// <reference types="node" />
import { Future, MaybeFuture } from './future';
import { FutureBoolean } from './boolean';
export declare type BytesLike = MaybeFuture<string> | MaybeFuture<number[]> | MaybeFuture<Buffer>;
export declare function resolveBytesLike(value: BytesLike): Buffer;
export declare class FutureBytes extends Future<Buffer> {
    equals(other: MaybeFuture<Buffer>): FutureBoolean;
}
