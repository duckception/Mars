"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGenerateArgs = void 0;
const argparse_1 = require("argparse");
const parseGenerateArgs = () => {
    const parser = new argparse_1.ArgumentParser({
        description: 'M.A.R.S. - Magically Augmented Release Scripts',
    });
    parser.add_argument('-i', '--input', {
        help: 'contracts directory',
        type: String,
        default: './build',
    });
    parser.add_argument('-o', '--output', {
        help: 'output file path',
        type: String,
        default: './build/artifacts.ts',
    });
    return parser.parse_args();
};
exports.parseGenerateArgs = parseGenerateArgs;
//# sourceMappingURL=parseGenerateArgs.js.map