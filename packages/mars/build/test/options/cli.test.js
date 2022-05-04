"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const cli_1 = require("../../src/options/cli");
const PRIVATE_KEY = `0x${'1'.repeat(64)}`;
describe('getCommandLineOptions', () => {
    function withParams(params, callback) {
        const backup = process.argv;
        const options = Array.isArray(params) ? params : [...params.split(' ')];
        process.argv = ['node', 'file.js', ...options.filter((x) => x !== '')];
        try {
            return callback();
        }
        finally {
            process.argv = backup;
        }
    }
    function getOptions(params) {
        return withParams(params, cli_1.getCommandLineOptions);
    }
    it('throws on invalid argument', () => {
        (0, chai_1.expect)(() => getOptions('-x')).to.throw();
    });
    function checkParam(name, short, long, valid, invalid, expected = valid) {
        describe(name, () => {
            if (Array.isArray(valid)) {
                for (const [i, item] of valid.entries()) {
                    it(`recognises shorter -${short} ${item}`, () => {
                        (0, chai_1.expect)(getOptions([`-${short}`, item])).to.deep.equal({
                            [name]: expected[i],
                        });
                    });
                    it(`recognises longer --${long} ${item}`, () => {
                        (0, chai_1.expect)(getOptions([`--${long}`, item])).to.deep.equal({
                            [name]: expected[i],
                        });
                    });
                }
            }
            else {
                it(`recognises shorter -${short}`, () => {
                    (0, chai_1.expect)(getOptions([`-${short}`, valid])).to.deep.equal({
                        [name]: expected,
                    });
                });
                it(`recognises longer --${long}`, () => {
                    (0, chai_1.expect)(getOptions([`--${long}`, valid])).to.deep.equal({
                        [name]: expected,
                    });
                });
            }
            it(`fails for invalid -${short}`, () => {
                (0, chai_1.expect)(() => getOptions([`-${short}`, invalid])).to.throw();
            });
            it(`fails for invalid --${long}`, () => {
                (0, chai_1.expect)(() => getOptions([`--${long}`, invalid])).to.throw();
            });
            it(`fails for simultaneous -${short} and --${long}`, () => {
                (0, chai_1.expect)(() => getOptions(`-${short} 123 --${long} 123`)).to.throw();
            });
        });
    }
    checkParam('privateKey', 'p', 'private-key', PRIVATE_KEY, '0x123');
    checkParam('network', 'n', 'network', ['mainnet', 'http://foo', 'https://bar'], 'foo');
    checkParam('infuraApiKey', 'i', 'infura-key', 'boo', 'bam bam');
    checkParam('alchemyApiKey', 'a', 'alchemy-key', 'boo', 'bam bam');
    checkParam('outputFile', 'o', 'out-file', 'file.json', '123');
    checkParam('gasPrice', 'g', 'gas-price', '2', 'foo', ethers_1.BigNumber.from('2000000000'));
    checkParam('dryRun', 'd', 'dry-run', '', 'asd', true);
    checkParam('fromAddress', 'f', 'from', '0xAF98FD86fBe3e490417A95B4B6c1572bB227a7CC', 'asd');
    checkParam('logFile', 'l', 'log', 'mars.log', '123');
    checkParam('noConfirm', 'y', 'yes', '', 'asd', true);
    checkParam('verify', 'v', 'verify', '', 'asd', true);
    checkParam('etherscanApiKey', 'e', 'etherscan-key', 'boo', 'bam bam');
    checkParam('sources', 's', 'sources', 'dir', '123');
    checkParam('waffleConfig', 'w', 'waffle-config', 'waffle-config.json', '123');
    it('can read multiple parameters at once', () => {
        (0, chai_1.expect)(getOptions(['-vd', '--sources', 'foo'])).to.deep.equal({
            sources: 'foo',
            verify: true,
            dryRun: true,
        });
    });
});
//# sourceMappingURL=cli.test.js.map