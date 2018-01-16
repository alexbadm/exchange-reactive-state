import { AnyAction, combineReducers } from 'redux';
import orders, { ActionTypes as OrdersTypes, State as OrdersState } from './orders';
import rates, { ActionTypes as RatesTypes, State as RatesState } from './rates';
import trades, { ActionTypes as TradesTypes, State as TradesState } from './trades';
import wallets, { ActionTypes as WalletsTypes, State as WalletsState } from './wallets';

export let _: AnyAction;

export const ActionTypes = {
  orders: OrdersTypes,
  rates: RatesTypes,
  trades: TradesTypes,
  wallets: WalletsTypes,
};

export interface Store {
  orders: OrdersState;
  rates: RatesState;
  trades: TradesState;
  wallets: WalletsState;
}

export const reducers = combineReducers<Store>({
  orders,
  rates,
  trades,
  wallets,
});
