"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var index_1 = require("./index");
var port = process.env.PORT || 3000;
function subsError(e) {
    global.console.log('failed to subscribe', e);
}
var symbols = [
    'BTCUSD', 'LTCUSD', 'LTCBTC', 'ETHUSD', 'ETHBTC', 'ETCBTC', 'ETCUSD',
    'RRTUSD', 'RRTBTC', 'ZECUSD', 'ZECBTC', 'XMRUSD', 'XMRBTC', 'DSHUSD',
    'DSHBTC', 'BTCEUR', 'XRPUSD', 'XRPBTC', 'IOTUSD', 'IOTBTC', 'IOTETH',
    'EOSUSD', 'EOSBTC', 'EOSETH', 'SANUSD', 'SANBTC', 'SANETH', 'OMGUSD',
    'OMGBTC', 'OMGETH', 'BCHUSD', 'BCHBTC', 'BCHETH', 'NEOUSD', 'NEOBTC',
    'NEOETH', 'ETPUSD', 'ETPBTC', 'ETPETH', 'QTMUSD', 'QTMBTC', 'QTMETH',
    'AVTUSD', 'AVTBTC', 'AVTETH', 'EDOUSD', 'EDOBTC', 'EDOETH', 'BTGUSD',
    'BTGBTC', 'DATUSD', 'DATBTC', 'DATETH', 'QSHUSD', 'QSHBTC', 'QSHETH',
    'YYWUSD', 'YYWBTC', 'YYWETH', 'GNTUSD', 'GNTBTC', 'GNTETH', 'SNTUSD',
    'SNTBTC', 'SNTETH', 'IOTEUR', 'BATUSD', 'BATBTC', 'BATETH', 'MNAUSD',
    'MNABTC', 'MNAETH', 'FUNUSD', 'FUNBTC', 'FUNETH', 'ZRXUSD', 'ZRXBTC',
    'ZRXETH', 'TNBUSD', 'TNBBTC', 'TNBETH', 'SPKUSD', 'SPKBTC', 'SPKETH',
];
var onlyCoins = ['BTC', 'IOT', 'USD', 'ETH', 'DSH'];
var allPairs = symbols.filter(function (s) { return ~onlyCoins.indexOf(s.slice(0, 3)) && ~onlyCoins.indexOf(s.slice(3)); });
var state = new index_1.default();
var API_KEY = process.env.API_KEY || '';
var API_SECRET = process.env.API_SECRET || '';
state.auth(API_KEY, API_SECRET)
    .catch(function (e) { return global.console.log('auth error', e); });
allPairs.forEach(function (pair) { return state.subscribeTicker(pair).catch(subsError); });
state.start();
var server = express();
server.use(function (_, res) { return res.json(state.getState()); });
server.listen(port, function () { return global.console.log('server is listening on ' + port); });
