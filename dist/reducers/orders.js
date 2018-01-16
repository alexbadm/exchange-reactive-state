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
    ActionTypes["os"] = "ORDERS_SNAPSHOT";
    ActionTypes["on"] = "ORDERS_NEW";
    ActionTypes["ou"] = "ORDERS_UPDATE";
    ActionTypes["oc"] = "ORDERS_CANCEL";
})(ActionTypes = exports.ActionTypes || (exports.ActionTypes = {}));
var defaultState = {
    active: [],
    canceled: [],
};
var orders = function (state, _a) {
    if (state === void 0) { state = defaultState; }
    var payload = _a.payload, type = _a.type;
    switch (type) {
        case ActionTypes.os:
            return __assign({}, state, { active: payload });
        case ActionTypes.on:
            return __assign({}, state, { active: state.active.concat([payload]) });
        case ActionTypes.ou:
            return __assign({}, state, { active: state.active
                    .filter(function (order) { return order[0] !== payload[0]; })
                    .concat([payload]) });
        case ActionTypes.oc:
            return __assign({}, state, { active: state.active.filter(function (order) { return order[0] !== payload[0]; }), canceled: state.canceled.concat([payload]) });
        default:
            return state;
    }
};
exports.default = orders;
