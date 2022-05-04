"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = exports.save = void 0;
const fs_1 = __importDefault(require("fs"));
function save(fileName, network, key, value) {
    var _a;
    let contents = {};
    if (fs_1.default.existsSync(fileName)) {
        contents = JSON.parse(fs_1.default.readFileSync(fileName, 'utf-8'));
    }
    contents[network] = (_a = contents[network]) !== null && _a !== void 0 ? _a : {};
    contents[network][key] = value;
    fs_1.default.writeFileSync(fileName, JSON.stringify(contents, null, 2) + '\n');
}
exports.save = save;
function read(fileName, network, key) {
    var _a;
    let contents = {};
    if (fs_1.default.existsSync(fileName)) {
        contents = JSON.parse(fs_1.default.readFileSync(fileName, 'utf-8'));
    }
    contents[network] = (_a = contents[network]) !== null && _a !== void 0 ? _a : {};
    return contents[network][key];
}
exports.read = read;
//# sourceMappingURL=save.js.map