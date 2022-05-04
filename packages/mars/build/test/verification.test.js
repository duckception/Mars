"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verification_1 = require("../src/verification");
describe('Verification', () => {
    it('does not throw if verification fails', async () => {
        await (0, verification_1.verify)('', { contract: {} }, '', 'contract', '', '');
    });
});
//# sourceMappingURL=verification.test.js.map