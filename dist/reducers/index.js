"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rates_1 = require("./rates");
var wallets_1 = require("./wallets");
var redux_1 = require("redux");
exports.reducers = redux_1.combineReducers({
    rates: rates_1.default,
    wallets: wallets_1.default,
});
