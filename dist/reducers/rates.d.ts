import { Reducer } from 'redux';
export declare enum ActionTypes {
    DATA = "RATES_DATA",
}
export interface State {
    [pair: string]: Rate;
}
export declare type Rate = [number, number, number, number, number, number, number, number, number, number];
declare const rates: Reducer<State>;
export default rates;
