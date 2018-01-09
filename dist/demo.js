"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cors = require("cors");
var express = require("express");
var incremean_1 = require("incremean");
var index_1 = require("./index");
function subsError(e) {
    global.console.log('failed to subscribe', e);
}
var tradingTokensAll = [
    'btc', 'usd', 'ltc', 'eth', 'etc', 'rrt', 'zec', 'xmr', 'dsh', 'eur', 'xrp',
    'iot', 'eos', 'san', 'omg', 'bch', 'neo', 'etp', 'qtm', 'avt', 'edo', 'btg',
    'dat', 'qsh', 'yyw', 'gnt', 'snt', 'bat', 'mna', 'fun', 'zrx', 'tnb', 'spk',
];
var symbols = [
    'btcusd', 'ltcusd', 'ltcbtc', 'ethusd', 'ethbtc', 'etcbtc', 'etcusd',
    'rrtusd', 'rrtbtc', 'zecusd', 'zecbtc', 'xmrusd', 'xmrbtc', 'dshusd',
    'dshbtc', 'btceur', 'xrpusd', 'xrpbtc', 'iotusd', 'iotbtc', 'ioteth',
    'eosusd', 'eosbtc', 'eoseth', 'sanusd', 'sanbtc', 'saneth', 'omgusd',
    'omgbtc', 'omgeth', 'bchusd', 'bchbtc', 'bcheth', 'neousd', 'neobtc',
    'neoeth', 'etpusd', 'etpbtc', 'etpeth', 'qtmusd', 'qtmbtc', 'qtmeth',
    'avtusd', 'avtbtc', 'avteth', 'edousd', 'edobtc', 'edoeth', 'btgusd',
    'btgbtc', 'datusd', 'datbtc', 'dateth', 'qshusd', 'qshbtc', 'qsheth',
    'yywusd', 'yywbtc', 'yyweth', 'gntusd', 'gntbtc', 'gnteth', 'sntusd',
    'sntbtc', 'snteth', 'ioteur', 'batusd', 'batbtc', 'bateth', 'mnausd',
    'mnabtc', 'mnaeth', 'funusd', 'funbtc', 'funeth', 'zrxusd', 'zrxbtc',
    'zrxeth', 'tnbusd', 'tnbbtc', 'tnbeth', 'spkusd', 'spkbtc', 'spketh',
];
var tradingTokens = tradingTokensAll.map(function (s) { return s.toUpperCase(); });
var allPairs = symbols.map(function (s) { return s.toUpperCase(); });
var pairRules = allPairs.reduce(function (result, pair) {
    var coin = pair.slice(0, 3);
    var currency = pair.slice(3);
    if (result[coin]) {
        result[coin].push(currency);
    }
    else {
        result[coin] = [currency];
    }
    return result;
}, {});
var pairReverseRules = Object.keys(pairRules)
    .reduce(function (result, coin) {
    pairRules[coin].forEach(function (currency) {
        if (result[currency]) {
            result[currency].push(coin);
        }
        else {
            result[currency] = [coin];
        }
    });
    return result;
}, {});
var state = new index_1.default();
var API_KEY = process.env.API_KEY || '';
var API_SECRET = process.env.API_SECRET || '';
state.auth(API_KEY, API_SECRET)
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
function calculateChains(limit, threshold) {
    if (limit === void 0) { limit = 0; }
    if (threshold === void 0) { threshold = 0.01; }
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
        .filter(function (res) { return res[0] > threshold; })
        .sort(function (a, b) { return b[0] - a[0]; });
    return (limit === 0 || leaders.length <= limit) ? leaders : leaders.slice(0, limit);
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
    var topChains = calculateChains(6, 0.2);
    var after = Date.now();
    var time = after - before;
    addStatistics('time', time);
    topChains.forEach(function (res) { return addStatistics(res[1] + "-" + res[2] + "-" + res[3] + "-" + res[1], res[0]); });
}, process.env.INTERVAL || 3000);
var server = express();
server.use(cors());
server.get('/state', function (_, res) {
    res.json(state.getState()).end();
});
server.get('/statistics', function (_, res) {
    res.json(statistics).end();
});
var port = process.env.PORT || 3000;
server.listen(port, function () { return global.console.log('server is listening on ' + port); });
