"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var bfx_api_1 = require("bfx-api");
var index_1 = require("./index");
var rates_1 = require("./reducers/rates");
var wallets_1 = require("./reducers/wallets");
var store = index_1.createStore();
global.console.log(store);
global.console.log(store.getState());
var api = new bfx_api_1.default({ logger: console });
var proto = {
    connect: function () {
        _this.api.connect();
    },
};
api.connect();
api.auth('w7Jd6Vp6cnyzGcc45BgCyje5EDeWFjieOezuKARlvOY', 'fqoe1P1yrP23cLtsLGKnoLqJ93XGRAE7ZbQWbZFqf0B', function (msg) {
    if (msg[0] === 0 && (msg[1] === 'ws' || msg[1] === 'wu')) {
        store.dispatch({ type: wallets_1.ActionTypes[msg[1]], payload: msg[2] });
        global.console.log('app wallets', (store.getState()).wallets);
    }
    else {
        global.console.log('app msg', msg);
    }
});
var pair = 'BTCUSD';
api.subscribeTicker(pair, function (msg) {
    store.dispatch({
        payload: {
            data: msg[1],
            pair: pair,
        },
        type: rates_1.ActionTypes.DATA,
    });
    global.console.log('app msg', msg);
    global.console.log('app rates', (store.getState()).rates);
});
