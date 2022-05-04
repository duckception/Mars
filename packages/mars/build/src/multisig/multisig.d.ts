import { providers } from 'ethers';
import { DeterministicDeployment } from './gnosis/contractDeployer';
import { MultisigConfig } from './multisigConfig';
export declare class MultisigTxDispatcher {
    private _contractDeployer;
    private _config;
    private readonly _signer;
    private _safe?;
    private _safeServiceClient;
    txBatch: providers.TransactionRequest[];
    constructor(config: MultisigConfig);
    /**
     * Adds a contract deployment transaction as a multisig batch part.
     *
     * @param tx contract deployment transaction
     * @returns deterministic deployment data in order to be able replicate the transaction later on
     */
    addContractDeployment(tx: providers.TransactionRequest): Promise<DeterministicDeployment>;
    /**
     * Adds a contract interaction transaction as a multisig batch part.
     *
     * @param tx contract deployment transaction
     */
    addContractInteraction(tx: providers.TransactionRequest): void;
    /**
     * Registers a multisig transaction in the multisig system for multisig participants to approve and execute later on.
     *
     * Multisig registration and its various steps may (but does not need to) be transacted in the network on-chain or
     * leveraged off-chain. It depends on the particular multisig service in use.
     * It is guaranteed though that the final execution of the multisig must be transacted and finalized in the network.
     *
     * @returns unique id of the multisig transaction
     */
    propose(): Promise<string>;
    /**
     * Adds one more approval for a given multisig tx by the current signer. The signer must be authorized to approve.
     * @param id identifies the multisig transaction to approve
     */
    approve(id: string): Promise<void>;
    private ensureSafe;
}
