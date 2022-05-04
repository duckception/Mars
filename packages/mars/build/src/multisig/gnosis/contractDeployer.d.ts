import { Contract, providers } from 'ethers';
export interface DeterministicDeployment {
    address: string;
    transaction: providers.TransactionRequest;
}
/**
 * Creates contract deployment transactions targeting deterministic addresses using CREATE2 opcode.
 */
export declare class ContractDeployer {
    private networkChainId;
    constructor(networkChainId: number);
    /**
     * Creates a new contract deployment transactions and precomputes its deterministic creation address.
     * @param unwrappedDeploymentTx a raw deployment transaction
     * @returns wrapped contract deployment transaction and contract deployment address
     */
    createDeploymentTx(unwrappedDeploymentTx: providers.TransactionRequest): Promise<DeterministicDeployment>;
    getDeployerContract(): Contract;
}
