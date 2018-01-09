import { AnyAction, combineReducers } from 'redux';
import rates, { State as RatesState } from './rates';
import trades, { State as TradesState } from './trades';
import wallets, { State as WalletsState } from './wallets';

export let _: AnyAction;

export interface Store {
  rates: RatesState;
  trades: TradesState;
  wallets: WalletsState;
}

export const reducers = combineReducers<Store>({
  rates,
  trades,
  wallets,
});
