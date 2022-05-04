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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeableContract2 = exports.UpgradeableContract = exports.UpgradeabilityProxy = exports.StorageSlot = exports.SimpleContract = exports.ReservedContract = exports.OpenZeppelinProxy = exports.ERC1967Proxy = exports.ComplexContract = exports.Address = void 0;
/* eslint-disable */
const Mars = __importStar(require("../../src"));
const Address__JSON = require("./../build/Address.json");
const ComplexContract__JSON = require("./../build/ComplexContract.json");
const ERC1967Proxy__JSON = require("./../build/ERC1967Proxy.json");
const OpenZeppelinProxy__JSON = require("./../build/OpenZeppelinProxy.json");
const ReservedContract__JSON = require("./../build/ReservedContract.json");
const SimpleContract__JSON = require("./../build/SimpleContract.json");
const StorageSlot__JSON = require("./../build/StorageSlot.json");
const UpgradeabilityProxy__JSON = require("./../build/UpgradeabilityProxy.json");
const UpgradeableContract__JSON = require("./../build/UpgradeableContract.json");
const UpgradeableContract2__JSON = require("./../build/UpgradeableContract2.json");
exports.Address = Mars.createArtifact("Address", Address__JSON);
exports.ComplexContract = Mars.createArtifact("ComplexContract", ComplexContract__JSON);
exports.ERC1967Proxy = Mars.createArtifact("ERC1967Proxy", ERC1967Proxy__JSON);
exports.OpenZeppelinProxy = Mars.createArtifact("OpenZeppelinProxy", OpenZeppelinProxy__JSON);
exports.ReservedContract = Mars.createArtifact("ReservedContract", ReservedContract__JSON);
exports.SimpleContract = Mars.createArtifact("SimpleContract", SimpleContract__JSON);
exports.StorageSlot = Mars.createArtifact("StorageSlot", StorageSlot__JSON);
exports.UpgradeabilityProxy = Mars.createArtifact("UpgradeabilityProxy", UpgradeabilityProxy__JSON);
exports.UpgradeableContract = Mars.createArtifact("UpgradeableContract", UpgradeableContract__JSON);
exports.UpgradeableContract2 = Mars.createArtifact("UpgradeableContract2", UpgradeableContract2__JSON);
//# sourceMappingURL=exampleArtifacts.js.map