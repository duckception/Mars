"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseGenerateArgs_1 = require("./parseGenerateArgs");
const generator_1 = require("./generator");
const args = (0, parseGenerateArgs_1.parseGenerateArgs)();
(0, generator_1.runGenerator)(args.input, args.output);
//# sourceMappingURL=bin.js.map