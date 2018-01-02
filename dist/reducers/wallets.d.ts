import { Reducer } from 'redux';
export declare enum ActionTypes {
    ws = "WALLETS_STATE",
    wu = "WALLETS_UPDATE",
}
export declare type CurrencyBalance = [string, string, number, number, number | null];
export declare type State = CurrencyBalance[];
declare const wallets: Reducer<State>;
export default wallets;
