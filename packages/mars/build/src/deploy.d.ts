import { Options } from './options';
import { ExecuteOptions } from './execute/execute';
export declare function deploy<T>(options: Options, callback: (deployer: string, options: ExecuteOptions) => T): Promise<{
    result: T;
} & {
    config: ExecuteOptions;
}>;
