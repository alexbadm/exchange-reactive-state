"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var orders_1 = require("./orders");
var rates_1 = require("./rates");
var trades_1 = require("./trades");
var wallets_1 = require("./wallets");
exports.ActionTypes = {
    orders: orders_1.ActionTypes,
    rates: rates_1.ActionTypes,
    trades: trades_1.ActionTypes,
    wallets: wallets_1.ActionTypes,
};
exports.reducers = redux_1.combineReducers({
    orders: orders_1.default,
    rates: rates_1.default,
    trades: trades_1.default,
    wallets: wallets_1.default,
});
