"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionTypes;
(function (ActionTypes) {
    ActionTypes["te"] = "TRADES_TRADE_EXECUTED";
    ActionTypes["tu"] = "TRADES_TRADE_EXECUTION_UPDATE";
})(ActionTypes = exports.ActionTypes || (exports.ActionTypes = {}));
var trades = function (state, _a) {
    if (state === void 0) { state = []; }
    var payload = _a.payload, type = _a.type;
    switch (type) {
        case ActionTypes.te:
            return state.concat([payload]);
        case ActionTypes.tu:
            return state
                .filter(function (trade) { return trade[0] !== payload[0]; })
                .concat([payload]);
        default:
            return state;
    }
};
exports.default = trades;
