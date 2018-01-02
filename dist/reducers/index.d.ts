import { State as RatesState } from './rates';
import { State as WalletsState } from './wallets';
import { AnyAction } from 'redux';
export declare let _: AnyAction;
export interface Store {
    rates: RatesState;
    wallets: WalletsState;
}
export declare const reducers: (state: Store, action: AnyAction) => Store;
