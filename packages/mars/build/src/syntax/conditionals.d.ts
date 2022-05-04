import { BooleanLike } from '../values';
export declare function runIf<T>(condition: BooleanLike, action: () => T): {
    else: <U>(alternate: () => U) => void;
    elseIf: <U_1>(otherCondition: BooleanLike, alternate: () => U_1) => any;
};
