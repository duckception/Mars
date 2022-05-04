import { Address } from '../symbols';
import { StringLike } from './string';
export declare type AddressLike = StringLike | {
    [Address]: StringLike;
};
