"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const src_1 = require("../../src");
describe('Reduce', () => {
    it('sums two Futures', async () => {
        (0, utils_1.expectFuture)((0, src_1.reduce)([new src_1.Future(() => 1), new src_1.Future(() => 2)], (a, b) => a + b), 3);
    });
    it('different types', async () => {
        (0, utils_1.expectFuture)((0, src_1.reduce)([new src_1.Future(() => 1), new src_1.Future(() => 'aaa')], (a, b) => `${a}${b}`), '1aaa');
    });
    it('accepts a list with one item', async () => {
        (0, utils_1.expectFuture)((0, src_1.reduce)([new src_1.Future(() => 32)], (a) => a + 10), 42);
    });
    it('returns callback result for empty list', async () => {
        (0, utils_1.expectFuture)((0, src_1.reduce)([], () => 100), 100);
    });
});
//# sourceMappingURL=reduce.test.js.map