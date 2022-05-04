export declare function ensurePrivateKey(value: unknown, message: string): asserts value is string;
export declare function ensureAddress(value: unknown, message: string): asserts value is string;
export declare function ensureApiKey(value: unknown, message: string): asserts value is string;
export declare function ensureString(value: unknown, message: string): asserts value is string;
export declare function ensureNumber(value: unknown, message: string): asserts value is number;
export declare function ensureBoolean(value: unknown, message: string): asserts value is boolean;
export declare function ensureNetwork(value: unknown, message: string): asserts value is string;
export declare function exit(message: string): never;
