"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ActionTypes;
(function (ActionTypes) {
    ActionTypes["DATA"] = "RATES_DATA";
})(ActionTypes = exports.ActionTypes || (exports.ActionTypes = {}));
var rates = function (state, _a) {
    if (state === void 0) { state = {}; }
    var payload = _a.payload, type = _a.type;
    switch (type) {
        case ActionTypes.DATA:
            return __assign({}, state, (_b = {}, _b[payload.pair] = payload.data, _b));
        default:
            return state;
    }
    var _b;
};
exports.default = rates;
