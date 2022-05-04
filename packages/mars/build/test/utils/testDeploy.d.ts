import { MockProvider } from 'ethereum-waffle';
export declare function testDeploy<T>(callback: () => T, options?: {
    saveDeploy?: boolean;
    injectProvider?: MockProvider;
    logFile?: string;
}): Promise<{
    result: T;
    provider: MockProvider;
}>;
