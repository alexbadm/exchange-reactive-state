"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var init = function (state, action) {
    switch (action.type) {
        default:
            return state;
    }
};
exports.reducers = redux_1.combineReducers({
    init: init,
});
