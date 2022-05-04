"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGenerator = exports.Result = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const escapeReservedKeyword_1 = require("./escapeReservedKeyword");
exports.Result = null;
function runGenerator(inDir, outFile) {
    const files = (0, fs_1.readdirSync)((0, path_1.resolve)(inDir));
    const defs = [];
    const imports = [];
    for (const file of files) {
        if (!file.endsWith('.json'))
            continue;
        const json = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)((0, path_1.resolve)(inDir), file), { encoding: 'utf-8' }));
        const { abi, bytecode } = json;
        if (!bytecode || bytecode === '0x')
            continue;
        imports.push(makeJsonImport((0, path_1.resolve)(inDir), file, (0, path_1.resolve)(outFile)));
        defs.push(makeDefinition((0, path_1.basename)(file, '.json'), abi));
    }
    const source = makeSource(imports, defs);
    (0, fs_1.writeFileSync)((0, path_1.resolve)(outFile), source);
}
exports.runGenerator = runGenerator;
function makeSource(imports, defs) {
    return 'import * as Mars from "ethereum-mars";\n\n' + imports.join('\n') + '\n\n' + defs.join('\n\n') + '\n';
}
function makeJsonImport(sourcePath, sourceFile, outPath) {
    const name = (0, path_1.basename)(sourceFile, '.json');
    const relativePath = (0, path_1.relative)((0, path_1.dirname)(outPath), (0, path_1.join)(sourcePath, sourceFile));
    return `const ${name}__JSON = require("./${relativePath}");`;
}
function makeDefinition(name, abi) {
    const constructor = abi.find((fun) => fun.type === 'constructor');
    const functions = abi.filter((fun) => fun.type === 'function');
    const methods = functions.map((fun) => `${fun.name}${makeArguments(fun)}: ${makeReturn(fun)};`);
    methods.unshift(`new${makeArguments(constructor)}: void;`);
    const generic = `{\n  ${methods.join('\n  ')}\n}`;
    const artifact = `Mars.createArtifact<${generic}>("${name}", ${name}__JSON)`;
    return `export const ${name} = ${artifact};`;
}
function makeArguments(abi) {
    if (!abi) {
        return `()`;
    }
    let unnamedParamsCount = 0;
    const getInputName = (input) => {
        if (input.name) {
            return (0, escapeReservedKeyword_1.escapeReservedKeyword)(input.name);
        }
        return '_'.repeat(++unnamedParamsCount);
    };
    const args = abi.inputs.map((input) => `${getInputName(input)}: ${makeInputType(input.type, input.components)}`);
    if ('stateMutability' in abi &&
        abi.stateMutability !== 'view' &&
        abi.stateMutability !== 'pure' &&
        abi.type !== 'constructor') {
        if (args.length === 0) {
            return '(options?: Mars.TransactionOverrides)';
        }
        return `(${args.join(', ')}, options?: Mars.TransactionOverrides)`;
    }
    return `(${args.join(', ')})`;
}
function makeInputType(type, components) {
    if (type.endsWith('[]')) {
        return `Mars.MaybeFuture<${makeInputType(type.slice(0, -2), components)}[]>`;
    }
    if (type.startsWith('uint') || type.startsWith('int')) {
        return 'Mars.NumberLike';
    }
    if (type === 'tuple' && components) {
        return `Mars.MaybeFuture<{${components
            .map(({ name, type, components }) => `${name}: ${makeInputType(type, components)}`)
            .join(', ')}}>`;
    }
    if (type === 'address') {
        return 'Mars.AddressLike';
    }
    if (type === 'bool') {
        return 'Mars.BooleanLike';
    }
    if (type === 'string') {
        return 'Mars.StringLike';
    }
    if (type.startsWith('byte')) {
        return 'Mars.BytesLike';
    }
    throw new Error(`Unknown type ${type}`);
}
function makeOutputsType(outputs) {
    if (outputs.length === 1) {
        return makeOutputType(outputs[0].type, outputs[0].components);
    }
    else {
        return `Mars.Future<[${outputs.map(({ type, components }) => makeOutputType(type, components)).join(', ')}]>`;
    }
}
function makeOutputType(type, components) {
    if (type.endsWith('[]')) {
        return `Mars.Future<${makeOutputType(type.slice(0, -2), components)}[]>`;
    }
    if (type.startsWith('uint') || type.startsWith('int')) {
        return 'Mars.FutureNumber';
    }
    if (type === 'tuple' && components) {
        return `Mars.Future<{${components
            .map(({ name, type, components }) => `${name}: ${makeOutputType(type, components)}`)
            .join(', ')}}>`;
    }
    if (type === 'address' || type === 'string') {
        return 'Mars.Future<string>';
    }
    if (type === 'bool') {
        return 'Mars.FutureBoolean';
    }
    if (type.startsWith('byte')) {
        return 'Mars.FutureBytes';
    }
    throw new Error(`Unknown type ${type}`);
}
function makeReturn(abi) {
    if (abi.stateMutability !== 'view' && abi.stateMutability !== 'pure')
        return 'Mars.Transaction';
    if (!abi.outputs || abi.outputs.length === 0)
        return 'void';
    return makeOutputsType(abi.outputs);
}
//# sourceMappingURL=generator.js.map