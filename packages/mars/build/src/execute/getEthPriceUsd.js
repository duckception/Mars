"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEthPriceUsd = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function getEthPriceUsd() {
    try {
        const res = await (0, node_fetch_1.default)('https://api.coinpaprika.com/v1/tickers/eth-ethereum');
        const data = await res.json();
        return data.quotes.USD.price;
    }
    catch {
        return 0;
    }
}
exports.getEthPriceUsd = getEthPriceUsd;
//# sourceMappingURL=getEthPriceUsd.js.map