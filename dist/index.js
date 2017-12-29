"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var reducers_1 = require("./reducers");
function createState() {
    return redux_1.createStore(reducers_1.reducers);
}
exports.createState = createState;
