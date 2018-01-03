"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bfx_api_1 = require("bfx-api");
var redux_1 = require("redux");
var reducers_1 = require("./reducers");
var rates_1 = require("./reducers/rates");
var wallets_1 = require("./reducers/wallets");
function createStore() {
    return redux_1.createStore(reducers_1.reducers);
}
exports.createStore = createStore;
var ExchangeState = (function () {
    function ExchangeState() {
        this.api = new bfx_api_1.default();
        this.store = createStore();
    }
    ExchangeState.prototype.getState = function () {
        return this.store.getState();
    };
    ExchangeState.prototype.start = function () {
        this.api.connect();
    };
    ExchangeState.prototype.stop = function () {
        this.api.close();
    };
    ExchangeState.prototype.auth = function (key, secret) {
        var _this = this;
        this.api.auth(key, secret, function (msg) {
            if (msg[0] === 0 && (msg[1] === 'ws' || msg[1] === 'wu')) {
                _this.store.dispatch({ type: wallets_1.ActionTypes[msg[1]], payload: msg[2] });
                global.console.log('app wallets', (_this.store.getState()).wallets);
            }
            else {
                global.console.log('app msg', msg);
            }
        });
    };
    ExchangeState.prototype.subscribeTicker = function (pair) {
        var _this = this;
        this.api.subscribeTicker(pair, function (msg) {
            _this.store.dispatch({
                payload: {
                    data: msg[1],
                    pair: pair,
                },
                type: rates_1.ActionTypes.DATA,
            });
            global.console.log('app msg', msg);
            global.console.log('app rates', (_this.store.getState()).rates);
        });
    };
    return ExchangeState;
}());
exports.default = ExchangeState;
