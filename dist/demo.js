"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cors = require("cors");
var express = require("express");
var incremean_1 = require("incremean");
var index_1 = require("./index");
function subsError(e) {
    global.console.log('failed to subscribe', e);
}
var tradingTokens = [
    'USD',
    'BTC',
    'IOT',
    'ETH',
    'OMG',
    'DAT',
    'DSH',
];
var pairRules = {
    BTC: ['USD', 'EUR'],
    DAT: ['USD', 'BTC', 'ETH'],
    DSH: ['USD', 'BTC'],
    ETH: ['USD', 'BTC'],
    IOT: ['USD', 'BTC', 'ETH', 'EUR'],
    OMG: ['USD', 'BTC', 'ETH'],
};
var allPairs = Object.keys(pairRules).reduce(function (result, cur1) {
    pairRules[cur1].forEach(function (cur2) {
        var pair = cur1 + cur2;
        result.push(pair);
    });
    return result;
}, []);
var pairReverseRules = {
    BTC: ['DAT', 'DSH', 'ETH', 'IOT', 'OMG'],
    ETH: ['DAT', 'IOT', 'OMG'],
    EUR: ['BTC', 'IOT'],
    USD: ['BTC', 'DAT', 'DSH', 'ETH', 'IOT', 'OMG'],
};
var state = new index_1.default();
state.auth('your key', 'your secret')
    .catch(function (e) { return global.console.log('auth error', e); });
allPairs.forEach(function (pair) { return state.subscribeTicker(pair).catch(subsError); });
state.start();
function calculateAllPrices() {
    var rates = state.getState().rates;
    var allPrices = {};
    allPairs.forEach(function (pair) {
        var rPair = pair.slice(3) + pair.slice(0, 3);
        if (rates[pair]) {
            allPrices[pair] = [rates[pair][0], rates[pair][2], true];
            allPrices[rPair] = [1 / rates[pair][2], 1 / rates[pair][0], false];
        }
    });
    return allPrices;
}
function calculateChains() {
    var prices = calculateAllPrices();
    var results = [];
    tradingTokens.forEach(function (baseCurrency) {
        var level1 = pairRules[baseCurrency]
            ? pairRules[baseCurrency].concat(pairReverseRules[baseCurrency])
            : pairReverseRules[baseCurrency];
        if (!level1) {
            return;
        }
        var baseCurrencySum = 100;
        level1.forEach(function (step1Currency) {
            var pair = baseCurrency + step1Currency;
            if (!prices[pair]) {
                return;
            }
            var level2 = pairRules[step1Currency]
                ? pairRules[step1Currency].concat(pairReverseRules[step1Currency])
                : pairReverseRules[step1Currency];
            if (!level2) {
                return;
            }
            var step1Index = baseCurrencySum * prices[pair][0];
            level2.forEach(function (step2Currency) {
                var pair2 = step1Currency + step2Currency;
                if (!prices[pair2]) {
                    return;
                }
                var step2Index = step1Index * prices[pair2][0];
                var pair3 = step2Currency + baseCurrency;
                if (!prices[pair3]) {
                    return;
                }
                var summaryIndex = step2Index * prices[pair3][0];
                var profit = Math.round((summaryIndex / baseCurrencySum - 1) * 10000) / 100;
                results.push([
                    profit,
                    baseCurrency,
                    step1Currency,
                    step2Currency,
                ]);
            });
        });
    });
    var leaders = results
        .filter(function (res) { return res[0] > 0.01; })
        .sort(function (a, b) { return b[0] - a[0]; });
    return leaders.length < 4 ? leaders : [leaders[0], leaders[1], leaders[3]];
}
var statistics = {
    time: {
        avg: new incremean_1.default(),
        max: Number.MIN_SAFE_INTEGER,
        min: Number.MAX_SAFE_INTEGER,
    },
};
function addStatistics(key, value) {
    if (!statistics[key]) {
        statistics[key] = {
            avg: new incremean_1.default(),
            max: value,
            min: value,
        };
    }
    else {
        if (value > statistics[key].max) {
            statistics[key].max = value;
        }
        if (value < statistics[key].min) {
            statistics[key].min = value;
        }
    }
    statistics[key].avg.add(value);
}
setInterval(function () {
    var before = Date.now();
    var top3 = calculateChains();
    var after = Date.now();
    var time = after - before;
    addStatistics('time', time);
    top3.forEach(function (res) { return addStatistics(res[1] + "-" + res[2] + "-" + res[3] + "-" + res[1], res[0]); });
}, 3000);
var server = express();
server.use(cors());
server.get('/state', function (_, res) {
    res.json(state.getState()).end();
});
server.get('/statistics', function (_, res) {
    res.json(statistics).end();
});
var port = 3010;
server.listen(port, function () { return global.console.log('server is listening on ' + port); });
