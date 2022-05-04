import type { FutureBoolean } from './boolean';
export declare type MaybeFuture<T> = T | Future<T>;
declare type UnpackFuture<T> = T extends Future<infer U> ? U : T;
export declare class Future<T> {
    resolve: () => T;
    constructor(resolve: () => T);
    static resolve<T>(value: MaybeFuture<T>): T;
    static create<T>(message?: string): readonly [Future<T>, (result: T) => void];
    map<U>(fn: (value: T) => MaybeFuture<U>): Future<U>;
    get<U extends keyof T>(key: U): Future<UnpackFuture<T[U]>>;
    equals(other: MaybeFuture<unknown>): FutureBoolean;
}
declare type FutureTuple<T> = T extends [infer V, ...infer Rest] ? [Future<V>, ...FutureTuple<Rest>] : [];
declare type FutureArray<T> = T extends Array<any> ? FutureTuple<T> : Future<T>[];
declare type UnpackArray<T> = T extends FutureArray<infer U> ? U : never;
declare type ForceArray<T> = T extends Array<any> ? T : T[];
export declare function reduce<T extends FutureArray<any>, R>(futures: T, fn: (...args: ForceArray<UnpackArray<T>>) => R): Future<R>;
export {};
