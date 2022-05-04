"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const chai_1 = require("chai");
const src_1 = require("../../src");
describe('Generator', () => {
    it('generates correct artifacts', async () => {
        (0, src_1.runGenerator)('./test/build', './test/fixtures/artifacts.ts');
        const contractAbi = fs_1.default.readFileSync('./test/fixtures/artifacts.ts').toString().trim();
        // Skip eslint comment & import
        const expectedAbi = fs_1.default
            .readFileSync('./test/fixtures/exampleArtifacts.ts')
            .toString()
            .split('\n')
            .slice(3)
            .join('\n')
            .trim();
        (0, chai_1.expect)(contractAbi.startsWith(`import * as Mars from "ethereum-mars";\n\n`));
        (0, chai_1.expect)(contractAbi.replace(`import * as Mars from "ethereum-mars";\n\n`, '')).to.equal(expectedAbi);
    });
    after(() => {
        fs_1.default.unlinkSync('./test/fixtures/artifacts.ts');
    });
});
//# sourceMappingURL=generator.test.js.map