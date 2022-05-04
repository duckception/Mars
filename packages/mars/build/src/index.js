"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.runIf = exports.createArtifact = exports.createProxy = exports.contract = exports.deploy = exports.Result = exports.runGenerator = void 0;
var generator_1 = require("./generate/generator");
Object.defineProperty(exports, "runGenerator", { enumerable: true, get: function () { return generator_1.runGenerator; } });
Object.defineProperty(exports, "Result", { enumerable: true, get: function () { return generator_1.Result; } });
var deploy_1 = require("./deploy");
Object.defineProperty(exports, "deploy", { enumerable: true, get: function () { return deploy_1.deploy; } });
var contract_1 = require("./syntax/contract");
Object.defineProperty(exports, "contract", { enumerable: true, get: function () { return contract_1.contract; } });
var createProxy_1 = require("./syntax/createProxy");
Object.defineProperty(exports, "createProxy", { enumerable: true, get: function () { return createProxy_1.createProxy; } });
var artifact_1 = require("./syntax/artifact");
Object.defineProperty(exports, "createArtifact", { enumerable: true, get: function () { return artifact_1.createArtifact; } });
var conditionals_1 = require("./syntax/conditionals");
Object.defineProperty(exports, "runIf", { enumerable: true, get: function () { return conditionals_1.runIf; } });
var debug_1 = require("./syntax/debug");
Object.defineProperty(exports, "debug", { enumerable: true, get: function () { return debug_1.debug; } });
__exportStar(require("./values"), exports);
//# sourceMappingURL=index.js.map