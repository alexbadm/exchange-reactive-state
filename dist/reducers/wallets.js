"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionTypes;
(function (ActionTypes) {
    ActionTypes["ws"] = "WALLETS_STATE";
    ActionTypes["wu"] = "WALLETS_UPDATE";
})(ActionTypes = exports.ActionTypes || (exports.ActionTypes = {}));
var wallets = function (state, _a) {
    if (state === void 0) { state = []; }
    var payload = _a.payload, type = _a.type;
    switch (type) {
        case ActionTypes.ws:
            return payload;
        case ActionTypes.wu:
            return state
                .filter(function (bal) { return bal[0] !== payload[0] && bal[1] !== payload[1]; })
                .concat(payload);
        default:
            return state;
    }
};
exports.default = wallets;
