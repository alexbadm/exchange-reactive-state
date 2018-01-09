import { Reducer } from 'redux';
export declare enum ActionTypes {
    te = "TRADES_TRADE_EXECUTED",
    tu = "TRADES_TRADE_EXECUTION_UPDATE",
}
export declare type Trade = [number, string, number, number, number, number, string, number, number, number, string];
export declare type State = Trade[];
declare const trades: Reducer<State>;
export default trades;
