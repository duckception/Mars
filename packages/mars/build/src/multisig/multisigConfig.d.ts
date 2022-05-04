import { Signer } from 'ethers';
export interface MultisigConfig {
    networkChainId: number;
    gnosisSafeAddress: string;
    gnosisServiceUri: string;
    multisigSigner: Signer;
}
/**
 * Returns either a valid multisig configuration or undefined in case multisig is not configured at all.
 * It guarantees that no invalid/partial multisig configuration is ever to be processed.
 * @param config multisig configuration -like structure
 */
export declare function ensureMultisigConfig(config: Partial<MultisigConfig>): MultisigConfig | undefined;
