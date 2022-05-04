import { Action } from './actions';
import { MultisigTxDispatcher } from './multisig';
export declare const context: {
    enabled: boolean;
    ensureEnabled(): void;
    actions: Action[];
    conditionalDepth: number;
    multisig: MultisigTxDispatcher | undefined;
};
