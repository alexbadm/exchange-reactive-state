"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bfx_api_1 = require("bfx-api");
var redux_1 = require("redux");
var reducers_1 = require("./reducers");
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
    ExchangeState.prototype.auth = function (key, secret, callback) {
        var _this = this;
        return this.api.auth(key, secret, function (msg) {
            if (msg[0] === 0) {
                var sign = msg[1];
                var payload = msg[2];
                switch (sign[0]) {
                    case 'o':
                        _this.store.dispatch({ type: reducers_1.ActionTypes.orders[sign], payload: payload });
                        break;
                    case 't':
                        _this.store.dispatch({ type: reducers_1.ActionTypes.trades[sign], payload: payload });
                        break;
                    case 'w':
                        _this.store.dispatch({ type: reducers_1.ActionTypes.wallets[sign], payload: payload });
                        break;
                }
                if (callback) {
                    callback(msg);
                }
            }
        });
    };
    ExchangeState.prototype.subscribeTicker = function (pair) {
        var _this = this;
        return this.api.subscribeTicker(pair, function (msg) {
            _this.store.dispatch({
                payload: {
                    data: msg[1],
                    pair: pair,
                },
                type: reducers_1.ActionTypes.rates.DATA,
            });
        });
    };
    return ExchangeState;
}());
exports.default = ExchangeState;
