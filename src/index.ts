import BfxApi from 'bfx-api';
import { createStore as reduxCreateStore, Store as ReduxStore } from 'redux';
import { reducers, Store } from './reducers';

import { ActionTypes as RatesTypes } from './reducers/rates';
import { ActionTypes as WalletsTypes } from './reducers/wallets';

export function createStore(): ReduxStore<Store> {
  return reduxCreateStore(reducers);
}

class ExchangeState {
  private api: BfxApi;
  private store: ReduxStore<Store>;

  constructor() {
    this.api = new BfxApi();
    this.store = createStore();
  }

  public start() {
    this.api.connect();
  }

  public stop() {
    this.api.close();
  }

  public auth(key: string, secret: string) {
    this.api.auth(key, secret,
      (msg: any[]) => {
        if (msg[0] === 0 && (msg[1] === 'ws' || msg[1] === 'wu')) {
          this.store.dispatch({ type: WalletsTypes[msg[1]], payload: msg[2] });
          global.console.log('app wallets', (this.store.getState()).wallets);
        } else {
          global.console.log('app msg', msg);
        }
      },
    );
  }

  public subscribeTicker(pair: string) {
    this.api.subscribeTicker(pair, (msg: any) => {
      this.store.dispatch({
        payload: {
          data: msg[1],
          pair,
        },
        type: RatesTypes.DATA,
      });
      global.console.log('app msg', msg);
      global.console.log('app rates', (this.store.getState()).rates);
    });
  }
}

export default ExchangeState;
