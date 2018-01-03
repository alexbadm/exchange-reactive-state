"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var rates_1 = require("./rates");
var wallets_1 = require("./wallets");
exports.reducers = redux_1.combineReducers({
    rates: rates_1.default,
    wallets: wallets_1.default,
});
