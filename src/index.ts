import BfxApi from 'bfx-api';
import { SnapshotCallback } from 'bfx-api/dist/BfxApi';
import { SubscribeEvent } from 'bfx-api/dist/bitfinexTypes';
import { createStore as reduxCreateStore, Store as ReduxStore } from 'redux';
import { reducers, Store } from './reducers';

import { ActionTypes as RatesTypes } from './reducers/rates';
import { ActionTypes as TradesTypes } from './reducers/trades';
import { ActionTypes as WalletsTypes } from './reducers/wallets';

export function createStore(): ReduxStore<Store> {
  return reduxCreateStore(reducers);
}

class ExchangeState {
  public api: BfxApi;
  private store: ReduxStore<Store>;

  constructor() {
    this.api = new BfxApi();
    this.store = createStore();
  }

  public getState() {
    return this.store.getState();
  }

  public start() {
    this.api.connect();
  }

  public stop() {
    this.api.close();
  }

  public auth(key: string, secret: string, callback?: SnapshotCallback) {
    return this.api.auth(key, secret,
      (msg: any[]) => {
        if (msg[0] === 0) {
          if (msg[1] === 'ws' || msg[1] === 'wu') {
            this.store.dispatch({ type: WalletsTypes[msg[1]], payload: msg[2] });
          } else if (msg[1] === 'te' || msg[1] === 'tu') {
            this.store.dispatch({ type: TradesTypes[msg[1]], payload: msg[2] });
          }
        }
        if (callback) {
          callback(msg);
        }
      },
    );
  }

  public subscribeTicker(pair: string): Promise<SubscribeEvent> {
    return this.api.subscribeTicker(pair, (msg: any) => {
      this.store.dispatch({
        payload: {
          data: msg[1],
          pair,
        },
        type: RatesTypes.DATA,
      });
    });
  }
}

export default ExchangeState;
