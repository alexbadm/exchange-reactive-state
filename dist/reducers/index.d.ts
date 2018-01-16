import { AnyAction } from 'redux';
import { ActionTypes as OrdersTypes, State as OrdersState } from './orders';
import { ActionTypes as RatesTypes, State as RatesState } from './rates';
import { ActionTypes as TradesTypes, State as TradesState } from './trades';
import { ActionTypes as WalletsTypes, State as WalletsState } from './wallets';
export declare let _: AnyAction;
export declare const ActionTypes: {
    orders: typeof OrdersTypes;
    rates: typeof RatesTypes;
    trades: typeof TradesTypes;
    wallets: typeof WalletsTypes;
};
export interface Store {
    orders: OrdersState;
    rates: RatesState;
    trades: TradesState;
    wallets: WalletsState;
}
export declare const reducers: (state: Store, action: AnyAction) => Store;
