"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectFuture = void 0;
const chai_1 = require("chai");
const expectFuture = (future, expected) => (0, chai_1.expect)(future.resolve()).to.deep.equal(expected);
exports.expectFuture = expectFuture;
//# sourceMappingURL=expect.js.map