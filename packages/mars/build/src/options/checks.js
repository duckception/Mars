"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exit = exports.ensureNetwork = exports.ensureBoolean = exports.ensureNumber = exports.ensureString = exports.ensureApiKey = exports.ensureAddress = exports.ensurePrivateKey = void 0;
const chain_1 = require("./chain");
const usage_1 = require("./usage");
const PRIVATE_KEY_REGEX = /^0x[a-f\d]{64}$/i;
function ensurePrivateKey(value, message) {
    ensureRegex(PRIVATE_KEY_REGEX, value, message);
}
exports.ensurePrivateKey = ensurePrivateKey;
const ADDRESS = /^0x[a-f\d]{40}$/i;
function ensureAddress(value, message) {
    ensureRegex(ADDRESS, value, message);
}
exports.ensureAddress = ensureAddress;
const API_KEY_REGEX = /^[^\s]+$/;
function ensureApiKey(value, message) {
    ensureRegex(API_KEY_REGEX, value, message);
}
exports.ensureApiKey = ensureApiKey;
function ensureRegex(regex, value, message) {
    ensure((value) => typeof value === 'string' && regex.test(value), value, message);
}
function ensureString(value, message) {
    ensure((value) => typeof value === 'string', value, message);
}
exports.ensureString = ensureString;
function ensureNumber(value, message) {
    ensure((value) => typeof value === 'number', value, message);
}
exports.ensureNumber = ensureNumber;
function ensureBoolean(value, message) {
    ensure((value) => typeof value === 'boolean', value, message);
}
exports.ensureBoolean = ensureBoolean;
const URL_REGEX = /^https?:\/\/[^\s]+$/;
function isProperNetwork(value) {
    return typeof value === 'string' && (value in chain_1.chains || URL_REGEX.test(value));
}
function ensureNetwork(value, message) {
    ensure(isProperNetwork, value, message);
}
exports.ensureNetwork = ensureNetwork;
function ensure(check, value, message) {
    if (!check(value)) {
        exit(message);
    }
}
function exit(message) {
    if (process.env.NODE_ENV === 'test') {
        throw new Error(message);
    }
    console.error(`Error: ${message}`);
    console.log(usage_1.usage);
    console.error(`Error: ${message}`);
    process.exit(1);
}
exports.exit = exit;
//# sourceMappingURL=checks.js.map