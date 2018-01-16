import { Reducer } from 'redux';
export declare enum ActionTypes {
    os = "ORDERS_SNAPSHOT",
    on = "ORDERS_NEW",
    ou = "ORDERS_UPDATE",
    oc = "ORDERS_CANCEL",
}
export declare type Order = [number, number, number, string, number, number, number, number, string, string, number, string, number, number, number, number, number, number, number];
export interface State {
    active: Order[];
    canceled: Order[];
}
declare const orders: Reducer<State>;
export default orders;
