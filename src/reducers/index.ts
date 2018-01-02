import rates, { State as RatesState } from './rates';
import wallets, { State as WalletsState } from './wallets';

import { AnyAction, combineReducers } from 'redux';

export let _: AnyAction;

export interface Store {
  rates: RatesState;
  wallets: WalletsState;
}

export const reducers = combineReducers<Store>({
  rates,
  wallets,
});
