import { AnyAction } from 'redux';
import { State as RatesState } from './rates';
import { State as TradesState } from './trades';
import { State as WalletsState } from './wallets';
export declare let _: AnyAction;
export interface Store {
    rates: RatesState;
    trades: TradesState;
    wallets: WalletsState;
}
export declare const reducers: (state: Store, action: AnyAction) => Store;
