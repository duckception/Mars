"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeReservedKeyword = void 0;
// See: https://github.com/microsoft/TypeScript/issues/2536#issuecomment-87194347
const TYPESCRIPT_RESERVED_KEYWORDS = [
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'null',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    // Reserved in strict mode:',
    'as',
    'implements',
    'interface',
    'let',
    'package',
    'private',
    'protected',
    'public',
    'static',
    'yield',
];
function escapeReservedKeyword(name) {
    return TYPESCRIPT_RESERVED_KEYWORDS.includes(name) ? `_${name}` : name;
}
exports.escapeReservedKeyword = escapeReservedKeyword;
//# sourceMappingURL=escapeReservedKeyword.js.map