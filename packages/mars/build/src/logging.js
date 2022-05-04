"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.logConfig = void 0;
const fs_1 = __importDefault(require("fs"));
exports.logConfig = {
    mode: {},
    filepath: '',
};
function log(...args) {
    const argsJoined = args.join('\n') + '\n';
    if (exports.logConfig.mode.console) {
        console.log(argsJoined);
    }
    if (exports.logConfig.mode.file && exports.logConfig.filepath) {
        fs_1.default.appendFileSync(exports.logConfig.filepath, argsJoined);
    }
}
exports.log = log;
//# sourceMappingURL=logging.js.map