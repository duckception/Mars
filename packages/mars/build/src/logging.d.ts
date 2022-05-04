export declare type LogMode = {
    console: boolean;
    file: boolean;
};
export declare const logConfig: {
    mode: LogMode;
    filepath: string;
};
export declare function log(...args: string[]): void;
