import BfxApi from 'bfx-api';
import { SnapshotCallback } from 'bfx-api/dist/BfxApi';
import { SubscribeEvent } from 'bfx-api/dist/bitfinexTypes';
import { createStore as reduxCreateStore, Store as ReduxStore } from 'redux';
import { ActionTypes, reducers, Store } from './reducers';

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
          const sign = msg[1];
          const payload = msg[2];

          switch (sign[0]) {
            case 'o':
              this.store.dispatch({ type: ActionTypes.orders[sign], payload });
              break;
            case 't':
              this.store.dispatch({ type: ActionTypes.trades[sign], payload });
              break;
            case 'w':
              this.store.dispatch({ type: ActionTypes.wallets[sign], payload });
              break;
          }
          if (callback) {
            callback(msg);
          }
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
        type: ActionTypes.rates.DATA,
      });
    });
  }
}

export default ExchangeState;
